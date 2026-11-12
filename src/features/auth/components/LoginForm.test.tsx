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

/* The login steps are server actions now: the role is decided there and
   held in a signed cookie, never passed on in the URL. These stand in for
   the round trip and record what the form asked for. */
const beginMemberLogin = vi.fn(
  async (_name: string) => ({ ok: true }) as const,
);
const beginAdminLogin = vi.fn(
  async (_email: string, _password: string) => ({ ok: true }) as const,
);
vi.mock("@/app/actions/session", () => ({
  beginMemberLogin: (name: string) => beginMemberLogin(name),
  beginAdminLogin: (email: string, password: string) =>
    beginAdminLogin(email, password),
}));

const logIn = () =>
  fireEvent.click(screen.getByRole("button", { name: "Log In" }));

beforeEach(() => {
  push.mockClear();
  beginMemberLogin.mockClear();
  beginAdminLogin.mockClear();
  beginMemberLogin.mockResolvedValue({ ok: true } as const);
  beginAdminLogin.mockResolvedValue({ ok: true } as const);
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
    expect(beginMemberLogin).toHaveBeenCalledWith("Imena");
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
  /* She uses the family's one login. The name goes to the server, which
     looks it up in the register and holds the answer in a cookie. */
  it("hands the name to the server rather than deciding here", async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Ngabe" },
    });
    logIn();

    await waitFor(() => expect(beginMemberLogin).toHaveBeenCalledWith("Ngabe"));
  });

  /* The line this test holds: /verify?role=admin and any five digits made
     you an administrator until 12 Nov 2026. Nothing about what you are may
     travel in a URL, for the blogger or for anybody else. */
  it("puts no role in the URL, whoever signs in", async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Ngabe" },
    });
    logIn();

    await waitFor(() => expect(push).toHaveBeenCalled());
    expect(push.mock.calls[0]![0]).toBe("/verify");
  });

  it("carries the destination, which is all a URL decides", async () => {
    params = new URLSearchParams({ next: "/studio/posts" });
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Ngabe" },
    });
    logIn();

    await waitFor(() =>
      expect(push).toHaveBeenCalledWith("/verify?next=%2Fstudio%2Fposts"),
    );
  });

  /* A login the server turned down goes nowhere. */
  it("stays put and says so when the server refuses", async () => {
    beginMemberLogin.mockResolvedValue({
      ok: false,
      message: "Nope.",
    } as never);
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Imena" },
    });
    logIn();

    expect(await screen.findByText("Nope.")).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });
});

describe("AdminLoginForm", () => {
  const fill = () => {
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Aganze" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "correct-horse" },
    });
    logIn();
  };

  it("sends both halves of the credential to the server", async () => {
    render(<AdminLoginForm />);
    fill();

    await waitFor(() =>
      expect(beginAdminLogin).toHaveBeenCalledWith("Aganze", "correct-horse"),
    );
    expect(push).toHaveBeenCalledWith("/verify?from=admin");
  });

  /* It validated the shape of these two fields and then threw them away,
     pushing a URL anybody could type. A refused credential goes nowhere. */
  it("goes nowhere when the credential is refused", async () => {
    beginAdminLogin.mockResolvedValue({
      ok: false,
      message: "That name and password do not match an administrator.",
    } as never);
    render(<AdminLoginForm />);
    fill();

    expect(
      await screen.findByText(
        "That name and password do not match an administrator.",
      ),
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  /* The design asks for a name on both doors. What this door adds is the
     password, so a blank one goes nowhere and nothing is held. */
  it("will not go on without a password", async () => {
    render(<AdminLoginForm />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Aganze" },
    });
    logIn();

    expect(
      await screen.findByText("Password must be at least 8 characters"),
    ).toBeInTheDocument();
    expect(beginAdminLogin).not.toHaveBeenCalled();
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
        "/verify?from=admin&next=%2Fadmin%2Fmembers",
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
      expect(push).toHaveBeenCalledWith("/verify?from=admin"),
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
