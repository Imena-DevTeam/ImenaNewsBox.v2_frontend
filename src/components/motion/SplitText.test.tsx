import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SplitText } from "./SplitText";

describe("SplitText", () => {
  it("gives assistive technology the sentence once, not piece by piece", () => {
    render(
      <SplitText
        as="h1"
        by="char"
        lines={[
          ["Rediscover"],
          [{ text: "Your Legacy.", className: "text-display-soft" }],
        ]}
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Rediscover Your Legacy.",
      }),
    ).toBeInTheDocument();
  });

  it("keeps the colour of a picked-out segment on its words", () => {
    const { container } = render(
      <SplitText
        lines={[
          [
            "Crafting Stories that ",
            { text: "connect.", className: "text-heading" },
          ],
        ]}
      />,
    );

    const coloured = container.querySelectorAll("[aria-hidden] .text-heading");
    expect(coloured).toHaveLength(1);
    expect(coloured[0]).toHaveTextContent("connect.");
  });
});
