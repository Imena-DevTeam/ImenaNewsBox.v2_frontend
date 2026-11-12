import { describe, expect, it } from "vitest";
import {
  PENDING_MAX_AGE,
  createPendingToken,
  readPendingToken,
} from "./pending";

/**
 * The cookie that replaced `/verify?role=admin`.
 *
 * Until 12 Nov 2026 the role a login was for travelled in the query string
 * and the action that signed the session believed it, so typing that URL and
 * any five digits made you an administrator. These tests hold the line that
 * replaced it: the role is signed by the server, short-lived, and nothing a
 * caller writes is taken for it.
 */
describe("the pending login", () => {
  it("carries the role it was given back again", async () => {
    const token = await createPendingToken("blogger");
    expect(await readPendingToken(token!)).toBe("blogger");
  });

  it("is nothing without a token", async () => {
    expect(await readPendingToken(undefined)).toBeNull();
    expect(await readPendingToken("")).toBeNull();
  });

  /* The whole point: a token somebody wrote by hand is not a login. */
  it("refuses a token that was not signed here", async () => {
    const forged = `p1.admin.${Date.now()}.notarealsignature`;
    expect(await readPendingToken(forged)).toBeNull();
  });

  /* Lifting the signature off a member token and pasting it onto an admin
     one changes the payload, so the signature no longer matches it. */
  it("refuses a token whose role has been edited", async () => {
    const now = Date.now();
    const asMember = (await createPendingToken("member", now))!;
    const signature = asMember.split(".")[3];
    const asAdmin = `p1.admin.${now}.${signature}`;

    expect(await readPendingToken(asMember, now)).toBe("member");
    expect(await readPendingToken(asAdmin, now)).toBeNull();
  });

  it("refuses a role that is not one of the three", async () => {
    expect(
      await readPendingToken(`p1.owner.${Date.now()}.whatever`),
    ).toBeNull();
  });

  it("expires, so a login left open overnight is not still open", async () => {
    const issued = Date.now();
    const token = (await createPendingToken("admin", issued))!;

    const justInside = issued + PENDING_MAX_AGE * 1000 - 1000;
    expect(await readPendingToken(token, justInside)).toBe("admin");

    const justOutside = issued + PENDING_MAX_AGE * 1000 + 1000;
    expect(await readPendingToken(token, justOutside)).toBeNull();
  });

  it("refuses a token issued in the future", async () => {
    const now = Date.now();
    const token = (await createPendingToken("admin", now + 60_000))!;
    expect(await readPendingToken(token, now)).toBeNull();
  });

  /* Ten minutes: long enough to read an email and type five digits. A
     session lasts a week; this must not. */
  it("is far shorter than a session", async () => {
    expect(PENDING_MAX_AGE).toBeLessThanOrEqual(60 * 15);
  });
});
