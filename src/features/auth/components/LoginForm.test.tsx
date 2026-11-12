import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AdminLoginForm } from "./AdminLoginForm";
import { LoginForm } from "./LoginForm";

const push = vi.fn();

/* Mutable, so a test can arrive carrying ?next= the way the middleware
   sends somebody here. */
let params = new URLSearchParams();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => params,
}));

const logIn = () =>
  fireEvent.click(screen.getByRole("button", { name: "Log In" }));

beforeEach(() => {
  push.mockClear();
  params = new URLSearchParams();
});

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

describe("LoginForm, as the blogger", () => {
  /* She uses the family's one login. Typing her name is what asks the verify
     step for a blogger session, which is what puts the studio in her rail. */
  it("asks for a blogger session when the blogger signs in", async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Ngabe" },
    });
    logIn();

    await waitFor(() =>
      expect(push).toHaveBeenCalledWith("/verify?role=blogger"),
    );
  });

  it("asks for nothing extra for anybody else", async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Imena" },
    });
    logIn();

    await waitFor(() => expect(push).toHaveBeenCalledWith("/verify"));
  });

  it("carries both the role and the destination", async () => {
    params = new URLSearchParams({ next: "/studio/posts" });
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Ngabe" },
    });
    logIn();

    await waitFor(() =>
      expect(push).toHaveBeenCalledWith(
        "/verify?role=blogger&next=%2Fstudio%2Fposts",
      ),
    );
  });
});

describe("AdminLoginForm", () => {
  const fill = () => {
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "admin@imenafamily.rw" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "correct-horse" },
    });
    logIn();
  };

  it("goes on to the verify step as an admin", async () => {
    render(<AdminLoginForm />);
    fill();

    await waitFor(() =>
      expect(push).toHaveBeenCalledWith("/verify?role=admin"),
    );
  });

  /* The family name identifies seventy-three people. The register signs
     people in by address, and this door has to agree with it. */
  it("will not take a family name in place of an address", async () => {
    render(<AdminLoginForm />);

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "Imena" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "correct-horse" },
    });
    logIn();

    expect(
      await screen.findByText("That does not look like an email address"),
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  /* It threw this away, so being stopped on the way to the register landed
     you on the overview with no way back to where you were going. */
  it("carries on to where the gate stopped them", async () => {
    params = new URLSearchParams({ next: "/admin/members" });
    render(<AdminLoginForm />);

    expect(screen.getByText("/admin/members")).toBeInTheDocument();

    fill();

    await waitFor(() =>
      expect(push).toHaveBeenCalledWith(
        "/verify?role=admin&next=%2Fadmin%2Fmembers",
      ),
    );
  });

  /* Anything that is not a plain path on this site is not somewhere to be
     sent. */
  it("ignores an off-site destination", async () => {
    params = new URLSearchParams({ next: "//evil.example.com" });
    render(<AdminLoginForm />);
    fill();

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
