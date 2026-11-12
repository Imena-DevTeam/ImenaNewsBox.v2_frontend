import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import { getSessionRole, mayUseStudio, SESSION_COOKIE } from "@/lib/session";

/**
 * The studio pages are member pages. They sit inside the member layout and
 * wear the same frame, rail and footer as everything else; the only thing
 * this layout adds is the check that you are allowed to be here.
 *
 * That check is deliberately repeated from the middleware, on the server, so
 * the rule never rests on the middleware alone — the same arrangement the
 * admin area has.
 *
 * A member who reaches for it is sent to their own dashboard rather than to
 * a login page, because logging in again would not help them: the register
 * decides who the blogger is, not the login.
 */
export default async function StudioLayout({
  children,
}: {
  children: ReactNode;
}) {
  const store = await cookies();
  const role = await getSessionRole(store.get(SESSION_COOKIE)?.value);

  if (!role) redirect(ROUTES.LOGIN);
  if (!mayUseStudio(role)) redirect(ROUTES.DASHBOARD);

  return <>{children}</>;
}
