import { useState } from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { OtpInput } from "./otp-input";

function Harness() {
  const [value, setValue] = useState("");
  return (
    <>
      <OtpInput value={value} onChange={setValue} />
      <output data-testid="value">{value}</output>
    </>
  );
}

const box = (n: number) =>
  screen.getByLabelText(`Digit ${n}`) as HTMLInputElement;
const values = () =>
  (screen.getAllByRole("textbox") as HTMLInputElement[]).map((b) => b.value);

/** Type a digit into a box the way a user would: focus, then change. */
function type(n: number, digit: string) {
  const el = box(n);
  el.focus();
  fireEvent.change(el, { target: { value: digit } });
}

describe("OtpInput", () => {
  it("advances focus as digits are typed", () => {
    render(<Harness />);

    "12345".split("").forEach((digit, index) => type(index + 1, digit));

    expect(screen.getByTestId("value")).toHaveTextContent("12345");
    expect(values()).toEqual(["1", "2", "3", "4", "5"]);
    expect(document.activeElement).toBe(box(5));
  });

  it("ignores non-numeric input", () => {
    render(<Harness />);

    type(1, "a");

    expect(values()).toEqual(["", "", "", "", ""]);
  });

  it("steps back and clears on backspace in an empty box", () => {
    render(<Harness />);

    type(1, "1");
    type(2, "2");

    const third = box(3);
    third.focus();
    fireEvent.keyDown(third, { key: "Backspace" });

    expect(values()).toEqual(["1", "", "", "", ""]);
    expect(document.activeElement).toBe(box(2));
  });

  it("moves focus with the arrow keys", () => {
    render(<Harness />);

    const third = box(3);
    third.focus();
    fireEvent.keyDown(third, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(box(2));

    fireEvent.keyDown(box(2), { key: "ArrowRight" });
    expect(document.activeElement).toBe(box(3));
  });

  it("fills every box from a pasted code", () => {
    render(<Harness />);

    fireEvent.paste(box(1), {
      clipboardData: { getData: () => "98765" },
    });

    expect(values()).toEqual(["9", "8", "7", "6", "5"]);
  });

  it("keeps only the leading digits of an over-long paste", () => {
    render(<Harness />);

    fireEvent.paste(box(1), {
      clipboardData: { getData: () => "1234567" },
    });

    expect(values()).toEqual(["1", "2", "3", "4", "5"]);
  });
});
