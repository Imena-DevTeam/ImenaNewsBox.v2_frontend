import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { BLOG_PAGE_POSTS, getArticleBySlug } from "@/features/blogs/data";
import { PostEditor } from "./PostEditor";

const post = BLOG_PAGE_POSTS.find((one) => one.status === "published")!;

const editable = {
  slug: post.slug,
  title: post.title,
  category: post.category,
  excerpt: post.excerpt,
  body: getArticleBySlug(post.slug)!.contentParagraphs.join("\n\n"),
  status: post.status,
  publishedOn: post.publishedOn,
  cover: post.cover,
  coverAlt: post.coverAlt,
};

const write = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

const fillNewPost = () => {
  fireEvent.change(screen.getByPlaceholderText(/heart-warming/i), {
    target: { value: "The long table" },
  });
  write("The post", "First paragraph.\n\nSecond paragraph.");
  write("Excerpt", "One line for the card.");
};

describe("PostEditor", () => {
  it("counts the words, paragraphs and reading time as they are written", () => {
    render(<PostEditor />);

    expect(screen.getByText("Nothing written yet")).toBeInTheDocument();

    write("The post", "one two three\n\nfour five");
    expect(screen.getByText(/5 words, 2 paragraphs,/)).toBeInTheDocument();
    /* The reading time is an element of its own, so it can dip and come back
       when it crosses a minute. The words cannot: they change on every
       keystroke and mean nothing on their own. */
    expect(screen.getByText("1 min read")).toBeInTheDocument();
  });

  /* The archive and the family's blog both lead with a photograph, so a post
     published without one is published broken. A draft may wait for it. */
  it("will not publish a post with no cover photograph", async () => {
    render(<PostEditor />);
    fillNewPost();

    fireEvent.click(screen.getByText("Publish"));

    expect(
      await screen.findByText(/A cover photograph is needed before publishing/),
    ).toBeInTheDocument();
  });

  it("saves that same post as a draft without one", async () => {
    render(<PostEditor />);
    fillNewPost();

    fireEvent.click(screen.getByText("Save as draft"));

    expect(
      await screen.findByText(/would be moved to the drafts/),
    ).toBeInTheDocument();
  });

  /* An existing post has a cover already, so publishing is not blocked. */
  it("keeps the photograph a post already has", async () => {
    render(<PostEditor post={editable} />);

    expect(
      screen.getByText("Keeping the photograph this post already has."),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Save changes"));

    expect(
      await screen.findByText(/would be saved to the archive/),
    ).toBeInTheDocument();
  });

  it("opens the post it was given, body and all", () => {
    render(<PostEditor post={editable} />);

    expect(screen.getByLabelText("The post")).toHaveValue(editable.body);
    expect(screen.getByText(/^Published /)).toBeInTheDocument();
  });

  /* She writes in a textarea and publishes to the whole family: the preview
     is the only place she sees what they will see. */
  it("shows the writing as the family will read it", () => {
    render(<PostEditor post={editable} />);

    fireEvent.click(screen.getByText("Preview"));

    expect(screen.queryByLabelText("The post")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: editable.title }),
    ).toBeInTheDocument();
    /* The paragraphs, split on the blank lines the editor splits them on. */
    const first = editable.body.split("\n\n")[0]!;
    expect(screen.getByText(first)).toBeInTheDocument();

    fireEvent.click(screen.getByText("Back to writing"));
    expect(screen.getByLabelText("The post")).toBeInTheDocument();
  });

  it("says a post would be published on the day it is given", async () => {
    render(<PostEditor post={editable} />);

    write("Publish on (optional)", "2026-12-24");
    fireEvent.click(screen.getByText("Save changes"));

    expect(
      await screen.findByText(/published on December 24, 2026/),
    ).toBeInTheDocument();
  });

  /* Deleting the post you are looking at belongs in the editor, not only in
     the archive's bulk bar. */
  it("asks before deleting the post, and reports it", async () => {
    render(<PostEditor post={editable} />);

    fireEvent.click(screen.getByText("Delete this post"));
    expect(
      screen.getByRole("heading", { name: `Delete “${editable.title}”?` }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Keep it"));
    fireEvent.click(screen.getByText("Delete this post"));
    fireEvent.click(screen.getByText("Delete the post"));

    expect(await screen.findByText(/would be deleted/)).toBeInTheDocument();
  });

  it("offers no delete for a post that does not exist yet", () => {
    render(<PostEditor />);
    expect(screen.queryByText("Delete this post")).not.toBeInTheDocument();
  });
  /* Being told what is missing after pressing Publish is the wrong end of
     the sequence for something she can see is not there. */
  it("says a cover is needed before she presses publish", () => {
    render(<PostEditor />);

    const needed = screen.getByText("Needed before publishing");
    expect(needed).toBeInTheDocument();
    /* And the button points at it, rather than being disabled: a disabled
       control cannot explain itself. */
    expect(screen.getByText("Publish")).toHaveAttribute(
      "aria-describedby",
      needed.id,
    );
  });

  /* A post that has one says nothing, because there is nothing to say. */
  it("says nothing about the cover of a post that has one", () => {
    render(<PostEditor post={editable} />);

    expect(
      screen.queryByText("Needed before publishing"),
    ).not.toBeInTheDocument();
  });

  /* The rail described the record as it was loaded, which stopped being true
     the moment she saved. */
  it("follows what she has just done, not how the post arrived", async () => {
    render(<PostEditor post={editable} />);

    expect(screen.getByText(/^Published /)).toBeInTheDocument();

    fireEvent.click(screen.getByText("Move to drafts"));

    expect(
      await screen.findByText("Would move to the drafts"),
    ).toBeInTheDocument();
  });
});
