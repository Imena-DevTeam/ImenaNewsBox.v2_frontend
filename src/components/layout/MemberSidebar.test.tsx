"use client";

import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemberSidebar } from "./MemberSidebar";

/* The sidebar reads the router to mark the active page. */
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/gallery"),
}));

const LABELS = [
  "Home",
  "Blogs",
  "Tree",
  "Gallery",
  "Resources",
  "Birthdays",
  "Profile",
];

describe("MemberSidebar", () => {
  it("links every member page", () => {
    render(<MemberSidebar />);

    for (const label of LABELS) {
      expect(
        screen.getByRole("link", { name: new RegExp(`^${label}$`, "i") }),
      ).toHaveAttribute("href");
    }
  });

  it("marks the current page for assistive technology", () => {
    render(<MemberSidebar />);

    expect(screen.getByRole("link", { name: /^Gallery$/i })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: /^Home$/i })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("keeps every destination in one fixed order", () => {
    render(<MemberSidebar />);

    const names = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("aria-label"));

    expect(names).toEqual(LABELS);
  });

  /* The label that slides out on hover is decoration: it repeats the link's
     own aria-label, so it is aria-hidden rather than a tooltip. A
     role="tooltip" with nothing pointing at it only made a screen reader
     read every destination twice. */
  it("shows every destination's label on the rail as well", () => {
    render(<MemberSidebar />);

    const shown = screen
      .getAllByRole("link")
      .map((link) => link.textContent?.trim());

    expect(shown).toEqual(LABELS);
    expect(screen.queryAllByRole("tooltip")).toHaveLength(0);
  });
});
