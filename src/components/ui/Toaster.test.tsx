import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ToastProvider, useToast } from "./Toaster";

function Trigger({ onUndo }: { onUndo?: () => void }) {
  const toast = useToast();
  return (
    <button
      type="button"
      onClick={() =>
        toast({
          message: "Album removed",
          action: onUndo ? { label: "Undo", run: onUndo } : undefined,
        })
      }
    >
      Go
    </button>
  );
}

afterEach(() => vi.useRealTimers());

describe("ToastProvider", () => {
  it("says how it ended, then goes", () => {
    vi.useFakeTimers();
    render(<Trigger />, { wrapper: ToastProvider });
    fireEvent.click(screen.getByText("Go"));
    expect(screen.getByText("Album removed")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(4000));
    expect(screen.queryByText("Album removed")).toBeNull();
  });

  it("runs Undo and closes", () => {
    const undo = vi.fn();
    render(<Trigger onUndo={undo} />, { wrapper: ToastProvider });
    fireEvent.click(screen.getByText("Go"));
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(undo).toHaveBeenCalledOnce();
    expect(screen.queryByText("Album removed")).toBeNull();
  });

  it("waits while the pointer is on it", () => {
    vi.useFakeTimers();
    render(<Trigger onUndo={() => {}} />, { wrapper: ToastProvider });
    fireEvent.click(screen.getByText("Go"));
    fireEvent.pointerEnter(screen.getByText("Album removed").parentElement!);
    act(() => vi.advanceTimersByTime(20_000));
    expect(screen.getByText("Album removed")).toBeInTheDocument();
  });
});
