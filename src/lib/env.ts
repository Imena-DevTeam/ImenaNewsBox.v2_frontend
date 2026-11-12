import { z } from "zod";

/**
 * The environment, read once and checked.
 *
 * Every `process.env` read in this project used to be inline, which means a
 * missing or mistyped variable surfaced as whatever the code did next — a
 * failed request, a session that could not be signed, a base URL of
 * `undefined/members`. This parses them in one place so the failure says
 * what is wrong and where.
 *
 * Two rules it follows deliberately:
 *
 * - **Nothing here throws at import time.** Next evaluates modules during
 *   the build, and a build machine legitimately has no secrets. What is
 *   missing is reported when something tries to use it, by the helper that
 *   needs it, with a sentence naming the variable.
 * - **Server values are never read from a client module.** `serverEnv` is
 *   only ever called on the server; `publicEnv` holds the `NEXT_PUBLIC_`
 *   values, which are compiled into the browser bundle by design.
 */

/* Next replaces `process.env.NEXT_PUBLIC_*` at build time only where it is
   written out in full, so this cannot be a loop over a list of names. */
const publicSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .string()
    .url(
      "NEXT_PUBLIC_API_URL must be a full URL, such as https://api.example/v1",
    )
    .optional(),
});

const serverSchema = z.object({
  AUTH_SECRET: z.string().min(1).optional(),
  ADMIN_PASSWORD: z.string().min(1).optional(),
  API_URL: z.string().url().optional(),
  API_TIMEOUT_MS: z.coerce.number().int().positive().optional(),
});

export type PublicEnv = z.infer<typeof publicSchema>;
export type ServerEnv = z.infer<typeof serverSchema>;

/* A function, not a constant. Parsed at module load it would freeze
   whatever the environment held at import time, which is wrong in a test
   that sets it afterwards and wrong in any runtime that fills the
   environment after the bundle is evaluated. Next still inlines
   `process.env.NEXT_PUBLIC_*` here, because it is written out in full. */
export function publicEnv(): PublicEnv {
  return publicSchema.parse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || undefined,
  });
}

export function serverEnv(): ServerEnv {
  return serverSchema.parse({
    AUTH_SECRET: process.env.AUTH_SECRET || undefined,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || undefined,
    API_URL: process.env.API_URL || undefined,
    API_TIMEOUT_MS: process.env.API_TIMEOUT_MS || undefined,
  });
}

/** How long a single request may take before it is given up on. */
export const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * Where the backend is.
 *
 * `API_URL` wins over `NEXT_PUBLIC_API_URL` when both are set, so a
 * deployment can send server-side traffic to an internal address while the
 * browser keeps using the public one. Trailing slashes are trimmed, because
 * every caller writes its path with a leading one.
 */
export function apiBaseUrl(): string {
  const configured =
    (typeof window === "undefined" ? process.env.API_URL : undefined) ||
    publicEnv().NEXT_PUBLIC_API_URL;

  if (!configured) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set, so there is no backend to call. Copy .env.example to .env.local and fill it in.",
    );
  }

  return configured.replace(/\/+$/, "");
}

/** Whether the backend is configured at all — for code that can fall back. */
export function hasApi(): boolean {
  return Boolean(process.env.API_URL || publicEnv().NEXT_PUBLIC_API_URL);
}
