import { cookies, headers } from "next/headers";
import { ACCESS_COOKIE } from "@/lib/session";

/**
 * What every call to the backend carries on the signed-in person's behalf:
 * the backend's own access token, and the browser's user agent.
 *
 * **Server-only.** It reads an httpOnly cookie and the request's headers, so
 * it runs in server components, server actions and route handlers, and the
 * token never reaches the browser's JavaScript.
 *
 * > [!CAUTION]
 * > The token is `ACCESS_COOKIE`, the one the backend issued — never
 * > `SESSION_COOKIE`, which this frontend signs for itself and the backend
 * > has never seen. Sending that one is what sent everybody back to the
 * > login straight after a correct code (18 Nov 2026): the backend refused
 * > it, and the page took the refusal for a signed-out visitor.
 * > `api-auth.test.ts` holds it.
 */
export interface ApiAuth {
  token?: string;
  userAgent?: string;
}

export async function apiAuth(): Promise<ApiAuth> {
  const [store, incoming] = await Promise.all([cookies(), headers()]);
  return {
    token: store.get(ACCESS_COOKIE)?.value,
    userAgent: incoming.get("user-agent") ?? undefined,
  };
}
