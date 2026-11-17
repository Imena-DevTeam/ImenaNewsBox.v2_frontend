/**
 * Copies the backend's OpenAPI schema into `src/types/openapi.json`.
 *
 * The schema is committed, so a build, a test run or CI never needs the
 * backend. Run `pnpm api:types` again whenever the backend's contract
 * changes: it refreshes the schema and regenerates `src/types/api.gen.ts`.
 *
 * The backend only serves its schema outside production, so point this at a
 * local one: `uv run fastapi dev src/app/main.py` in ../backend-v2.
 */
import { writeFile } from "node:fs/promises";

const base = (process.env.API_SCHEMA_URL ?? "http://127.0.0.1:8000").replace(
  /\/+$/,
  "",
);
const url = `${base}/openapi.json`;

const response = await fetch(url).catch((cause) => {
  throw new Error(`Could not reach ${url}. Is the backend running?`, {
    cause,
  });
});
if (!response.ok) {
  throw new Error(`${url} answered ${response.status}.`);
}

const schema = await response.json();
await writeFile(
  new URL("../src/types/openapi.json", import.meta.url),
  `${JSON.stringify(schema, null, 2)}\n`,
);
console.log(`Saved the schema from ${url}.`);
