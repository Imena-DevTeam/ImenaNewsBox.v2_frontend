import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { ARTICLE_SLUGS, BLOG_PAGE_POSTS, getArticleBySlug } from "../data";
import { ArticleDetailView } from "./ArticleDetailView";

/* jsdom hands back a plain string for an imported image, which next/image
   rejects; a bare <img> is all these tests need. */
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

const SLUG = "a-heart-warming-family-reunion";

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
});

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("getArticleBySlug", () => {
  it("has an article for every post the list links to", () => {
    expect(ARTICLE_SLUGS).toHaveLength(BLOG_PAGE_POSTS.length);
    for (const post of BLOG_PAGE_POSTS) {
      expect(getArticleBySlug(post.slug)?.title).toBe(post.title);
    }
  });

  it("knows nothing about a slug that is not a story", () => {
    expect(getArticleBySlug("nobody-wrote-this")).toBeUndefined();
  });

  it("opens the reunion on the crest and credits Ngabe", () => {
    const article = getArticleBySlug(SLUG);
    expect(article?.coverImage).toBeUndefined();
    expect(article?.author.name).toBe("Ngabe");
    expect(article?.publishedAt).toBe("May 31, 2026");
  });
});

describe("ArticleDetailView", () => {
  const article = getArticleBySlug(SLUG)!;

  it("shows the pill, a way back, the title and the crest", () => {
    render(<ArticleDetailView article={article} />);
    expect(screen.getByText("Activity")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Back to all stories" }),
    ).toHaveAttribute("href", "/blogs");
    expect(
      screen.getByRole("heading", { name: /heart-warming family reunion/i }),
    ).toBeInTheDocument();
    expect(screen.getByAltText("IMENA family crest")).toBeInTheDocument();
  });

  it("puts the photograph after the third paragraph, with its caption", () => {
    render(<ArticleDetailView article={article} />);
    expect(
      screen.getByText(/Generations embracing at the welcome banquet/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Enlarge photograph/ }),
    ).toBeInTheDocument();
  });

  it("likes and unlikes, and keeps the count honest", () => {
    render(<ArticleDetailView article={article} />);
    const like = screen.getByRole("button", { name: /Like this story/ });
    expect(like).toHaveTextContent("48");
    fireEvent.click(like);
    expect(like).toHaveAttribute("aria-pressed", "true");
    expect(like).toHaveTextContent("49");
    fireEvent.click(like);
    expect(like).toHaveTextContent("48");
  });

  it("saves the story", () => {
    render(<ArticleDetailView article={article} />);
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByRole("button", { name: "Saved" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("copies the link and says so", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    render(<ArticleDetailView article={article} />);
    fireEvent.click(screen.getByRole("button", { name: "Share this story" }));
    expect(writeText).toHaveBeenCalledWith(window.location.href);
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Article link copied to clipboard!",
    );
  });
});
