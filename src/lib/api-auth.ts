import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/session";

/**
 * The credential this frontend sends to the backend.
 *
 * **Server-only.** It reads the session cookie, which is httpOnly, so it
 * cannot be called from a client component — and should not be: a token in
 * the browser is a token in the page source.
 *
 * > [!IMPORTANT]
 * > **This is the seam the real backend lands on.** Today the cookie holds
 * > a token *this* frontend signed, which the backend has never seen and
 * > will not accept. When its auth is connected, the login step stores the
 * > backend's token instead and this function returns that — and nothing
 * > else changes, because every service already takes its token from here.
 *
 * Client components do not call services directly for the same reason.
 * They call a server action, or a route handler, which calls the service
 * with this token.
 */
export async function apiToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value;
}
