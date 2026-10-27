"use server";

import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session";

/**
 * Only async functions may be exported from a "use server" module, so the
 * cookie's name and lifetime live in @/lib/session.
 */
export async function startMemberSession(): Promise<void> {
  const store = await cookies();

  store.set(SESSION_COOKIE, "verified", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function endMemberSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
