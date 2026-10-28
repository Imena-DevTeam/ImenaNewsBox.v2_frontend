import { beforeAll, describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { ALL_MEMBERS, PROMOTIONS, PROMOTION_YEARS } from "../promotions";
import { TreeBrowser } from "./TreeBrowser";
import { TreeHierarchyGrid } from "./TreeHierarchyGrid";

beforeAll(() => {
  /* jsdom has no <dialog> behaviour; give it the two calls the dialog uses. */
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});

const current = PROMOTIONS.find((p) => p.year === "2019-2020")!;

describe("TreeHierarchyGrid", () => {
  it("shows the ten roles of a promotion in tier order, branches under their own panel", () => {
    render(<TreeHierarchyGrid promotion={current} onOpen={() => {}} />);

    const titles = (level: number) =>
      screen.getAllByRole("heading", { level }).map((h) => h.textContent);

    expect(titles(3)).toEqual([
      "Grand Père",
      "Grand Mère",
      "Coordinator",
      "Vice Coordinator",
      "Light family",
      "Wihogora family",
      "Hope family",
    ]);
    expect(titles(4)).toEqual([
      "Père Light",
      "Mère Light",
      "Père Wihogora",
      "Mère Wihogora",
      "Père Hope",
      "Mère Hope",
    ]);
  });

  it("lets a phone show one family at a time", () => {
    render(<TreeHierarchyGrid promotion={current} onOpen={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: "Hope" }));

    expect(screen.getByRole("region", { name: "Light family" })).toHaveClass(
      "max-md:hidden",
    );
    expect(screen.getByRole("region", { name: "Hope family" })).not.toHaveClass(
      "max-md:hidden",
    );
  });
});

describe("TreeBrowser", () => {
  it("offers the seven promotions and all generations, each with a count", () => {
    render(<TreeBrowser />);

    const group = screen.getByRole("group", { name: /imena family tree/i });
    expect(within(group).getAllByRole("button")).toHaveLength(
      PROMOTION_YEARS.length + 1,
    );
    const active = within(group).getByRole("button", { name: /2019-2020/ });
    expect(active).toHaveAttribute("aria-pressed", "true");
    expect(active).toHaveTextContent("10 members");
    expect(
      within(group).getByRole("button", { name: /all generations/i }),
    ).toHaveTextContent(`${ALL_MEMBERS.length} members`);
    expect(screen.getByText(/Promotion$/)).toHaveTextContent(
      "The 2019-2020 Promotion",
    );
  });

  it("loads another promotion's people when its pill is chosen", () => {
    render(<TreeBrowser />);

    fireEvent.click(screen.getByRole("button", { name: /2016-2017/ }));

    expect(screen.getByText(/Promotion$/)).toHaveTextContent(
      "The 2016-2017 Promotion",
    );
    expect(
      screen.getByText(PROMOTIONS[1]!.members[0]!.name),
    ).toBeInTheDocument();
  });

  it("lists every promotion under all generations", () => {
    render(<TreeBrowser />);

    fireEvent.click(screen.getByRole("button", { name: /all generations/i }));

    expect(
      screen.getAllByRole("button", { name: /view the story of/i }),
    ).toHaveLength(ALL_MEMBERS.length);
  });

  it("finds a relative in any year by name, branch or city", () => {
    render(<TreeBrowser />);
    const search = screen.getByRole("searchbox", {
      name: /search family members/i,
    });

    fireEvent.change(search, { target: { value: "Kamanzi" } });
    expect(screen.getByText(/1 result for/)).toBeInTheDocument();
    expect(screen.getByText("Kamanzi Joseph")).toBeInTheDocument();

    fireEvent.change(search, { target: { value: "huye" } });
    const huye = ALL_MEMBERS.filter((p) => p.location?.startsWith("Huye"));
    expect(
      screen.getAllByRole("button", { name: /view the story of/i }),
    ).toHaveLength(huye.length);

    fireEvent.change(search, { target: { value: "zzzz" } });
    expect(screen.getByText(/No one matches/)).toBeInTheDocument();
  });

  it("opens a person's story from their card", () => {
    render(<TreeBrowser />);
    const person = current.members[0]!;

    fireEvent.click(
      screen.getByRole("button", {
        name: `View the story of ${person.name}, ${person.roleLabel}`,
      }),
    );

    expect(
      screen.getByRole("heading", { name: person.name, level: 2 }),
    ).toBeInTheDocument();
  });
});
