import { cookies, headers } from "next/headers";
import { SESSION_COOKIE } from "@/lib/session";

/**
 * What every call to the backend carries on the signed-in person's behalf.
 *
 * **Server-only.** It reads an httpOnly cookie and the request's headers, so
 * it runs in server components, server actions and route handlers, and the
 * token never reaches the browser's JavaScript.
 *
 * > [!IMPORTANT]
 * > **This is the seam the backend's login lands on.** Today the cookie
 * > holds a token this frontend signed, which the backend will refuse. Step
 * > 2 of CLAUDE.md §23 stores the backend's access token instead, and this
 * > function returns that; no service changes, because every one of them
 * > takes its credentials from here.
 */
export interface ApiAuth {
  token?: string;
  userAgent?: string;
}

export async function apiAuth(): Promise<ApiAuth> {
  const [store, incoming] = await Promise.all([cookies(), headers()]);
  return {
    token: store.get(SESSION_COOKIE)?.value,
    userAgent: incoming.get("user-agent") ?? undefined,
  };
}
