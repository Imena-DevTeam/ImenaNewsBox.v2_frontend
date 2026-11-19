import { describe, expect, it } from "vitest";
import schema from "@/types/openapi.json";
import { ENDPOINTS } from "./endpoints";

/**
 * Every endpoint this frontend calls exists in the backend's contract.
 *
 * `src/types/openapi.json` is the backend's own schema, copied by
 * `pnpm api:types`. If the backend renames or drops a path, refreshing the
 * schema makes this fail, which is better than a page finding out.
 */
const PREFIX = "/api/v1";

/** `/api/v1/users/{user_id}` → a pattern any single segment fills. */
const patterns = Object.keys(schema.paths)
  .filter((path) => path.startsWith(PREFIX))
  .map((path) => ({
    path,
    pattern: new RegExp(
      `^${path.slice(PREFIX.length).replace(/\{[^}]+\}/g, "[^/]+")}$`,
    ),
  }));

/** Every path in ENDPOINTS, with each `(id) => …` filled in. */
function walk(node: unknown, name: string): Array<[string, string]> {
  if (typeof node === "string") return [[name, node]];
  if (typeof node === "function") {
    const filled = (node as (...ids: string[]) => string)("a-1", "b-2");
    return [[name, filled]];
  }
  return Object.entries(node as Record<string, unknown>).flatMap(
    ([key, value]) => walk(value, name ? `${name}.${key}` : key),
  );
}

const endpoints = walk(ENDPOINTS, "");

describe("ENDPOINTS", () => {
  it.each(endpoints)("%s is a path the backend serves", (_name, path) => {
    const match = patterns.find(({ pattern }) => pattern.test(path));
    expect(match, `${path} is not in openapi.json`).toBeDefined();
  });

  /* An id with a slash in it must not reach a different route. */
  it("encodes the ids it puts in a path", () => {
    expect(ENDPOINTS.users.one("a/b")).toBe("/users/a%2Fb");
    expect(ENDPOINTS.posts.bySlug("visit to ikuzwe")).toBe(
      "/posts/visit%20to%20ikuzwe",
    );
  });

  it("covers the whole contract the frontend needs", () => {
    expect(endpoints.length).toBeGreaterThanOrEqual(35);
  });
});
