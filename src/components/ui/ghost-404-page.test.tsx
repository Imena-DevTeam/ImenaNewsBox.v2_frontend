import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ROUTES } from "@/constants/routes";
import { NotFound } from "./ghost-404-page";

describe("NotFound", () => {
  it("says the page is missing and offers the way home", () => {
    render(<NotFound />);

    expect(
      screen.getByRole("heading", { name: /page missing/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /find shelter/i })).toHaveAttribute(
      "href",
      ROUTES.HOME,
    );
  });

  it("never sends anyone to someone else's site", () => {
    render(<NotFound />);

    for (const link of screen.getAllByRole("link")) {
      expect(link.getAttribute("href")).toMatch(/^\//);
    }
  });

  it("describes the whole 404 to assistive technology as one image", () => {
    render(<NotFound />);

    expect(
      screen.getByRole("img", { name: /404, with a ghost/i }),
    ).toBeInTheDocument();
  });

  it("explains what 404 means in a real disclosure", () => {
    render(<NotFound />);

    const toggle = screen.getByRole("button", { name: /what does 404 mean/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    /* The entrance animation holds everything at opacity 0 in jsdom, so the
       disclosure's state is read from the element's own `hidden`. */
    expect(screen.getByText(/web’s way of saying/i)).toHaveAttribute("hidden");

    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/web’s way of saying/i)).not.toHaveAttribute(
      "hidden",
    );
  });
});
