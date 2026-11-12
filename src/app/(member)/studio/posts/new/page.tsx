import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { StudioTabs } from "@/features/studio/components/StudioTabs";
import { PostEditor } from "@/features/studio/components/PostEditor";

export const metadata: Metadata = {
  title: "Write a Post",
  description: "Add a story to the family archive.",
};

export default function AdminNewPostPage() {
  return (
    <div className="section-enter min-w-0 pb-12">
      <PageHeader title="POSTS" />
      <span aria-hidden className="accent-bar bg-brand mt-3" />
      <p className="text-body-sm text-muted mt-2">Write a new one</p>

      <div className="mt-6">
        <StudioTabs />
      </div>

      {/* Full width, not a column: the body is the work, and the rail needs
          room beside it. */}
      <div className="mt-8">
        <PostEditor />
      </div>
    </div>
  );
}
