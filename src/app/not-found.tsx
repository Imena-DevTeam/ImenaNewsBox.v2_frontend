import type { Metadata } from "next";
import { NotFound } from "@/components/ui/ghost-404-page";

export const metadata: Metadata = { title: "Page not found" };

/** Every address that matches no route — and every notFound() call — ends here. */
export default function NotFoundPage() {
  return (
    <main>
      <NotFound />
    </main>
  );
}
