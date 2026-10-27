import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FAMILY_MOTTO } from "@/constants/site";
import { MemberFooter } from "./MemberFooter";

/* The sign-out action is a server action; the footer only needs to wire it. */
vi.mock("@/app/actions/session", () => ({
  endMemberSession: vi.fn(async () => undefined),
}));

describe("MemberFooter", () => {
  it("signs off with the family motto and its heritage, not legalese", () => {
    render(<MemberFooter />);

    expect(screen.getByText(`“${FAMILY_MOTTO}”`)).toHaveAttribute("lang", "rw");
    expect(screen.getByText(/Est\. 1996, UNR Butare/)).toBeInTheDocument();
    expect(screen.queryByText(/all rights reserved/i)).not.toBeInTheDocument();
  });

  it("shows who is signed in and the archive's status", () => {
    render(<MemberFooter />);

    expect(screen.getByText(/logged in as/i)).toHaveTextContent(
      "Logged in as Aganze • Wihogora Family",
    );
    expect(screen.getByText(/family archive live/i)).toHaveTextContent(
      /140\+ Members Connected/,
    );
  });

  it("links the three branches and the member pages, and offers a way out", () => {
    render(<MemberFooter />);

    const branches = screen.getByRole("navigation", {
      name: "Family branches",
    });
    for (const name of ["Wihogora", "Light", "Hope"]) {
      expect(
        branches.querySelector(`a[href="/family-tree#family-tree"]`),
      ).not.toBeNull();
      expect(screen.getByRole("link", { name })).toBeInTheDocument();
    }

    for (const [name, href] of [
      ["Dashboard", "/dashboard"],
      ["Archive", "/blogs"],
      ["Tree", "/family-tree"],
      ["Birthdays", "/birthdays"],
      ["Profile", "/profile"],
    ]) {
      expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
    }

    expect(
      screen.getByRole("button", { name: /sign out/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /back to top/i }),
    ).toBeInTheDocument();
  });
});
