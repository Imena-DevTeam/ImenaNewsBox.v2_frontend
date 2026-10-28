import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlbumView } from "@/features/gallery/components/AlbumView";
import { FEATURED_ALBUMS, albumBySlug } from "@/features/gallery/data";

export function generateStaticParams() {
  return FEATURED_ALBUMS.map((album) => ({ album: album.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ album: string }>;
}): Promise<Metadata> {
  const { album } = await params;
  const found = albumBySlug(album);
  if (!found) return { title: "Album" };

  return {
    title: found.title,
    description: `${found.photos.length} photographs from ${found.title}.`,
  };
}

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ album: string }>;
}) {
  const { album } = await params;
  const found = albumBySlug(album);
  if (!found) notFound();

  return <AlbumView album={found} />;
}
