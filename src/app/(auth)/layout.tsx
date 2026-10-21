import type { ReactNode } from "react";

/**
 * Sign-in and verification stand on their own: the design gives them no
 * navigation bar and no footer, only a way back home, so they sit outside the
 * public layout rather than inheriting its chrome.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <main className="min-h-dvh">{children}</main>;
}
