import { PageHeader } from "@/components/layout/PageHeader";
import { FamilyTagline } from "@/components/layout/FamilyTagline";
import { FeaturedImageCarousel } from "./FeaturedImageCarousel";
import { FeaturedMoments } from "./FeaturedMoments";
import { FeaturedAlbums } from "./FeaturedAlbums";

/**
 * The members' gallery: the title, the photo stage, the featured moments,
 * the album grid and the line the family closes every page with. Every
 * section shares the page column, so the whole page holds one left edge.
 */
export function GalleryHome() {
  return (
    <div className="min-w-0">
      <PageHeader />

      <div className="mt-12 md:mt-20">
        <FeaturedImageCarousel />
      </div>

      <div className="mt-16 md:mt-24">
        <FeaturedMoments />
      </div>

      <div className="mt-16 md:mt-24">
        <FeaturedAlbums />
      </div>

      <FamilyTagline className="mt-16 md:mt-22" />
    </div>
  );
}
