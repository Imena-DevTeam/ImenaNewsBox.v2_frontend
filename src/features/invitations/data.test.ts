import { describe, expect, it } from "vitest";
import { administrators, SIGNED_IN_ID } from "@/features/members/data";
import { pendingResetRequests } from "./data";

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
