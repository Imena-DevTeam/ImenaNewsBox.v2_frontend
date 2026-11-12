import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ROUTES } from "@/constants/routes";
import { StudioTabs } from "@/features/studio/components/StudioTabs";
import { AlbumForm } from "@/features/studio/components/AlbumForm";

export const metadata: Metadata = {
  title: "Create Album",
  description: "Add a new album to the family gallery.",
};

export default function AdminNewAlbumPage() {
  return (
    <div className="section-enter min-w-0 pb-12">
      <PageHeader title="ALBUMS" />
      <span aria-hidden className="accent-bar bg-brand mt-3" />
      <p className="text-body-sm text-muted mt-2">Create one for the gallery</p>

      <div className="mt-6">
        <StudioTabs />
      </div>

      <Link
        href={ROUTES.STUDIO_ALBUMS}
        className="text-body-sm text-muted hover:text-brand focus-visible:outline-brand transition-fast mt-6 inline-flex items-center gap-2"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Back to the albums
      </Link>

      {/* Full width, not a column: the photographs are the work, and the
          details need room beside them. */}
      <div className="mt-6">
        <AlbumForm />
      </div>
    </div>
  );
}
