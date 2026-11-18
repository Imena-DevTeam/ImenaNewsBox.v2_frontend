import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { InvitationFlow, tokenFromHash } from "./InvitationFlow";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

const checkInvitation = vi.fn();
const acceptInvitation = vi.fn();
vi.mock("@/app/actions/invitation", () => ({
  checkInvitation: (...args: unknown[]) => checkInvitation(...args),
  acceptInvitation: (...args: unknown[]) => acceptInvitation(...args),
}));

const MEMBER = {
  ok: true,
  invitation: {
    familyName: "Aganze",
    displayName: "Aganze Rubagumya",
    needsPassword: false,
  },
};
const ADMIN = {
  ok: true,
  invitation: {
    familyName: "Shema",
    displayName: "Shema Nkusi",
    needsPassword: true,
  },
};

function open(hash: string) {
  window.location.hash = hash;
  render(
    <QueryClientProvider client={new QueryClient()}>
      <InvitationFlow />
    </QueryClientProvider>,
  );
}

const type = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

beforeEach(() => {
  push.mockReset();
  checkInvitation.mockReset();
  acceptInvitation.mockReset();
});

afterEach(() => {
  window.location.hash = "";
});

describe("tokenFromHash", () => {
  it("reads the token after #token=, and nothing else", () => {
    expect(tokenFromHash("#token=abc_-123")).toBe("abc_-123");
    expect(tokenFromHash("#token=")).toBeNull();
    expect(tokenFromHash("#other=abc")).toBeNull();
    expect(tokenFromHash("")).toBeNull();
  });
});

describe("InvitationFlow", () => {
  it("says a link with no token is incomplete, and asks nobody", async () => {
    open("");
    expect(
      await screen.findByText("This link is incomplete."),
    ).toBeInTheDocument();
    expect(checkInvitation).not.toHaveBeenCalled();
  });

  /* Opening the page only asks. A mail scanner that opens the link must
     not use it up. */
  it("shows a member their family name, and accepts only on the button", async () => {
    checkInvitation.mockResolvedValue(MEMBER);
    acceptInvitation.mockResolvedValue({ ok: true });
    open("#token=tok-1");

    expect(await screen.findByText("Aganze")).toBeInTheDocument();
    expect(checkInvitation).toHaveBeenCalledWith("tok-1");
    expect(acceptInvitation).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Go to login" }));

    await vi.waitFor(() =>
      expect(push).toHaveBeenCalledWith("/login?name=Aganze"),
    );
    expect(acceptInvitation).toHaveBeenCalledWith("tok-1");
  });

  it("has an administrator choose a password, then go to their door", async () => {
    checkInvitation.mockResolvedValue(ADMIN);
    acceptInvitation.mockResolvedValue({ ok: true });
    open("#token=tok-2");

    await screen.findByText("set your password");
    type("Password", "correct-horse");
    type("Confirm password", "correct-horse");
    fireEvent.click(screen.getByRole("button", { name: "Set password" }));

    expect(
      await screen.findByRole("link", { name: "Go to admin login" }),
    ).toHaveAttribute("href", "/admin/login?name=Shema");
    expect(acceptInvitation).toHaveBeenCalledWith("tok-2", "correct-horse");
  });

  it("refuses a link the backend refuses", async () => {
    checkInvitation.mockResolvedValue({
      ok: false,
      invalid: true,
      message: "This invitation link does not work.",
    });
    open("#token=old");
    expect(
      await screen.findByText("This link no longer works."),
    ).toBeInTheDocument();
  });

  /* Used up between opening the page and pressing the button: a newer
     link was sent, or it was accepted in another tab. */
  it("refuses a link that stops working when it is used", async () => {
    checkInvitation.mockResolvedValue(MEMBER);
    acceptInvitation.mockResolvedValue({
      ok: false,
      invalid: true,
      message: "This invitation link does not work.",
    });
    open("#token=tok-3");

    fireEvent.click(await screen.findByRole("button", { name: "Go to login" }));

    expect(
      await screen.findByText("This link no longer works."),
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it("offers to try again when the server could not be asked", async () => {
    checkInvitation
      .mockResolvedValueOnce({
        ok: false,
        invalid: false,
        message: "We could not reach the server. Try again in a moment.",
      })
      .mockResolvedValueOnce(MEMBER);
    open("#token=tok-4");

    fireEvent.click(await screen.findByRole("button", { name: "Try again" }));

    expect(await screen.findByText("Aganze")).toBeInTheDocument();
  });
});
