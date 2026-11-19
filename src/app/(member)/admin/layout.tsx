import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { requireViewer } from "@/lib/viewer";

/**
 * The admin pages are member pages. They sit inside the member layout and
 * wear the same frame, rail and footer as everything else; the only thing
 * this layout adds is the check that you are allowed to be here.
 *
 * The check is repeated from the middleware, on the server, so the rule
 * never rests on the middleware alone — and with a backend it asks the
 * backend, so somebody demoted a minute ago is turned away now rather than
 * when their session cookie is next renewed.
 */
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const viewer = await requireViewer();
  if (viewer.role !== "admin") redirect(ROUTES.DASHBOARD);
  return <>{children}</>;
}
