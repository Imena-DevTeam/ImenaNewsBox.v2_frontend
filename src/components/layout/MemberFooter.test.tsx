import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { OPEN_UPDATES_EVENT } from "@/components/layout/NotificationBell";
import { FAMILY_MOTTO } from "@/constants/site";
import { NOTIFICATIONS, NOTIFICATIONS_READ_KEY } from "@/lib/notifications";
import { MemberFooter } from "./MemberFooter";

/* The sign-out action is a server action; the footer only needs to wire it. */
vi.mock("@/app/actions/session", () => ({
  endMemberSession: vi.fn(async () => undefined),
}));

beforeEach(() => localStorage.clear());

describe("MemberFooter", () => {
  it("says what the place is and carries the family motto", () => {
    render(<MemberFooter />);

    expect(screen.getByText(/private archive/i)).toBeInTheDocument();
    expect(screen.getByText(`“${FAMILY_MOTTO}”`)).toHaveAttribute("lang", "rw");
  });

  it("makes no claim about who is online", () => {
    render(<MemberFooter />);

    expect(screen.queryByText(/connected|live/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Together since 1996/)).toHaveTextContent(
      "more than 140 of us",
    );
  });

  it("links the member pages under two plain headings", () => {
    render(<MemberFooter />);

    for (const [name, href] of [
      ["Dashboard", "/dashboard"],
      ["Family tree", "/family-tree"],
      ["Birthdays", "/birthdays"],
      ["Gallery", "/gallery"],
      ["Archive", "/blogs"],
      ["Resources", "/resources"],
    ]) {
      expect(screen.getByRole("link", { name: name! })).toHaveAttribute(
        "href",
        href,
      );
    }
    expect(
      screen.getByRole("heading", { name: "The family" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Memories" }),
    ).toBeInTheDocument();
  });

  it("gives the signed-in member their profile and a way out", () => {
    render(<MemberFooter />);

    expect(screen.getByRole("heading", { name: "You" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Aganze, Wihogora family" }),
    ).toHaveAttribute("href", "/profile");
    expect(
      screen.getByRole("button", { name: /sign out of this device/i }),
    ).toBeInTheDocument();
  });

  it("counts the updates not yet seen and opens them", () => {
    const opened = vi.fn();
    window.addEventListener(OPEN_UPDATES_EVENT, opened);
    render(<MemberFooter />);

    const button = screen.getByRole("button", { name: /family updates/i });
    expect(button).toHaveTextContent(`${NOTIFICATIONS.length} new`);

    fireEvent.click(button);
    expect(opened).toHaveBeenCalledTimes(1);
    window.removeEventListener(OPEN_UPDATES_EVENT, opened);
  });

  it("drops the count once everything has been read", () => {
    localStorage.setItem(
      NOTIFICATIONS_READ_KEY,
      JSON.stringify(NOTIFICATIONS.map((item) => item.id)),
    );
    render(<MemberFooter />);

    expect(
      screen.getByRole("button", { name: "Family updates" }),
    ).toBeInTheDocument();
  });

  it("can send the member back to the top", () => {
    render(<MemberFooter />);

    expect(
      screen.getByRole("button", { name: /back to top/i }),
    ).toBeInTheDocument();
  });
});
