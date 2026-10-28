import { beforeAll, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { BirthdaysPanel } from "./BirthdaysPanel";

/* The burst is canvas work jsdom cannot do; the flow only needs it called. */
vi.mock("canvas-confetti", () => ({ default: vi.fn() }));

beforeAll(() => {
  /* jsdom has no <dialog> behaviour; give it the two calls the panel uses. */
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
  window.matchMedia ??= (() => ({ matches: true })) as never;
});

describe("BirthdaysPanel", () => {
  it("names today's celebrant with their subfamily and wish count", () => {
    render(<BirthdaysPanel />);

    expect(screen.getByText("Dream Baby")).toBeInTheDocument();
    expect(screen.getByText("Aganze")).toBeInTheDocument();
    expect(screen.getByText("Wihogora Family")).toBeInTheDocument();
    expect(screen.getByText(/42 family wishes sent/i)).toBeInTheDocument();
  });

  /* The whole wish flow in one test — open, choose, send, confirm — so it
     gets more than the default five seconds on a loaded machine. */
  it(
    "sends a wish in place, without an email link, and says it is kept on the device",
    { timeout: 15_000 },
    () => {
      render(<BirthdaysPanel />);

      expect(document.querySelector('a[href^="mailto:"]')).toBeNull();

      fireEvent.click(
        screen.getByRole("button", { name: /send a warm family wish/i }),
      );
      fireEvent.click(screen.getAllByRole("radio")[0]!);
      fireEvent.click(screen.getByRole("button", { name: /^send wish$/i }));

      expect(screen.getByRole("status")).toHaveTextContent(
        /kept on this device/i,
      );
      expect(screen.getByText(/43 family wishes sent/i)).toBeInTheDocument();
    },
  );

  it("only sends once a wish is chosen or written", () => {
    render(<BirthdaysPanel />);

    fireEvent.click(
      screen.getByRole("button", { name: /send a warm family wish/i }),
    );
    expect(screen.getByRole("button", { name: /^send wish$/i })).toBeDisabled();
  });

  it("offers a wish for an upcoming birthday", () => {
    render(<BirthdaysPanel />);

    expect(
      screen.getByRole("button", {
        name: /send a family wish for Bigwi's day/i,
      }),
    ).toBeInTheDocument();
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
