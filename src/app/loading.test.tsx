import type { ComponentType } from "react";
import { render, screen } from "@testing-library/react";
import DashboardLoading from "./(member)/dashboard/loading";
import BlogsLoading from "./(member)/blogs/loading";
import ArticleLoading from "./(member)/blogs/[slug]/loading";
import TreeLoading from "./(member)/tree/loading";
import ResourcesLoading from "./(member)/resources/loading";
import BirthdaysLoading from "./(member)/birthdays/loading";
import ProfileLoading from "./(member)/profile/loading";
import GalleryLoading from "./(member)/gallery/loading";
import AlbumLoading from "./(member)/gallery/[album]/loading";
import FamilyTreeLoading from "./(public)/family-tree/loading";

/* Every route's loading screen, with what it tells a screen reader. */
const ROUTES: [string, ComponentType, string][] = [
  ["/dashboard", DashboardLoading, "Loading your family dashboard"],
  ["/blogs", BlogsLoading, "Loading the family blog"],
  ["/blogs/[slug]", ArticleLoading, "Loading the story"],
  ["/tree", TreeLoading, "Loading the family tree"],
  ["/resources", ResourcesLoading, "Loading family resources"],
  ["/birthdays", BirthdaysLoading, "Loading family birthdays"],
  ["/profile", ProfileLoading, "Loading your profile"],
  ["/gallery", GalleryLoading, "Loading the family gallery"],
  ["/gallery/[album]", AlbumLoading, "Loading the album"],
  ["/family-tree", FamilyTreeLoading, "Loading the family tree"],
];

describe.each(ROUTES)("%s loading screen", (_route, Loading, label) => {
  it("announces itself once and draws shimmer placeholders", () => {
    const { container } = render(<Loading />);

    expect(screen.getByText(label)).toBeInTheDocument();
    expect(container.querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(container.querySelectorAll(".skeleton").length).toBeGreaterThan(3);
  });
});
