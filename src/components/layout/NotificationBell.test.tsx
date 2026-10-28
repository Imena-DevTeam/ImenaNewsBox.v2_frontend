import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { NOTIFICATIONS } from "@/lib/notifications";
import { NotificationBell } from "./NotificationBell";

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute("open");
  };
});

beforeEach(() => localStorage.clear());

describe("NotificationBell", () => {
  it("counts the unread updates on the bell", () => {
    render(<NotificationBell />);

    expect(
      screen.getByRole("button", {
        name: `Family updates, ${NOTIFICATIONS.length} unread`,
      }),
    ).toBeInTheDocument();
  });

  it("clears the count once everything is marked read, and remembers it", () => {
    const { unmount } = render(<NotificationBell />);

    fireEvent.click(screen.getByRole("button", { name: /family updates/i }));
    fireEvent.click(screen.getByRole("button", { name: /mark all read/i }));

    expect(
      screen.getByRole("button", { name: "Family updates, all read" }),
    ).toBeInTheDocument();

    unmount();
    render(<NotificationBell />);
    expect(
      screen.getByRole("button", { name: "Family updates, all read" }),
    ).toBeInTheDocument();
  });

  it("lists every update as a link to where it happened", () => {
    render(<NotificationBell />);
    fireEvent.click(screen.getByRole("button", { name: /family updates/i }));

    for (const item of NOTIFICATIONS) {
      expect(
        screen.getByRole("link", { name: new RegExp(item.title) }),
      ).toHaveAttribute("href", item.href);
    }
  });
});
