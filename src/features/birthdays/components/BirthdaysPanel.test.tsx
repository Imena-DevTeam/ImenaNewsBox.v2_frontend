import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BirthdaysPanel } from "./BirthdaysPanel";

describe("BirthdaysPanel", () => {
  it("names today's celebrant with their subfamily and wish count", () => {
    render(<BirthdaysPanel />);

    expect(screen.getByText("Dream Baby")).toBeInTheDocument();
    expect(screen.getByText("Aganze")).toBeInTheDocument();
    expect(screen.getByText("Wihogora Family")).toBeInTheDocument();
    expect(screen.getByText(/42 family wishes sent/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /email a warm family wish/i }),
    ).toHaveAttribute("href", expect.stringContaining("mailto:"));
  });

  it("explains that the email action is not sent by the page", () => {
    render(<BirthdaysPanel />);

    expect(
      screen.getByText(/opens your email app; nothing is sent by this page/i),
    ).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("offers an email link for an upcoming birthday", () => {
    render(<BirthdaysPanel />);

    expect(
      screen.getByRole("link", {
        name: /email a family wish for Bigwi's day/i,
      }),
    ).toHaveAttribute("href", expect.stringContaining("Warm%20family%20wish"));
  });

  it("lists the upcoming birthdays with their subfamily and parent", () => {
    render(<BirthdaysPanel />);

    expect(screen.getByText("Bigwi")).toBeInTheDocument();
    expect(screen.getByText("Light")).toBeInTheDocument();
    expect(screen.getByText(/Child of Sheja Ngabo/i)).toBeInTheDocument();
  });

  it("marks the records as samples", () => {
    render(<BirthdaysPanel />);

    expect(screen.getByText(/sample records/i)).toBeInTheDocument();
  });
});
