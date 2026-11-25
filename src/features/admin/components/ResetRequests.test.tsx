import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import type { ResetRequest } from "@/types/invitation";
import { ResetRequests } from "./ResetRequests";

const approveResetRequest = vi.fn();
const declineResetRequest = vi.fn();
vi.mock("@/app/actions/reset-requests", () => ({
  approveResetRequest: (...args: unknown[]) => approveResetRequest(...args),
  declineResetRequest: (...args: unknown[]) => declineResetRequest(...args),
}));

const NOW = "2026-11-24T10:00:00.000Z";
const SHEMA: ResetRequest = {
  id: "rr-1",
  userId: "u-2",
  familyName: "Shema",
  displayName: "Shema Nkusi",
  email: "shema@example.org",
  requestedAt: "2026-11-24T08:00:00.000Z",
};

beforeEach(() => {
  approveResetRequest.mockReset();
  declineResetRequest.mockReset();
});

const row = () => screen.getByText("Shema Nkusi").closest("li")!;

describe("ResetRequests", () => {
  it("shows where the link would go", () => {
    render(<ResetRequests requests={[SHEMA]} now={NOW} />);
    expect(
      within(row()).getByText(/The link would go to shema@example.org/),
    ).toBeInTheDocument();
  });

  /* Anybody who knows a family name can ask on that person's behalf. */
  it("sends only after a confirmation that says to check with them", async () => {
    approveResetRequest.mockResolvedValue({ ok: true });
    render(<ResetRequests requests={[SHEMA]} now={NOW} />);

    fireEvent.click(
      within(row()).getByRole("button", { name: "Send the link" }),
    );
    expect(approveResetRequest).not.toHaveBeenCalled();
    expect(screen.getByText(/check with them first/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Send it" }));

    expect(
      await screen.findByText(/on its way to shema@example.org/),
    ).toBeInTheDocument();
    expect(approveResetRequest).toHaveBeenCalledWith("rr-1");
    expect(screen.queryByText("Shema Nkusi")).not.toBeInTheDocument();
  });

  it("declines at once, and says nobody was emailed", async () => {
    declineResetRequest.mockResolvedValue({ ok: true });
    render(<ResetRequests requests={[SHEMA]} now={NOW} />);

    fireEvent.click(within(row()).getByRole("button", { name: "Decline" }));

    expect(await screen.findByText(/Nobody was emailed/)).toBeInTheDocument();
    expect(declineResetRequest).toHaveBeenCalledWith("rr-1");
  });

  /* The backend keeps the request open when the email fails. */
  it("keeps a request whose link could not be sent", async () => {
    approveResetRequest.mockResolvedValue({
      ok: false,
      message: "The email could not be sent.",
    });
    render(<ResetRequests requests={[SHEMA]} now={NOW} />);

    fireEvent.click(
      within(row()).getByRole("button", { name: "Send the link" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Send it" }));

    expect(
      await screen.findByText("The email could not be sent."),
    ).toBeInTheDocument();
    expect(screen.getByText("Shema Nkusi")).toBeInTheDocument();
  });

  it("drops a request another administrator already answered", async () => {
    declineResetRequest.mockResolvedValue({
      ok: false,
      gone: true,
      message: "That request is no longer open.",
    });
    render(<ResetRequests requests={[SHEMA]} now={NOW} />);

    fireEvent.click(within(row()).getByRole("button", { name: "Decline" }));

    expect(
      await screen.findByText("That request is no longer open."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Shema Nkusi")).not.toBeInTheDocument();
  });

  it("does not claim nobody is waiting when the list could not be loaded", () => {
    render(<ResetRequests requests={null} now={NOW} />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "The requests could not be loaded.",
    );
    expect(
      screen.queryByText("Nobody has lost their password."),
    ).not.toBeInTheDocument();
  });
});
