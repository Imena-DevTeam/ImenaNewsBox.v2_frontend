import { ToastProvider } from "@/components/ui/Toaster";
import { describe, expect, it } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { FEATURED_ALBUMS } from "@/features/gallery/data";
import { AlbumsBoard } from "./AlbumsBoard";

/* The status line, then whatever the toast is saying about the last action. */
const status = () =>
  `${screen.getByRole("status").textContent ?? ""} ${
    document.querySelector("[data-toaster]")?.textContent ?? ""
  }`;

const cards = () => screen.getAllByRole("listitem").length;

const titles = () =>
  screen.getAllByRole("heading", { level: 3 }).map((one) => one.textContent);

describe("AlbumsBoard", () => {
  it("shows every album, newest first", () => {
    render(<AlbumsBoard albums={FEATURED_ALBUMS} />, {
      wrapper: ToastProvider,
    });

    expect(cards()).toBe(FEATURED_ALBUMS.length);
    expect(status()).toMatch(
      `${FEATURED_ALBUMS.length} of ${FEATURED_ALBUMS.length} albums`,
    );
  });

  it("finds an album by its place", () => {
    render(<AlbumsBoard albums={FEATURED_ALBUMS} />, {
      wrapper: ToastProvider,
    });

    fireEvent.change(screen.getByLabelText("Search albums"), {
      target: { value: FEATURED_ALBUMS[0]!.location },
    });

    expect(cards()).toBeGreaterThan(0);
    expect(cards()).toBeLessThanOrEqual(FEATURED_ALBUMS.length);
  });

  /* Several albums share a date, so "oldest" is not simply the reverse of
     "newest" — what has to hold is the direction. */
  it("orders by date either way round, and by title on request", () => {
    render(<AlbumsBoard albums={FEATURED_ALBUMS} />, {
      wrapper: ToastProvider,
    });

    const dateOf = (title: string | null) =>
      FEATURED_ALBUMS.find((album) => album.title === title)?.date ?? "";

    const newest = titles().map(dateOf);
    expect(newest).toEqual([...newest].sort().reverse());

    fireEvent.change(screen.getByLabelText("Order albums"), {
      target: { value: "oldest" },
    });
    const oldest = titles().map(dateOf);
    expect(oldest).toEqual([...oldest].sort());

    fireEvent.change(screen.getByLabelText("Order albums"), {
      target: { value: "title" },
    });
    const byTitle = titles();
    expect(byTitle).toEqual(
      [...byTitle].sort((a, b) => (a ?? "").localeCompare(b ?? "")),
    );
  });

  /* A full album is the norm, so only an empty one is marked. Every album in
     the fixture has photographs, which is also why the attention queue never
     had an empty album to report. */
  it("marks no album when every album has photographs", () => {
    render(<AlbumsBoard albums={FEATURED_ALBUMS} />, {
      wrapper: ToastProvider,
    });

    expect(screen.queryByText("No photographs")).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("With no photographs"));
    expect(screen.getByText("No albums match that.")).toBeInTheDocument();
  });

  it("renames an album, and says nothing was stored", async () => {
    render(<AlbumsBoard albums={FEATURED_ALBUMS} />, {
      wrapper: ToastProvider,
    });

    const album = titles()[0]!;
    fireEvent.click(screen.getAllByText("Edit")[0]!);

    /* The card's own heading carries the same name, so the panel's is read
       inside the panel. */
    const panel = within(document.querySelector("dialog")!);
    expect(panel.getByRole("heading", { name: album })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Album title"), {
      target: { value: "The long table, 2026" },
    });
    fireEvent.click(screen.getByText("Save changes"));

    await waitFor(() =>
      expect(status()).toMatch(
        new RegExp(`${album} would be renamed to The long table, 2026`),
      ),
    );
    expect(status()).toMatch(/Nothing was stored/);
    expect(titles()).toContain("The long table, 2026");
  });

  it("removes an album at once, and puts it back on Undo", async () => {
    render(<AlbumsBoard albums={FEATURED_ALBUMS} />, {
      wrapper: ToastProvider,
    });

    const album = FEATURED_ALBUMS[1]!;
    fireEvent.click(screen.getByLabelText(`Remove ${album.title}`));

    expect(cards()).toBe(FEATURED_ALBUMS.length - 1);
    expect(status()).toMatch(new RegExp(`${album.title} was removed`));

    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(cards()).toBe(FEATURED_ALBUMS.length);
    expect(screen.getByLabelText(`Remove ${album.title}`)).toBeInTheDocument();
  });
  /* She could only rename an album until 11 Nov 2026. The queue's own row
     said "Add photographs" and linked here, where she could not. */
  it("removes a photograph from an album that already exists", async () => {
    render(<AlbumsBoard albums={FEATURED_ALBUMS} />, {
      wrapper: ToastProvider,
    });

    fireEvent.click(
      within(screen.getAllByRole("listitem")[0]!).getByText("Edit"),
    );

    const panel = within(document.querySelector("dialog")!);
    const first = panel.getAllByRole("button", { name: /^Remove / })[0]!;
    fireEvent.click(first);

    fireEvent.click(panel.getByText("Save changes"));

    await waitFor(() => expect(status()).toMatch(/would lose 1 photograph/));
    expect(status()).toMatch(/Nothing was stored/);
  });

  it("opens the album a link asked about", () => {
    const album = FEATURED_ALBUMS[2]!;
    render(<AlbumsBoard albums={FEATURED_ALBUMS} openSlug={album.slug} />, {
      wrapper: ToastProvider,
    });

    const panel = within(document.querySelector("dialog")!);
    expect(
      panel.getByRole("heading", { name: album.title }),
    ).toBeInTheDocument();
    expect(
      panel.getByText(`${album.photos.length} photographs in the album.`),
    ).toBeInTheDocument();
  });

  it("says when an album it opens is empty", () => {
    const empty = { ...FEATURED_ALBUMS[0]!, photos: [] };
    render(<AlbumsBoard albums={[empty]} openSlug={empty.slug} />, {
      wrapper: ToastProvider,
    });

    const panel = within(document.querySelector("dialog")!);
    expect(panel.getByText(/The album is empty/)).toBeInTheDocument();
  });
});
