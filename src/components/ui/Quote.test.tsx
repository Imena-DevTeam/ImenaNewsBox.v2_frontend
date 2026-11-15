import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PersonAvatar } from "./PersonAvatar";
import { Quote } from "./Quote";

describe("Quote", () => {
  it("sets the words in quotation marks with the meaning and who said it", () => {
    render(
      <Quote meaning="All of us together" cite="The Hope motto">
        Twese hamwe
      </Quote>,
    );
    expect(
      screen.getByText("“Twese hamwe”", { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByText("All of us together")).toBeInTheDocument();
    expect(screen.getByText("The Hope motto")).toBeInTheDocument();
  });
});

describe("PersonAvatar", () => {
  it("falls back to initials with no portrait", () => {
    render(<PersonAvatar name="Uwimana Claire" />);
    expect(screen.getByText("UC")).toBeInTheDocument();
  });
});
