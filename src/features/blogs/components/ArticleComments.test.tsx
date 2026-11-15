import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { sampleComments } from "../comments";
import { ArticleComments } from "./ArticleComments";

const SLUG = "a-heart-warming-family-reunion";

afterEach(() => localStorage.clear());

function post(text: string) {
  fireEvent.change(screen.getByLabelText(/add a comment/i), {
    target: { value: text },
  });
  fireEvent.click(screen.getByRole("button", { name: "Post comment" }));
}

describe("ArticleComments", () => {
  it("counts exactly the comments it lists", () => {
    render(<ArticleComments slug={SLUG} />);
    const n = sampleComments(SLUG).length;
    expect(
      screen.getByRole("heading", { name: `Comments (${n})` }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(n);
  });

  it("posts a comment, says where it is kept, and counts it", () => {
    render(<ArticleComments slug={SLUG} />);
    const n = sampleComments(SLUG).length;
    post("What a day that was.");

    expect(screen.getByText("What a day that was.")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(/on this device/i);
    expect(
      screen.getByRole("heading", { name: `Comments (${n + 1})` }),
    ).toBeInTheDocument();
  });

  it("refuses an empty comment and says why", () => {
    render(<ArticleComments slug={SLUG} />);
    post("   ");
    expect(screen.getByText("Write a few words first")).toBeInTheDocument();
  });

  it("lets a reader delete their own comment and nobody else's", () => {
    render(<ArticleComments slug={SLUG} />);
    expect(screen.queryByRole("button", { name: "Delete" })).toBeNull();
    post("Mine to take back.");
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.queryByText("Mine to take back.")).toBeNull();
  });
});
