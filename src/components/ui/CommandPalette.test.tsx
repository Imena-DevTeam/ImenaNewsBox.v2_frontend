import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { searchCommands } from "@/features/search/commands";
import { CommandPalette, openSearch } from "./CommandPalette";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
  };
});

function type(text: string) {
  fireEvent.change(screen.getByRole("combobox"), { target: { value: text } });
}

describe("member search", () => {
  it("opens from any button, and finds a story by title", () => {
    render(<CommandPalette commands={searchCommands("member")} />);
    act(() => openSearch());
    type("reunion");
    expect(screen.getAllByRole("option")[0]).toHaveTextContent(/Stories/);
  });

  it("finds a person by their branch, and sends a member to their page", () => {
    render(<CommandPalette commands={searchCommands("member")} />);
    act(() => openSearch());
    type("hope family");
    const first = screen.getAllByRole("option")[0]!;
    fireEvent.click(first);
    expect(push).toHaveBeenLastCalledWith(
      expect.stringMatching(/^\/people\/m-/),
    );
  });

  it("shows admin pages to an administrator only", () => {
    const member = searchCommands("member").map((c) => c.label);
    const admin = searchCommands("admin").map((c) => c.label);
    expect(member.some((l) => l.startsWith("Admin"))).toBe(false);
    expect(admin.some((l) => l.startsWith("Admin"))).toBe(true);
  });
});
