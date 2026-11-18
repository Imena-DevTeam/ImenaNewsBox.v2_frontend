import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import {
  personFromAccount,
  signedInPerson,
  type Person,
} from "@/constants/member";
import { apiAuth } from "@/lib/api-auth";
import { authMode } from "@/lib/auth-mode";
import { readSession, SESSION_COOKIE, type Role } from "@/lib/session";
import { usersService } from "@/services/users.service";
import { ApiError } from "@/types/api";

/**
 * Who is reading the page. **Server-only.**
 *
 * With a backend, this is the backend's answer to `GET /users/me`: the role
 * and the name come from its database on every request, so a demotion or a
 * deactivation shows the next time a page renders, whatever the session
 * cookie says. In fixture mode it is the sample person the session's role
 * stands for.
 *
 * `cache` makes it one call per request however many server components ask:
 * the member layout, the admin or studio layout, and a page.
 *
 * Null means nobody usable is signed in: no session, or the backend says the
 * session has ended. A backend that cannot be reached is not "signed out",
 * so that throws, and the page's error boundary says so.
 */
export interface Viewer {
  id: string;
  role: Role;
  person: Person;
}

export const getViewer = cache(async (): Promise<Viewer | null> => {
  const mode = authMode();
  if (mode === "off") return null;

  if (mode === "fixture") {
    const store = await cookies();
    const session = await readSession(store.get(SESSION_COOKIE)?.value);
    if (!session) return null;
    return {
      id: session.userId,
      role: session.role,
      person: signedInPerson(session.role),
    };
  }

  const auth = await apiAuth();
  if (!auth.token) return null;
  try {
    const account = await usersService.me(auth);
    return {
      id: account.id,
      role: account.role,
      person: personFromAccount(account),
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
});

/**
 * The viewer, for a page or layout that cannot be shown without one.
 *
 * The middleware sends a missing session to the login first, so this only
 * catches a session the backend has ended since the cookie was written. Those
 * cookies have to go before the login is shown, because a signed-in device is
 * sent on past it: /session-ended asks the backend, then clears them.
 */
export async function requireViewer(): Promise<Viewer> {
  const viewer = await getViewer();
  if (!viewer) redirect(ROUTES.SESSION_ENDED);
  return viewer;
}
