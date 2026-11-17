/**
 * Which sign-in this server offers.
 *
 * - **backend**: `API_URL` is set. The backend checks the family name, the
 *   administrator's password and the emailed code, and issues the tokens
 *   the Next server keeps (CLAUDE.md §23).
 * - **fixture**: `API_URL` is unset, and this is not a production build.
 *   The old stand-in: any five digits, and the sample register decides the
 *   role. It exists so the app can be worked on, and the Playwright suite
 *   run, without a backend.
 * - **off**: a production build with no `API_URL`. Nobody can sign in,
 *   which is the right way round.
 *
 * > [!CAUTION]
 * > The fixture mode is a door that opens for anybody who types five
 * > digits. It must never be reachable where real people sign in, so both
 * > conditions are checked, every time, and `auth-mode.test.ts` holds that
 * > a production build and a configured backend each close it on their own.
 */
export type AuthMode = "backend" | "fixture" | "off";

export function authMode(): AuthMode {
  if (process.env.API_URL) return "backend";
  if (process.env.NODE_ENV === "production") return "off";
  return "fixture";
}
