import { describe, expect, it } from "vitest";
import {
  SESSION_MAX_AGE,
  createSessionToken,
  getSessionRole,
  isAdminPath,
  isMemberPath,
  isStudioPath,
  mayUseStudio,
  verifySessionToken,
} from "./session";

describe("session token", () => {
  it("accepts a token it issued", async () => {
    const token = await createSessionToken();
    expect(await verifySessionToken(token ?? undefined)).toBe(true);
  });

  it("rejects a hand-written cookie", async () => {
    expect(await verifySessionToken("verified")).toBe(false);
    expect(await verifySessionToken(undefined)).toBe(false);
  });

  it("rejects a tampered issue time", async () => {
    const token = (await createSessionToken("member", 1_000))!;
    const [version, role, , signature] = token.split(".");
    expect(
      await verifySessionToken(`${version}.${role}.${Date.now()}.${signature}`),
    ).toBe(false);
  });

  it("expires after its lifetime", async () => {
    const issued = 1_700_000_000_000;
    const token = (await createSessionToken("member", issued))!;
    const justInside = issued + SESSION_MAX_AGE * 1000;
    expect(await verifySessionToken(token, justInside)).toBe(true);
    expect(await verifySessionToken(token, justInside + 1)).toBe(false);
  });
});

describe("session role", () => {
  it("reports the role it issued", async () => {
    expect(await getSessionRole((await createSessionToken("member"))!)).toBe(
      "member",
    );
    expect(await getSessionRole((await createSessionToken("admin"))!)).toBe(
      "admin",
    );
    expect(await getSessionRole((await createSessionToken("blogger"))!)).toBe(
      "blogger",
    );
  });

  /* The reader validates the role against a list. A role it does not know is
     a forged token, not a session with an odd name on it. */
  it("rejects a role it does not know, however well signed", async () => {
    const token = (await createSessionToken("member"))!;
    const [version, , issued, signature] = token.split(".");
    expect(
      await getSessionRole(`${version}.editor.${issued}.${signature}`),
    ).toBe(null);
  });

  it("will not let a member rewrite themselves into an admin", async () => {
    const token = (await createSessionToken("member"))!;
    const [version, , issued, signature] = token.split(".");
    expect(
      await getSessionRole(`${version}.admin.${issued}.${signature}`),
    ).toBe(null);
  });

  it("reads a correctly signed pre-role v1 token as a member", async () => {
    /* Sessions issued before the admin area existed keep working until they
       expire, rather than logging the whole family out on deploy. Signed
       here the way v1 signed, so this tests the version path and not a
       rejected signature. */
    const issued = Date.now();
    const payload = `v1.${issued}`;
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(
        "imena-dev-only-secret-do-not-use-in-production",
      ),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const signature = btoa(
      String.fromCharCode(
        ...new Uint8Array(
          await crypto.subtle.sign(
            "HMAC",
            key,
            new TextEncoder().encode(payload),
          ),
        ),
      ),
    )
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    expect(await getSessionRole(`${payload}.${signature}`)).toBe("member");
    expect((await createSessionToken("member"))!.startsWith("v2.")).toBe(true);
  });

  it("will not let a v1 token claim admin: v1 has no role to claim", async () => {
    expect(await getSessionRole("v1.admin.123.sig")).toBe(null);
  });

  it("returns null for an absent or forged token", async () => {
    expect(await getSessionRole(undefined)).toBe(null);
    expect(await getSessionRole("verified")).toBe(null);
  });
});

describe("isMemberPath", () => {
  it("covers member pages and their children only", () => {
    expect(isMemberPath("/gallery")).toBe(true);
    expect(isMemberPath("/gallery/fete-memories")).toBe(true);
    expect(isMemberPath("/galleryx")).toBe(false);
    expect(isMemberPath("/family-tree")).toBe(false);
    expect(isMemberPath("/login")).toBe(false);
  });
});

describe("isAdminPath", () => {
  it("covers the admin area but never its login page", () => {
    expect(isAdminPath("/admin")).toBe(true);
    expect(isAdminPath("/admin/posts")).toBe(true);
    expect(isAdminPath("/admin/albums/new")).toBe(true);
    expect(isAdminPath("/admin/login")).toBe(false);
    expect(isAdminPath("/administration")).toBe(false);
    expect(isAdminPath("/dashboard")).toBe(false);
  });
});

describe("the studio", () => {
  it("knows its own paths", () => {
    expect(isStudioPath("/studio")).toBe(true);
    expect(isStudioPath("/studio/posts/new")).toBe(true);
    expect(isStudioPath("/studios")).toBe(false);
    expect(isStudioPath("/admin")).toBe(false);
  });

  /* The blogger's, and the administrator's too: they answer for what the
     family publishes. A member has no business there. */
  it("is open to the blogger and the administrator, and nobody else", () => {
    expect(mayUseStudio("blogger")).toBe(true);
    expect(mayUseStudio("admin")).toBe(true);
    expect(mayUseStudio("member")).toBe(false);
  });
});
