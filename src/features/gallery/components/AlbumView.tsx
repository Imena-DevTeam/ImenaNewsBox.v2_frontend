import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { FamilyTagline } from "@/components/layout/FamilyTagline";
import { ROUTES } from "@/constants/routes";
import type { Album } from "../data";
import { AlbumGrid } from "./AlbumGrid";

/** One album, opened from a card on the gallery. */
export function AlbumView({ album }: { album: Album }) {
  return (
    <div className="min-w-0">
      <PageHeader
        title={album.title}
        subtitle={`${album.photos.length} photographs`}
      />

      <div>
        <Link
          href={ROUTES.GALLERY}
          className="text-member-accent transition-base text-caption mt-8 inline-flex items-center gap-2 font-semibold hover:gap-3"
        >
          <ArrowLeft aria-hidden className="size-4" />
          Back to the gallery
        </Link>

        <AlbumGrid title={album.title} photos={album.photos} />

        <p className="text-caption text-muted mt-8 text-center">
          Sample album, shown until the family gallery is connected.
        </p>

        <FamilyTagline className="mt-14 md:mt-22" />
      </div>
    </div>
  );
}
