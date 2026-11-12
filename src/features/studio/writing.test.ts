import { describe, expect, it } from "vitest";
import { reading } from "./writing";

describe("reading", () => {
  it("counts nothing for an empty body", () => {
    expect(reading("   \n\n  ")).toEqual({
      words: 0,
      minutes: 0,
      paragraphs: 0,
    });
  });

  /* Never "0 min read" for a post that exists — the archive would show it. */
  it("rounds a short post up to a minute", () => {
    expect(reading("Two words").minutes).toBe(1);
  });

  it("reads 200 words as a minute", () => {
    expect(reading(Array(200).fill("word").join(" ")).minutes).toBe(1);
  });

  it("reads 500 words as three minutes", () => {
    expect(reading(Array(500).fill("word").join(" ")).minutes).toBe(3);
  });

  /* Blank lines, the same rule the blog renderer splits paragraphs on. */
  it("counts paragraphs on blank lines, not single breaks", () => {
    const body = "First para.\nStill first.\n\nSecond para.\n\n\nThird.";
    expect(reading(body).paragraphs).toBe(3);
  });

  it("ignores trailing blank lines when counting paragraphs", () => {
    expect(reading("Only one.\n\n\n   ").paragraphs).toBe(1);
  });

  it("treats runs of whitespace as one word break", () => {
    expect(reading("one   two \n three").words).toBe(3);
  });
});
