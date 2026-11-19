import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OfflineBanner } from "./OfflineBanner";

function setOnline(value: boolean) {
  vi.spyOn(navigator, "onLine", "get").mockReturnValue(value);
  window.dispatchEvent(new Event(value ? "online" : "offline"));
}

afterEach(() => vi.restoreAllMocks());

describe("OfflineBanner", () => {
  it("says nothing while online", () => {
    render(<OfflineBanner />);
    expect(screen.queryByText(/offline/i)).toBeNull();
  });

  it("appears when the connection drops and goes when it returns", () => {
    render(<OfflineBanner />);
    act(() => setOnline(false));
    expect(screen.getByText(/you.re offline/i)).toBeInTheDocument();
    act(() => setOnline(true));
    expect(screen.queryByText(/you.re offline/i)).toBeNull();
  });
});
