import { describe, expect, it } from "vitest";
import {
  PENDING_MAX_AGE,
  createPendingToken,
  readPendingToken,
} from "./pending";
import { editTokenData } from "./token-test-utils";

/**
 * The login in progress, between the login screen and the code.
 *
 * Until 12 Nov 2026 the role a login was for travelled in the query string
 * and the action that signed the session believed it, so typing that URL and
 * any five digits made you an administrator. Now the server holds the
 * family name the code was sent for in this signed, short-lived cookie, and
 * nothing a caller writes is taken for it.
 */
describe("the pending login", () => {
  it("carries back what it was given", async () => {
    const token = await createPendingToken({
      familyName: "RWEMA",
      admin: true,
    });
    expect(await readPendingToken(token!)).toEqual({
      familyName: "RWEMA",
      admin: true,
    });
  });

  it("carries a fixture role when it was given one", async () => {
    const token = await createPendingToken({
      familyName: "Ngabe",
      admin: false,
      role: "social_media_manager",
    });
    expect((await readPendingToken(token!))?.role).toBe("social_media_manager");
  });

  it("keeps a name outside ASCII intact", async () => {
    const token = await createPendingToken({
      familyName: "Mukamazimpaka Ñ",
      admin: false,
    });
    expect((await readPendingToken(token!))?.familyName).toBe(
      "Mukamazimpaka Ñ",
    );
  });

  it("is nothing without a token", async () => {
    expect(await readPendingToken(undefined)).toBeNull();
    expect(await readPendingToken("")).toBeNull();
  });

  /* A token somebody wrote by hand is not a login. */
  it("refuses a token that was not signed here", async () => {
    expect(await readPendingToken("p2.eyJuIjoiUldFTUEifQ.forged")).toBeNull();
  });

  /* Editing the cookie changes the data, so the signature no longer
     matches it: neither the name nor the door can be swapped. */
  it("refuses a token whose name or door has been edited", async () => {
    const now = Date.now();
    const token = (await createPendingToken(
      { familyName: "Uwase", admin: false },
      now,
    ))!;

    const otherName = editTokenData(token, (data) => ({ ...data, n: "RWEMA" }));
    const asAdmin = editTokenData(token, (data) => ({ ...data, a: true }));
    const withRole = editTokenData(token, (data) => ({ ...data, r: "admin" }));

    expect(await readPendingToken(token, now)).not.toBeNull();
    expect(await readPendingToken(otherName, now)).toBeNull();
    expect(await readPendingToken(asAdmin, now)).toBeNull();
    expect(await readPendingToken(withRole, now)).toBeNull();
  });

  /* The old shape carried a role and no name; it is not read at all. */
  it("refuses the old p1 token", async () => {
    expect(
      await readPendingToken(`p1.admin.${Date.now()}.whatever`),
    ).toBeNull();
  });

  it("expires, so a login left open is not still open later", async () => {
    const issued = Date.now();
    const token = (await createPendingToken(
      { familyName: "RWEMA", admin: true },
      issued,
    ))!;

    const justInside = issued + PENDING_MAX_AGE * 1000 - 1000;
    expect(await readPendingToken(token, justInside)).not.toBeNull();

    const justOutside = issued + PENDING_MAX_AGE * 1000 + 1000;
    expect(await readPendingToken(token, justOutside)).toBeNull();
  });

  it("refuses a token issued in the future", async () => {
    const now = Date.now();
    const token = (await createPendingToken(
      { familyName: "RWEMA", admin: true },
      now + 60_000,
    ))!;
    expect(await readPendingToken(token, now)).toBeNull();
  });

  /* The backend's code lasts ten minutes; the login holding it should not
     outlive it. */
  it("lasts no longer than the code", () => {
    expect(PENDING_MAX_AGE).toBe(60 * 10);
  });
});
