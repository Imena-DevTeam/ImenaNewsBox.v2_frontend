import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { LoginMenu } from "./LoginMenu";

const button = () => screen.getByRole("button", { name: "Login" });
const item = (name: string) =>
  screen.getByRole("menuitem", { name, hidden: true });

describe("LoginMenu", () => {
  it("opens a choice instead of going straight to a login page", () => {
    render(<LoginMenu />);

    expect(button()).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(button());

    expect(button()).toHaveAttribute("aria-expanded", "true");
    expect(item("As Admin")).toHaveAttribute("href", "/admin/login");
    expect(item("As a member")).toHaveAttribute("href", "/login");
  });

  it("keeps the closed items out of the tab order", () => {
    render(<LoginMenu />);

    expect(item("As Admin")).toHaveAttribute("tabindex", "-1");
    fireEvent.click(button());
    expect(item("As Admin")).toHaveAttribute("tabindex", "0");
  });

  it("closes on Escape and hands focus back to the button", () => {
    render(<LoginMenu />);

    fireEvent.click(button());
    item("As Admin").focus();
    fireEvent.keyDown(item("As Admin"), { key: "Escape" });

    expect(button()).toHaveAttribute("aria-expanded", "false");
    expect(document.activeElement).toBe(button());
  });

  it("closes on a click outside", () => {
    render(<LoginMenu />);

    fireEvent.click(button());
    fireEvent.pointerDown(document.body);

    expect(button()).toHaveAttribute("aria-expanded", "false");
  });
});
