import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { BLOG_PAGE_POSTS } from "@/features/blogs/data";
import { PostsArchive } from "./PostsArchive";

const dayNumbers = () =>
  screen
    .getAllByRole("listitem")
    .map((row) => row.querySelector("p")?.textContent?.match(/^\d+/)?.[0]);

describe("PostsArchive", () => {
  it("puts the newest entry first, and turns round on request", () => {
    render(<PostsArchive posts={BLOG_PAGE_POSTS} />);

    const newest = dayNumbers();

    fireEvent.change(screen.getByLabelText("Order posts"), {
      target: { value: "oldest" },
    });

    expect(dayNumbers()).toEqual([...newest].reverse());
  });

  /* A published post is the norm, so only the unfinished ones carry a mark.
     Ten badges would say nothing; three say what is waiting. */
  it("marks only the drafts", () => {
    render(<PostsArchive posts={BLOG_PAGE_POSTS} />);

    const drafts = BLOG_PAGE_POSTS.filter((post) => post.status === "draft");
    expect(drafts.length).toBeGreaterThan(0);
    expect(screen.getAllByText("Draft")).toHaveLength(drafts.length);

    /* Scoped to the entries: "Published" is a legitimate option in the
       status filter, and that is not a mark on a post. */
    for (const list of screen.getAllByRole("list")) {
      expect(within(list).queryByText("Published")).not.toBeInTheDocument();
    }
  });

  it("narrows to the drafts, and says how many of how many", () => {
    render(<PostsArchive posts={BLOG_PAGE_POSTS} />);

    fireEvent.change(screen.getByLabelText("Filter by status"), {
      target: { value: "draft" },
    });

    const drafts = BLOG_PAGE_POSTS.filter((post) => post.status === "draft");
    expect(
      screen.getByText(`${drafts.length} of ${BLOG_PAGE_POSTS.length} posts`),
    ).toBeInTheDocument();
  });

  it("says what to do when a search matches nothing", () => {
    render(<PostsArchive posts={BLOG_PAGE_POSTS} />);

    fireEvent.change(screen.getByLabelText("Search posts"), {
      target: { value: "zzzznothing" },
    });

    expect(screen.getByText("No posts match that.")).toBeInTheDocument();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("offers the bulk verbs only once something is selected", () => {
    render(<PostsArchive posts={BLOG_PAGE_POSTS} />);

    expect(
      screen.queryByRole("button", { name: "Publish" }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Select all shown"));

    expect(
      screen.getByText(`${BLOG_PAGE_POSTS.length} selected`),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Publish" })).toBeInTheDocument();
  });

  /* The guard that matters: a selection made before filtering must not let
     a bulk action reach posts the reader can no longer see. */
  it("drops a selection that the filters have hidden", () => {
    render(<PostsArchive posts={BLOG_PAGE_POSTS} />);

    fireEvent.click(screen.getByLabelText("Select all shown"));

    fireEvent.change(screen.getByLabelText("Filter by status"), {
      target: { value: "draft" },
    });

    const drafts = BLOG_PAGE_POSTS.filter((post) => post.status === "draft");
    expect(screen.getByText(`${drafts.length} selected`)).toBeInTheDocument();
  });

  it("reports the outcome of a bulk action instead of going quiet", () => {
    render(<PostsArchive posts={BLOG_PAGE_POSTS} />);

    fireEvent.click(screen.getByLabelText("Select all shown"));
    fireEvent.click(screen.getByRole("button", { name: "Publish" }));

    expect(screen.getByText(/would be published/i)).toBeInTheDocument();
    expect(screen.getByText(/Nothing was saved/i)).toBeInTheDocument();
  });

  /* The title is the way into the editor, not out of the admin area. Reading
     the published post is the small link below it. */
  it("opens every entry for correction, and offers the published post too", () => {
    render(<PostsArchive posts={BLOG_PAGE_POSTS} />);

    const first = BLOG_PAGE_POSTS.find(
      (post) => post.publishedOn === "2026-05-31",
    )!;

    expect(screen.getByRole("link", { name: first.title })).toHaveAttribute(
      "href",
      `/studio/posts/${first.slug}/edit`,
    );

    expect(screen.getAllByText("Read it")[0]!.closest("a")).toHaveAttribute(
      "href",
      `/blogs/${first.slug}`,
    );
  });
});
