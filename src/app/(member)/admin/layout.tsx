import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import { getSessionRole, SESSION_COOKIE } from "@/lib/session";

/**
 * The admin pages are member pages. They sit inside the member layout and
 * wear the same frame, rail and footer as everything else; the only thing
 * this layout adds is the check that you are allowed to be here.
 *
 * That check is deliberately repeated from the middleware, on the server, so
 * the rule never rests on the middleware alone.
 */
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const store = await cookies();
  const role = await getSessionRole(store.get(SESSION_COOKIE)?.value);

  if (!role) redirect(ROUTES.ADMIN_LOGIN);
  if (role !== "admin") redirect(ROUTES.DASHBOARD);

  return <>{children}</>;
}
