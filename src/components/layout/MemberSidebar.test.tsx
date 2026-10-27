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

  it("lifts the open page to the top of the rail", () => {
    render(<MemberSidebar />);

    const names = screen
      .getAllByRole("link")
      .map((link) => link.textContent?.trim());

    expect(names).toEqual([
      "Gallery",
      "Home",
      "Blogs",
      "Tree",
      "Resources",
      "Birthdays",
      "Profile",
    ]);
  });
});
