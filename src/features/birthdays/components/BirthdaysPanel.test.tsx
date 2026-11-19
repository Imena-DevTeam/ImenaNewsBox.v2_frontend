import { beforeAll, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { Celebrant } from "../data";
import { BirthdaysPanel } from "./BirthdaysPanel";

/* The burst is canvas work jsdom cannot do; the flow only needs it called. */
vi.mock("canvas-confetti", () => ({ default: vi.fn() }));

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
  window.matchMedia ??= (() => ({ matches: true })) as never;
});

const person = (id: string, name: string, branch: string): Celebrant => ({
  id,
  name,
  branch,
  month: 2,
  day: 28,
  photo: "",
});

const today = [person("m-07", "Bigwi Claire", "Light")];
const upcoming = [
  person("m-08", "Muheto Eric", "Wihogora"),
  person("m-09", "Keza Marie", "Hope"),
];

describe("BirthdaysPanel", () => {
  it("names today's celebrant and links to their page", () => {
    render(<BirthdaysPanel today={today} upcoming={upcoming} />);
    expect(screen.getByText("Birthday today")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Bigwi Claire" })).toHaveAttribute(
      "href",
      "/people/m-07",
    );
    expect(screen.getByText("Light family")).toBeInTheDocument();
  });

  it(
    "sends a wish in place, without an email link, and says it is kept on the device",
    { timeout: 15_000 },
    () => {
      render(<BirthdaysPanel today={today} upcoming={upcoming} />);
      expect(document.querySelector('a[href^="mailto:"]')).toBeNull();

      fireEvent.click(
        screen.getByRole("button", { name: /send a warm family wish/i }),
      );
      fireEvent.click(screen.getAllByRole("radio")[0]!);
      fireEvent.click(screen.getByRole("button", { name: /^send wish$/i }));

      expect(screen.getByRole("status")).toHaveTextContent(
        /kept on this device/i,
      );
      expect(
        screen.getByRole("button", { name: /send another wish/i }),
      ).toBeInTheDocument();
    },
  );

  it("offers a wish for an upcoming birthday, with its branch", () => {
    render(<BirthdaysPanel today={today} upcoming={upcoming} />);
    expect(
      screen.getByRole("button", {
        name: /send a family wish for Muheto Eric's day/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Hope")).toBeInTheDocument();
  });

  it("says so when nobody's birthday is today", () => {
    render(<BirthdaysPanel today={[]} upcoming={upcoming} />);
    expect(screen.getByText(/no birthdays today/i)).toBeInTheDocument();
  });
});
