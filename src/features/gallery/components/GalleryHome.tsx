import { PageHeader } from "@/components/layout/PageHeader";
import { FamilyTagline } from "@/components/layout/FamilyTagline";
import {
  CameraOrnament,
  HeartsOrnament,
  SunOrnament,
} from "./GalleryOrnaments";
import { FeaturedImageCarousel } from "./FeaturedImageCarousel";
import { FeaturedVideos } from "./FeaturedVideos";
import { FeaturedAlbums } from "./FeaturedAlbums";

/**
 * The members' gallery, in the design's order and its own rhythm: the
 * title, the five-up stage, the video frame, the album grid and the line
 * the family closes every page with.
 *
 * Everything under the title is centred on the page rather than on the
 * column beside the rail — the design runs the album grid into the gutter
 * the rail leaves once it has scrolled past — so the body reclaims the
 * rail's width from `md` up, where the rail is a column at all.
 *
 * Each ornament hangs off the section it belongs to, so none of them drift
 * when a section changes height.
 */
export function GalleryHome() {
  return (
    <div className="page-enter min-w-0">
      <PageHeader />

      <div className="md:-ml-39">
        <div className="relative mt-12 md:mt-30">
          <CameraOrnament />
          <FeaturedImageCarousel />
        </div>

        <div className="relative mt-14 md:mt-28">
          <HeartsOrnament />
          <SunOrnament />
          <FeaturedVideos />
        </div>

        <div className="relative mt-14 md:mt-20">
          <FeaturedAlbums />
        </div>

        <FamilyTagline className="relative mt-14 md:mt-22" />
      </div>
    </div>
  );
}
