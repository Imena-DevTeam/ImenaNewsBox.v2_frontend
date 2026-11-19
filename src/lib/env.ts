import * as z from "zod";

/**
 * The backend's whereabouts, read once and checked.
 *
 * **Server-only, all of it.** The browser never calls the backend: the Next
 * server does, holding the tokens on the browser's behalf (CLAUDE.md §23).
 * So there is no `NEXT_PUBLIC_` value here, and nothing about the backend
 * is compiled into a bundle.
 *
 * Two rules it follows deliberately:
 *
 * - **Nothing here throws at import time.** Next evaluates modules during
 *   the build, and a build machine legitimately has no backend. What is
 *   missing is reported when something tries to use it, with a sentence
 *   naming the variable.
 * - **It is a function, not a constant.** Parsed at module load it would
 *   freeze whatever the environment held at import time, which is wrong in a
 *   test that sets it afterwards.
 */
const serverSchema = z.object({
  API_URL: z
    .string()
    .url("API_URL must be a full URL, such as http://127.0.0.1:8000/api/v1")
    .optional(),
  API_TIMEOUT_MS: z.coerce.number().int().positive().optional(),
  FRONTEND_ORIGIN: z
    .string()
    .url("FRONTEND_ORIGIN must be a full origin, such as http://localhost:3000")
    .optional(),
});

export type ServerEnv = z.infer<typeof serverSchema>;

export function serverEnv(): ServerEnv {
  return serverSchema.parse({
    API_URL: process.env.API_URL || undefined,
    API_TIMEOUT_MS: process.env.API_TIMEOUT_MS || undefined,
    FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || undefined,
  });
}

/** How long a single request may take before it is given up on. */
export const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * How long to wait for a request that makes the backend send an email: a
 * login code, an invitation, a password link.
 *
 * The backend sends during the request and gives each email up to 25
 * seconds (its decision 43), and an administrator's login can first wait up
 * to 5 seconds for a password check. Giving up before the backend does
 * would tell somebody their code failed while it is still on its way, and
 * the minute before another can be asked for would then turn them away.
 * Over a slow link to Gmail a send was measured at well over 10 seconds.
 */
export const EMAIL_TIMEOUT_MS = 40_000;

/**
 * Where the backend is, with its `/api/v1` prefix and no trailing slash, so
 * every path can be written with a leading one.
 */
export function apiBaseUrl(): string {
  const configured = serverEnv().API_URL;
  if (!configured) {
    throw new Error(
      "API_URL is not set, so there is no backend to call. Copy .env.example to .env.local and fill it in.",
    );
  }
  return configured.replace(/\/+$/, "");
}

/**
 * The frontend's own origin, sent as `Origin` on every call.
 *
 * The backend checks it on refresh and logout against its `CORS_ORIGINS`: a
 * request from the Next server carries no browser `Origin`, so it names the
 * site it acts for. Unset, the call goes without one, and refresh and logout
 * are refused with `origin_not_allowed`, which is the right way round.
 */
export function frontendOrigin(): string | undefined {
  return serverEnv().FRONTEND_ORIGIN?.replace(/\/+$/, "");
}

/**
 * Whether a backend is configured at all, for code that can fall back to
 * its fixtures. Always false in the browser, where `API_URL` does not exist.
 */
export function hasApi(): boolean {
  return Boolean(process.env.API_URL);
}
