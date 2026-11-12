/* Shown while the post being corrected streams in. */
import { EditorSkeleton } from "@/features/studio/components/StudioSkeleton";

export default function AdminEditPostLoading() {
  return <EditorSkeleton label="Loading the post" />;
}
