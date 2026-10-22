import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyPanel } from "@/features/auth/components/VerifyPanel";

export const metadata: Metadata = { title: "Verify Your Account" };

/**
 * The page itself reads nothing from the request, so it is prerendered like
 * every other route. The query string is read inside VerifyPanel, behind the
 * Suspense boundary that a client-side read of it requires.
 */
export default function VerifyPage() {
  return (
    <main className="py-auth-lg flex min-h-dvh flex-col px-6">
      <div className="max-w-auth-verify mx-auto flex w-full flex-1 flex-col">
        <Suspense fallback={<div className="flex-1" />}>
          <VerifyPanel />
        </Suspense>
      </div>
    </main>
  );
}
