import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { mayUseStudio } from "@/lib/session";
import { requireViewer } from "@/lib/viewer";

/**
 * The studio pages are member pages. They sit inside the member layout and
 * wear the same frame, rail and footer as everything else; the only thing
 * this layout adds is the check that you are allowed to be here.
 *
 * The check is repeated from the middleware, on the server, so the rule
 * never rests on the middleware alone — the same arrangement the admin area
 * has. A member who reaches for it is sent to their own dashboard rather
 * than to a login page, because logging in again would not help them: the
 * role decides who uses the studio, not the login.
 */
export default async function StudioLayout({
  children,
}: {
  children: ReactNode;
}) {
  const viewer = await requireViewer();
  if (!mayUseStudio(viewer.role)) redirect(ROUTES.DASHBOARD);
  return <>{children}</>;
}
