import { afterEach, describe, expect, it, vi } from "vitest";
import { administrators, SIGNED_IN_ID } from "@/features/members/data";
import {
  pendingResetRequests,
  previewInvitation,
  readInvitation,
  SAMPLE_TOKENS,
} from "./data";

/**
 * The stand-in, and the one property that has to hold whatever it does:
 * **no token buys a session.** It answers so the four invitation states can
 * be built and reviewed with no backend, and it steps aside the moment
 * there is one.
 */
describe("previewInvitation", () => {
  it("names somebody who is actually waiting on an invitation", () => {
    const checked = previewInvitation(SAMPLE_TOKENS.member);
    expect(checked.ok).toBe(true);
    if (!checked.ok) return;
    expect(checked.invitation.role).toBe("member");
    expect(checked.invitation.fullName).not.toBe("");
    expect(checked.invitation.email).toContain("@");
  });

  /* An administrator's invitation has a password to set, which is the whole
     difference between the two landing pages. */
  it("gives an admin token the admin role", () => {
    const checked = previewInvitation(SAMPLE_TOKENS.admin);
    expect(checked.ok).toBe(true);
    if (!checked.ok) return;
    expect(checked.invitation.role).toBe("admin");
  });

  it("refuses an expired link as expired", () => {
    expect(previewInvitation(SAMPLE_TOKENS.expired)).toEqual({
      ok: false,
      reason: "expired",
    });
  });

  it("refuses a spent link as used", () => {
    expect(previewInvitation(SAMPLE_TOKENS.used)).toEqual({
      ok: false,
      reason: "used",
    });
  });

  /* Anything it does not recognise reads as a broken link, which is also
     what it says: it never reports whether a token ever existed. */
  it("refuses anything else without saying why not", () => {
    expect(previewInvitation("qQ8xv-nothing")).toEqual({
      ok: false,
      reason: "unknown",
    });
  });

  it("dates every live invitation into the future", () => {
    const checked = previewInvitation(SAMPLE_TOKENS.member);
    if (!checked.ok) throw new Error("expected a live invitation");
    expect(new Date(checked.invitation.expiresAt).getTime()).toBeGreaterThan(
      Date.now(),
    );
  });
});

describe("readInvitation", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("refuses an empty token without asking anybody", async () => {
    await expect(readInvitation("   ")).resolves.toEqual({
      ok: false,
      reason: "unknown",
    });
  });

  /* Until step 3 of CLAUDE.md §23 replaces these pages, the stand-in answers
     whatever API_URL says: the backend's link is a different page with a
     different check, so there is nothing here to hand a token to. What keeps
     it from being a back door is that these pages issue no session, which
     no-session.test.ts holds. */
  it("answers by the stand-in whether or not an API is configured", async () => {
    for (const url of ["", "http://127.0.0.1:8000/api/v1"]) {
      vi.stubEnv("API_URL", url);
      await expect(readInvitation(SAMPLE_TOKENS.member)).resolves.toMatchObject(
        { ok: true },
      );
    }
  });
});

describe("pendingResetRequests", () => {
  /* The sample is somebody other than the person reading the page: an
     administrator cannot approve their own reset, and a band offering to
     would be the takeover this flow exists to make loud. */
  it("never asks you to approve your own reset", () => {
    for (const request of pendingResetRequests()) {
      expect(request.memberId).not.toBe(SIGNED_IN_ID);
    }
  });

  it("carries the address already on the record", () => {
    const [request] = pendingResetRequests();
    if (!request) return;
    const person = administrators().find((one) => one.id === request.memberId);
    expect(request.email).toBe(person?.email);
  });
});
