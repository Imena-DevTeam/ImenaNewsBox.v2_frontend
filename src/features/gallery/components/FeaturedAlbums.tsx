import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Images } from "lucide-react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ROUTES } from "@/constants/routes";
import { FEATURED_ALBUMS } from "../data";
import { SunOrnament } from "./GalleryOrnaments";

/**
 * Six albums, three across, each a photograph with its name on a white pill
 * in one corner and the way into it in the other. The whole card is the
 * link — the arrow is where the design puts the affordance, but a target
 * the size of a card is easier to hit than a 34px circle.
 */
export function FeaturedAlbums() {
  if (FEATURED_ALBUMS.length === 0) {
    return (
      <section aria-labelledby="featured-albums">
        <SectionHeading id="featured-albums" after={<SunOrnament />}>
          Featured Album
        </SectionHeading>
        <p className="border-member-border bg-member-tint text-body text-muted mt-11 rounded-lg border px-6 py-16 text-center">
          No albums have been added yet. They will appear here as the family
          gallery is filled in.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="featured-albums">
      <SectionHeading id="featured-albums" after={<SunOrnament />}>
        Featured Album
      </SectionHeading>

      <ul className="reveal-stagger mt-11 grid gap-x-5 gap-y-13 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_ALBUMS.map((album) => (
          <li key={album.slug}>
            <article className="rounded-field aspect-gallery-album shadow-member group relative overflow-hidden">
              <Image
                src={album.image}
                alt={album.alt}
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="transition-base object-cover group-hover:scale-105"
              />

              <p className="bg-surface text-member-ink text-caption shadow-menu rounded-pill absolute bottom-6 left-5 flex h-6.25 max-w-[70%] items-center gap-1.5 px-2.5">
                <Images aria-hidden className="size-3 shrink-0" />
                <span className="truncate">{album.title}</span>
              </p>

              {/* The link covers the card; the circle is what it looks like. */}
              <Link
                href={`${ROUTES.GALLERY}/${album.slug}`}
                className="focus-visible:outline-brand absolute inset-0"
              >
                <span className="sr-only">
                  Open the {album.title} album, {album.photos.length}{" "}
                  photographs
                </span>
                <span
                  aria-hidden
                  className="bg-surface text-member-ink shadow-menu transition-fast rounded-pill absolute right-4.5 bottom-6 grid size-8.5 place-items-center group-hover:scale-110"
                >
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
