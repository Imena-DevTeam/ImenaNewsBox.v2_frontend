import { describe, expect, it } from "vitest";
import {
  SESSION_MAX_AGE,
  createSessionToken,
  getSessionRole,
  isAdminPath,
  isAdminPublicPath,
  isMemberPath,
  isStudioPath,
  mayUseStudio,
  readSession,
} from "./session";
import { editTokenData } from "./token-test-utils";

const MEMBER = { role: "member", userId: "0199-member" } as const;

/**
 * The session cookie: a role and an id, signed by this server.
 *
 * It decides what the frontend shows and which areas the middleware lets a
 * request into; the backend decides what anybody may do. These hold that
 * nobody can write one by hand, raise their own role, or keep one past its
 * lifetime.
 */
describe("session token", () => {
  it("reads back the role and id it was issued with", async () => {
    const token = await createSessionToken(MEMBER);
    expect(await readSession(token!)).toEqual(MEMBER);
  });

  it.each(["member", "social_media_manager", "admin"] as const)(
    "carries the %s role",
    async (role) => {
      const token = await createSessionToken({ role, userId: "u-1" });
      expect(await getSessionRole(token!)).toBe(role);
    },
  );

  it("rejects a hand-written cookie", async () => {
    expect(await readSession("v3.eyJyIjoiYWRtaW4ifQ.forged")).toBeNull();
    expect(await readSession("admin")).toBeNull();
    expect(await readSession(undefined)).toBeNull();
  });

  /* Editing your own cookie changes its data, so the signature no longer
     matches: a member cannot make themselves an administrator, or somebody
     else. */
  it("will not let a member rewrite themselves into an admin", async () => {
    const now = Date.now();
    const token = (await createSessionToken(MEMBER, now))!;
    const asAdmin = editTokenData(token, (data) => ({ ...data, r: "admin" }));
    const asOther = editTokenData(token, (data) => ({ ...data, u: "someone" }));

    expect(await readSession(asAdmin, now)).toBeNull();
    expect(await readSession(asOther, now)).toBeNull();
  });

  it("rejects a role it does not know, however well signed", async () => {
    const token = await createSessionToken({
      role: "owner" as never,
      userId: "u-1",
    });
    expect(await readSession(token!)).toBeNull();
  });

  it("rejects a session with no id", async () => {
    const token = await createSessionToken({ role: "member", userId: "" });
    expect(await readSession(token!)).toBeNull();
  });

  /* The v1 and v2 tokens carried the frontend's own roles, from before the
     backend existed. Whoever holds one signs in again. */
  it("does not read the tokens from before the backend", async () => {
    expect(await getSessionRole(`v2.admin.${Date.now()}.sig`)).toBeNull();
    expect(await getSessionRole(`v1.${Date.now()}.sig`)).toBeNull();
  });

  it("expires after its lifetime, the backend's ninety days", async () => {
    const issued = Date.now();
    const token = (await createSessionToken(MEMBER, issued))!;
    const inside = issued + SESSION_MAX_AGE * 1000 - 1000;
    const outside = issued + SESSION_MAX_AGE * 1000 + 1000;

    expect(await readSession(token, inside)).toEqual(MEMBER);
    expect(await readSession(token, outside)).toBeNull();
    expect(SESSION_MAX_AGE).toBe(60 * 60 * 24 * 90);
  });

  it("refuses a token issued in the future", async () => {
    const now = Date.now();
    const token = (await createSessionToken(MEMBER, now + 60_000))!;
    expect(await readSession(token, now)).toBeNull();
  });
});

describe("isMemberPath", () => {
  it("covers member pages and their children only", () => {
    expect(isMemberPath("/gallery")).toBe(true);
    expect(isMemberPath("/people/m-07")).toBe(true);
    expect(isMemberPath("/gallery/fete-memories")).toBe(true);
    expect(isMemberPath("/galleryx")).toBe(false);
    expect(isMemberPath("/family-tree")).toBe(false);
    expect(isMemberPath("/login")).toBe(false);
  });
});

/**
 * The exemption list is the whole of what separates the register from the
 * public, so it gets a case per path rather than one assertion with six
 * expectations in it. The pages behind it are reached by people who cannot
 * sign in — a locked-out administrator — which is why they cannot sit
 * behind the gate that asks for the password they have lost.
 */
describe("isAdminPath", () => {
  it("covers the admin area", () => {
    expect(isAdminPath("/admin")).toBe(true);
    expect(isAdminPath("/admin/posts")).toBe(true);
    expect(isAdminPath("/admin/albums/new")).toBe(true);
    expect(isAdminPath("/admin/members")).toBe(true);
  });

  it("is not fooled by a path that merely starts with the name", () => {
    expect(isAdminPath("/administration")).toBe(false);
    expect(isAdminPath("/dashboard")).toBe(false);
  });

  it("lets the login through", () => {
    expect(isAdminPath("/admin/login")).toBe(false);
    expect(isAdminPublicPath("/admin/login")).toBe(true);
  });

  it("lets the forgot-password page through", () => {
    expect(isAdminPath("/admin/forgot-password")).toBe(false);
    expect(isAdminPublicPath("/admin/forgot-password")).toBe(true);
  });

  /* The exemptions are exact paths, never prefixes. A prefix would open
     everything under a name anybody can type. */
  it("gates anything hiding under an exempt name", () => {
    expect(isAdminPath("/admin/login-x")).toBe(true);
    expect(isAdminPath("/admin/login/members")).toBe(true);
    expect(isAdminPath("/admin/forgot-password/members")).toBe(true);
  });

  /* The reset link is the backend's invitation link now (/invitation), so
     the old token path is gated like any other: nothing answers there. */
  it("gates the retired reset-password path", () => {
    expect(isAdminPath("/admin/reset-password/abc123")).toBe(true);
    expect(isAdminPath("/admin/reset-password")).toBe(true);
  });
});

describe("the studio", () => {
  it("knows its own paths", () => {
    expect(isStudioPath("/studio")).toBe(true);
    expect(isStudioPath("/studio/posts/new")).toBe(true);
    expect(isStudioPath("/studios")).toBe(false);
    expect(isStudioPath("/admin")).toBe(false);
  });

  /* The social media manager's, and the administrator's too: roles are
     cumulative. A member has no business there. */
  it("is open to the social media manager and the administrator only", () => {
    expect(mayUseStudio("social_media_manager")).toBe(true);
    expect(mayUseStudio("admin")).toBe(true);
    expect(mayUseStudio("member")).toBe(false);
  });
});
