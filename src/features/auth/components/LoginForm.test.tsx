import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AdminLoginForm } from "./AdminLoginForm";
import { LoginForm } from "./LoginForm";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

const logIn = () =>
  fireEvent.click(screen.getByRole("button", { name: "Log In" }));

beforeEach(() => push.mockClear());

describe("LoginForm", () => {
  it("asks for a family name before going on", async () => {
    render(<LoginForm />);

    logIn();

    expect(
      await screen.findByText("Family name is required"),
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it("goes on to the verify step", async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Imena" },
    });
    logIn();

    await waitFor(() => expect(push).toHaveBeenCalledWith("/verify"));
  });

  it("links to the admin login", () => {
    render(<LoginForm />);

    expect(screen.getByRole("link", { name: "Log in here" })).toHaveAttribute(
      "href",
      "/admin/login",
    );
  });
});

describe("AdminLoginForm", () => {
  it("goes on to the verify step as an admin", async () => {
    render(<AdminLoginForm />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Imena" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "correct-horse" },
    });
    logIn();

    await waitFor(() =>
      expect(push).toHaveBeenCalledWith("/verify?role=admin"),
    );
  });

  it("links back to the member login", () => {
    render(<AdminLoginForm />);

    expect(screen.getByRole("link", { name: "Member log in" })).toHaveAttribute(
      "href",
      "/login",
    );
  });
});
