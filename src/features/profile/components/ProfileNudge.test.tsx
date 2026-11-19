import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BORN_ON_KEY } from "../completion";
import { ProfileNudge } from "./ProfileNudge";

afterEach(() => localStorage.clear());

const title = "Add your date of birth";

describe("ProfileNudge", () => {
  it("asks for a missing date and links straight into the editor", () => {
    render(<ProfileNudge registeredBornOn="" />);
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Add it" })).toHaveAttribute(
      "href",
      "/profile?edit=1",
    );
  });

  it("says nothing when the register already holds the date", () => {
    render(<ProfileNudge registeredBornOn="1990-01-01" />);
    expect(screen.queryByText(title)).toBeNull();
  });

  it("goes away once the member adds it", () => {
    localStorage.setItem(BORN_ON_KEY, "1990-01-01");
    render(<ProfileNudge registeredBornOn="" />);
    expect(screen.queryByText(title)).toBeNull();
  });

  it("never asks for a motto: mottos are the family's", () => {
    render(<ProfileNudge registeredBornOn="" />);
    expect(screen.queryByText(/motto/i)).toBeNull();
  });

  it("can be put away for later", () => {
    render(<ProfileNudge registeredBornOn="" />);
    fireEvent.click(
      screen.getByRole("button", { name: "Hide this until later" }),
    );
    expect(screen.queryByText(title)).toBeNull();
  });
});
