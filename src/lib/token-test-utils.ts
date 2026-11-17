/**
 * For tests: rewrite the data inside a signed token while keeping its
 * signature, which is what somebody editing their own cookie would do.
 */
export function editTokenData(
  token: string,
  edit: (data: Record<string, unknown>) => Record<string, unknown>,
): string {
  const [version, encoded, signature] = token.split(".");
  const base64 = encoded!.replace(/-/g, "+").replace(/_/g, "/");
  const json = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
  const data = edit(JSON.parse(json) as Record<string, unknown>);
  const reencoded = btoa(JSON.stringify(data))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return `${version}.${reencoded}.${signature}`;
}
