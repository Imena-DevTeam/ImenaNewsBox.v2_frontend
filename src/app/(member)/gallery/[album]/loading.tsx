/* Shown while one album streams in; without it the whole gallery's skeleton would show. */
import { AlbumSkeleton } from "@/features/gallery/components/AlbumSkeleton";

export default function AlbumLoading() {
  return <AlbumSkeleton />;
}
