import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { ROUTES } from "@/constants/routes";
import type { ResendOutcome, VerifyOutcome } from "@/app/actions/session";
import { VerifyForm } from "./VerifyForm";

const replace = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));

/* A server action cannot run in jsdom; these stand in for the two the form
   calls, and each test says what the server answers. */
const verifyLoginCode = vi.fn<(code: string) => Promise<VerifyOutcome>>();
const resendLoginCode = vi.fn<() => Promise<ResendOutcome>>();
vi.mock("@/app/actions/session", () => ({
  verifyLoginCode: (code: string) => verifyLoginCode(code),
  resendLoginCode: () => resendLoginCode(),
}));

const box = (n: number) => screen.getByLabelText(`Digit ${n}`);

function typeCode(code: string) {
  code.split("").forEach((digit, index) => {
    const el = box(index + 1);
    el.focus();
    fireEvent.change(el, { target: { value: digit } });
  });
}

beforeEach(() => {
  replace.mockReset();
  verifyLoginCode.mockReset();
  resendLoginCode.mockReset();
});

describe("VerifyForm", () => {
  it("shows no verified badge until the code is accepted", () => {
    const { container } = render(<VerifyForm />);
    expect(container.querySelector("svg path")).toBeNull();
  });

  it("has no verify button", () => {
    render(<VerifyForm />);
    expect(screen.queryByRole("button", { name: /verify/i })).toBeNull();
  });

  it("verifies on its own once the last digit is entered", async () => {
    let answer!: (outcome: VerifyOutcome) => void;
    verifyLoginCode.mockReturnValue(
      new Promise((resolve) => {
        answer = resolve;
      }),
    );
    render(<VerifyForm />);

    typeCode("1234");
    expect(screen.queryByText("Verifying…")).toBeNull();

    typeCode("12345");
    expect(screen.getByText("Verifying…")).toBeInTheDocument();
    expect(box(1)).toBeDisabled();
    expect(verifyLoginCode).toHaveBeenCalledExactlyOnceWith("12345");

    await act(async () => answer({ ok: true, role: "member" }));

    expect(
      await screen.findByText("Verified! Taking you in…"),
    ).toBeInTheDocument();
    expect(replace).toHaveBeenCalledExactlyOnceWith(ROUTES.DASHBOARD);
  });

  it("carries on to where the gate stopped them", async () => {
    verifyLoginCode.mockResolvedValue({ ok: true, role: "admin" });
    render(<VerifyForm returnTo="/admin/members" />);
    typeCode("12345");
    await screen.findByText("Verified! Taking you in…");
    expect(replace).toHaveBeenCalledExactlyOnceWith("/admin/members");
  });

  /* The backend's own words, and the boxes cleared for the next try. */
  it("says why a code was refused, and lets them type another", async () => {
    verifyLoginCode.mockResolvedValue({
      ok: false,
      message: "That code is wrong, used or expired.",
    });
    render(<VerifyForm />);
    typeCode("12345");

    expect(
      await screen.findByText("That code is wrong, used or expired."),
    ).toBeInTheDocument();
    expect(box(1)).not.toBeDisabled();
    expect(box(1)).toHaveValue("");
    expect(replace).not.toHaveBeenCalled();
    expect(screen.queryByText(/Start again/)).toBeNull();
  });

  /* With no login in progress another code will not help, so the way on is
     back to the login. */
  it("sends them back to the login when the login itself is gone", async () => {
    verifyLoginCode.mockResolvedValue({
      ok: false,
      message: "This code can't be used.",
      restart: true,
    });
    render(<VerifyForm back={ROUTES.ADMIN_LOGIN} />);
    typeCode("12345");

    const link = await screen.findByText("Start again from the login page");
    expect(link.closest("a")).toHaveAttribute("href", ROUTES.ADMIN_LOGIN);
  });
});

describe("VerifyForm, asking for another code", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  /* One second at a time: the countdown sets its next timer after each
     render, so the clock has to stop for React in between. */
  const waitOutTheCountdown = () => {
    for (let i = 0; i < 60; i++) act(() => vi.advanceTimersByTime(1000));
  };

  it("offers it only once the countdown has run out", () => {
    render(<VerifyForm />);
    expect(screen.getByText(/Resend code in 60s/)).toBeInTheDocument();
    waitOutTheCountdown();
    expect(screen.getByRole("button", { name: "Resend code" })).toBeVisible();
    vi.useRealTimers();
  });

  it("asks the server, and waits as long as the server says", async () => {
    resendLoginCode.mockResolvedValue({ ok: true, resendAfter: 45 });
    render(<VerifyForm />);
    waitOutTheCountdown();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Resend code" }));
    });

    expect(resendLoginCode).toHaveBeenCalledOnce();
    expect(screen.getByText(/Resend code in 45s/)).toBeInTheDocument();
    vi.useRealTimers();
  });

  /* An administrator's code needs the password again. */
  it("sends an administrator back to log in again", async () => {
    resendLoginCode.mockResolvedValue({
      ok: false,
      message: "Log in again with your password to get a new code.",
      restart: true,
    });
    render(<VerifyForm back={ROUTES.ADMIN_LOGIN} />);
    waitOutTheCountdown();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Resend code" }));
    });

    expect(
      screen.getByText("Log in again with your password to get a new code."),
    ).toBeInTheDocument();
    expect(screen.getByText("Start again from the login page")).toBeVisible();
    vi.useRealTimers();
  });
});
