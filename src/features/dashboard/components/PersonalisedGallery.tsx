import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { blogReunion } from "@/lib/images";
import { cn } from "@/lib/cn";

/**
 * The photograph that closes the dashboard's article column: the family's
 * own gallery, named along the foot with the way through to it. The image is
 * the link's whole surface; the pill is the visible affordance.
 */
export function PersonalisedGallery({ className }: { className?: string }) {
  return (
    <Link
      href={ROUTES.GALLERY}
      aria-label="Open the family gallery"
      className={cn(
        "group focus-visible:outline-brand relative block aspect-16/9 overflow-hidden rounded-2xl",
        className,
      )}
    >
      <Image
        src={blogReunion}
        alt="Family members gathered together"
        placeholder="blur"
        fill
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 p-5 sm:p-6">
        <span className="text-h4-m md:text-h4 font-semibold text-white">
          Personalised Gallery
        </span>
        <span className="text-brand shadow-menu inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold transition-transform group-hover:translate-x-0.5">
          View Gallery
          <ArrowRight aria-hidden className="size-4" />
        </span>
      </div>
    </Link>
  );
}
