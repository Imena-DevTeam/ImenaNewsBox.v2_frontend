import { describe, expect, it } from "vitest";
import { timeAgo } from "./notifications";

const NOW = Date.parse("2026-10-27T10:00:00+02:00");

describe("timeAgo", () => {
  it("reads naturally at each scale", () => {
    expect(timeAgo("2026-10-27T10:00:00+02:00", NOW)).toBe("just now");
    expect(timeAgo("2026-10-27T09:59:00+02:00", NOW)).toBe("1 minute ago");
    expect(timeAgo("2026-10-27T07:00:00+02:00", NOW)).toBe("3 hours ago");
    expect(timeAgo("2026-10-25T10:00:00+02:00", NOW)).toBe("2 days ago");
  });

  it("never says a future update happened in the past", () => {
    expect(timeAgo("2026-10-28T10:00:00+02:00", NOW)).toBe("just now");
  });
});
