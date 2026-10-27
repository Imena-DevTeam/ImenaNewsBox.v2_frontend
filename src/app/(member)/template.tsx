import type { ReactNode } from "react";

/**
 * A template, unlike a layout, mounts afresh on every navigation, so each
 * member page arrives with the same short entrance — a soft fade and rise —
 * while the dock and footer around it stay put. That continuity is what
 * makes moving between pages read as one app rather than a reload.
 */
export default function MemberTemplate({ children }: { children: ReactNode }) {
  return <div className="route-enter">{children}</div>;
}
