import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { VerifyForm } from "./VerifyForm";

const replace = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));

const box = (n: number) => screen.getByLabelText(`Digit ${n}`);

function typeCode(code: string) {
  code.split("").forEach((digit, index) => {
    const el = box(index + 1);
    el.focus();
    fireEvent.change(el, { target: { value: digit } });
  });
}

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
    render(<VerifyForm email="jane@imena.rw" />);

    typeCode("1234");
    expect(screen.queryByText("Verifying…")).toBeNull();

    typeCode("12345");
    expect(screen.getByText("Verifying…")).toBeInTheDocument();
    expect(box(1)).toBeDisabled();

    expect(
      await screen.findByText("Verified! Taking you in…"),
    ).toBeInTheDocument();
    // Not before the confirmation tick has had time to draw.
    expect(replace).not.toHaveBeenCalled();
    await waitFor(() => expect(replace).toHaveBeenCalledExactlyOnceWith("/"), {
      timeout: 3000,
    });
  });
});
