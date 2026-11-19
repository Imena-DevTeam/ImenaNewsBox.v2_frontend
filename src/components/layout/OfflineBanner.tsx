"use client";

import { WifiOff } from "lucide-react";
import { useOnline } from "@/hooks/useOnline";

/**
 * A quiet line at the top of the page while the connection is gone. The page
 * stays as it is underneath: what is on screen can still be read, and the
 * data layer retries once the connection is back.
 */
export function OfflineBanner() {
  const online = useOnline();
  return (
    <div role="status" aria-live="polite">
      {online ? null : (
        <p className="bg-member-ink text-surface text-body-sm flex items-center justify-center gap-2 px-4 py-2 text-center">
          <WifiOff aria-hidden className="size-4 shrink-0" />
          You&rsquo;re offline. What&rsquo;s on screen stays; we&rsquo;ll catch
          up when you&rsquo;re back.
        </p>
      )}
    </div>
  );
}
