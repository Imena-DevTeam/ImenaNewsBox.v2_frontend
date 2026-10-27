import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { FamilyTagline } from "@/components/layout/FamilyTagline";
import { ROUTES } from "@/constants/routes";
import type { Album } from "../data";

/** One album, opened from a card on the gallery. */
export function AlbumView({ album }: { album: Album }) {
  return (
    <div className="page-enter min-w-0">
      <PageHeader
        title={album.title}
        subtitle={`${album.photos.length} photographs`}
      />

      {/* No gutter trick here: unlike the gallery, this grid starts level
          with the rail, so it stays in its own column. */}
      <div>
        <Link
          href={ROUTES.GALLERY}
          className="text-member-accent transition-base text-caption mt-8 inline-flex items-center gap-2 font-semibold hover:gap-3"
        >
          <ArrowLeft aria-hidden className="size-4" />
          Back to the gallery
        </Link>

        <ul className="reveal-stagger mt-8 grid gap-x-5 gap-y-13 sm:grid-cols-2 lg:grid-cols-3">
          {album.photos.map((photo, index) => (
            <li key={`${album.slug}-${index}`}>
              <figure className="rounded-field aspect-gallery-album shadow-member relative overflow-hidden">
                <Image
                  src={photo.image}
                  alt={photo.alt}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </figure>
            </li>
          ))}
        </ul>

        <p className="text-caption text-muted mt-8 text-center">
          Sample album, shown until the family gallery is connected.
        </p>

        <FamilyTagline className="mt-14 md:mt-22" />
      </div>
    </div>
  );
}
