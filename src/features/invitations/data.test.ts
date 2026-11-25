import { describe, expect, it } from "vitest";
import { administrators, SIGNED_IN_ID } from "@/features/members/data";
import { sampleResetRequests } from "./data";

describe("sampleResetRequests", () => {
  /* The backend never lists your own request, so the sample is not the
     signed-in administrator's either. */
  it("never asks you to answer your own reset", () => {
    for (const request of sampleResetRequests()) {
      expect(request.userId).not.toBe(SIGNED_IN_ID);
    }
  });

  it("carries the address already on the record", () => {
    const [request] = sampleResetRequests();
    expect(request).toBeDefined();
    const person = administrators().find((one) => one.id === request!.userId);
    expect(request!.email).toBe(person?.email);
  });
});
