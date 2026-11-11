import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { StudioTabs } from "@/features/studio/components/StudioTabs";
import { AlbumsBoard } from "@/features/studio/components/AlbumsBoard";
import { FEATURED_ALBUMS } from "@/features/gallery/data";

export const metadata: Metadata = {
  title: "Manage Albums",
  description: "Every album in the family gallery.",
};

/**
 * The albums, at last reachable.
 *
 * `/admin/albums/new` could create one and nothing could open, rename or
 * remove one, so six albums had no way back to them. Like the posts pages
 * this belongs to the social media manager rather than the administrator, so
 * it is off the tab row until that role exists.
 */
export default async function StudioAlbumsPage({
  searchParams,
}: {
  searchParams: Promise<{ album?: string }>;
}) {
  /* The attention queue links to one album by name, so "Add photographs"
     opens the album it is talking about rather than the list. */
  const { album } = await searchParams;
  const asked = FEATURED_ALBUMS.some((one) => one.slug === album)
    ? album
    : undefined;

  const photographs = FEATURED_ALBUMS.reduce(
    (total, album) => total + album.photos.length,
    0,
  );

  return (
    <div className="section-enter min-w-0 pb-12">
      <PageHeader title="ALBUMS" />
      <span aria-hidden className="accent-bar bg-brand mt-3" />
      <p className="text-body-sm text-muted mt-2">
        {FEATURED_ALBUMS.length} albums, {photographs} photographs
      </p>

      <div className="mt-6">
        <StudioTabs />
      </div>

      <div className="mt-8">
        <AlbumsBoard albums={FEATURED_ALBUMS} openSlug={asked} />
      </div>
    </div>
  );
}
