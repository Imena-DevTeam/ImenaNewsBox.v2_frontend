import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { SetPasswordForm } from "./SetPasswordForm";

const type = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

/**
 * Losing an administrator's password, and setting a new one.
 *
 * Neither of these screens can do its real work without a backend — one
 * sends an email and the other stores a hash — so what the tests hold is
 * the part that is this frontend's to get right: what it asks for, what it
 * refuses, and what it does not say.
 */
describe("ForgotPasswordForm", () => {
  /* The link goes to the address already on the record. A field for one
     here would let anybody redirect somebody else's reset, which is a
     takeover with extra steps. */
  it("does not ask where to send the link", () => {
    render(<ForgotPasswordForm />);

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.queryByLabelText("Email address")).not.toBeInTheDocument();
  });

  it("will not ask on behalf of nobody", async () => {
    render(<ForgotPasswordForm />);

    fireEvent.click(screen.getByText("Ask for a reset"));

    expect(
      await screen.findByText("Family name is required"),
    ).toBeInTheDocument();
  });

  /* The register is readable by anyone who can see the site; which rows
     hold the administrator role is not. So this screen answers the same way
     whoever asks, and the wording is conditional on purpose. */
  it("answers the same way whether or not the name is an administrator's", async () => {
    const { unmount } = render(<ForgotPasswordForm />);
    type("Name", "Aganze");
    fireEvent.click(screen.getByText("Ask for a reset"));
    const forAdmin = await screen.findByText(
      /other administrators have been told/,
    );
    expect(forAdmin).toBeInTheDocument();
    expect(screen.getByText(/If that name belongs/)).toBeInTheDocument();
    unmount();

    render(<ForgotPasswordForm />);
    type("Name", "Nobody Atall");
    fireEvent.click(screen.getByText("Ask for a reset"));
    expect(
      await screen.findByText(/other administrators have been told/),
    ).toBeInTheDocument();
  });

  it("says nothing was sent, because nothing was", async () => {
    render(<ForgotPasswordForm />);
    type("Name", "Aganze");
    fireEvent.click(screen.getByText("Ask for a reset"));

    expect(await screen.findByText(/no email was sent/)).toBeInTheDocument();
  });
});

describe("SetPasswordForm", () => {
  const mount = (send = vi.fn().mockResolvedValue({ ok: true })) => {
    render(
      <SetPasswordForm
        intro={<p>Choose a password.</p>}
        submitLabel="Set password"
        doneTitle="Your password is set."
        doneBody="Log in with your family name and this password."
        doneHref="/admin/login?name=Shema"
        doneLabel="Go to admin login"
        send={send}
      />,
    );
    return send;
  };

  it("refuses a password under eight characters", async () => {
    mount();
    type("Password", "short");
    type("Confirm password", "short");
    fireEvent.click(screen.getByText("Set password"));

    expect(
      await screen.findByText("Password must be at least 8 characters"),
    ).toBeInTheDocument();
  });

  /* The backend's ceiling, so the form says it rather than the backend. */
  it("refuses a password over 256 characters", async () => {
    const send = mount();
    const long = "x".repeat(257);
    type("Password", long);
    type("Confirm password", long);
    fireEvent.click(screen.getByText("Set password"));

    expect(
      await screen.findByText("Password must be at most 256 characters"),
    ).toBeInTheDocument();
    expect(send).not.toHaveBeenCalled();
  });

  /* A typo here is a lockout that needs the other administrator to undo,
     which is the whole reason for the second field. */
  it("refuses two passwords that are not the same", async () => {
    const send = mount();
    type("Password", "correct-horse");
    type("Confirm password", "correct-hose");
    fireEvent.click(screen.getByText("Set password"));

    expect(
      await screen.findByText("The two passwords are not the same"),
    ).toBeInTheDocument();
    expect(send).not.toHaveBeenCalled();
  });

  it("sends the password, then offers the way to log in", async () => {
    const send = mount();
    type("Password", "correct-horse");
    type("Confirm password", "correct-horse");
    fireEvent.click(screen.getByText("Set password"));

    expect(
      await screen.findByText("Your password is set."),
    ).toBeInTheDocument();
    expect(send).toHaveBeenCalledWith("correct-horse");
    expect(
      screen.getByRole("link", { name: "Go to admin login" }),
    ).toHaveAttribute("href", "/admin/login?name=Shema");
  });

  it("shows the server's refusal and stays on the form", async () => {
    mount(
      vi.fn().mockResolvedValue({
        ok: false,
        message: "Too many sign-ins at once.",
      }),
    );
    type("Password", "correct-horse");
    type("Confirm password", "correct-horse");
    fireEvent.click(screen.getByText("Set password"));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Too many sign-ins at once.",
    );
    expect(screen.queryByText("Your password is set.")).not.toBeInTheDocument();
  });
});
