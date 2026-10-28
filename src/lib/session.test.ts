import { describe, expect, it } from "vitest";
import {
  SESSION_MAX_AGE,
  createSessionToken,
  isMemberPath,
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
    const token = (await createSessionToken(1_000))!;
    const [version, , signature] = token.split(".");
    expect(
      await verifySessionToken(`${version}.${Date.now()}.${signature}`),
    ).toBe(false);
  });

  it("expires after its lifetime", async () => {
    const issued = 1_700_000_000_000;
    const token = (await createSessionToken(issued))!;
    const justInside = issued + SESSION_MAX_AGE * 1000;
    expect(await verifySessionToken(token, justInside)).toBe(true);
    expect(await verifySessionToken(token, justInside + 1)).toBe(false);
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
