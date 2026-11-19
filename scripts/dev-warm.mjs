// Dev route warmer.
//
// Turbopack compiles each route the first time it is asked for, so in `next
// dev` the first click to a page you have not opened this session waits on
// that compile. This boots the dev server and then asks for every route once,
// up front, so by the time you click, the page is already compiled and the
// navigation is instant.
//
//   pnpm dev:fast              boot dev + warm every route
//   pnpm dev:fast --warm-only  warm a dev server already running
//   PORT=3100 pnpm dev:fast    boot on a specific port
//
// Member, admin and studio routes sit behind a signed session cookie, so the
// warmer mints one the same way the app does (see src/lib/signing.ts). The
// dev fallback secret is used unless AUTH_SECRET is set — exactly what the
// dev server itself does, so the cookie it mints is one the server accepts.

import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { webcrypto as crypto } from "node:crypto";

const DEV_SECRET = "imena-dev-only-secret-do-not-use-in-production";
const warmOnly = process.argv.includes("--warm-only");

function authSecret() {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;
  for (const file of [".env.local", ".env", ".env.development"]) {
    try {
      const match = readFileSync(file, "utf8").match(/^AUTH_SECRET=(.*)$/m);
      if (match) return match[1].trim().replace(/^["']|["']$/g, "");
    } catch {
      /* no such file — try the next */
    }
  }
  return DEV_SECRET;
}

const b64url = (buf) =>
  Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

async function sign(payload, key) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    new TextEncoder().encode(payload),
  );
  return b64url(mac);
}

async function sessionCookie(role) {
  const key = authSecret();
  const payload = `v2.${role}.${Date.now()}`;
  return `imena_member=${payload}.${await sign(payload, key)}`;
}

// Every route, grouped by the session it needs. One concrete value stands in
// for each dynamic segment — compiling it compiles the segment for all params.
const ROUTES = {
  public: [
    "/",
    "/our-story",
    "/family-tree",
    "/login",
    "/verify",
    "/signup",
    "/admin/login",
  ],
  member: [
    "/dashboard",
    "/blogs",
    "/blogs/walking-through-gisozi",
    "/gallery",
    "/gallery/family-celebrations",
    "/resources",
    "/birthdays",
    "/profile",
    "/tree",
    "/families/wihogora",
  ],
  admin: ["/admin", "/admin/members", "/admin/members/new"],
  // The studio is reachable by an admin session too.
  studio: [
    "/studio",
    "/studio/posts",
    "/studio/posts/new",
    "/studio/albums",
    "/studio/albums/new",
  ],
};

async function warm(base) {
  const member = await sessionCookie("member");
  const admin = await sessionCookie("admin");
  const groups = [
    ["public", ROUTES.public, null],
    ["member", ROUTES.member, member],
    ["admin", ROUTES.admin, admin],
    ["studio", ROUTES.studio, admin],
  ];

  console.log(`\n⏳ warming ${base} …`);
  let slowest = 0;
  for (const [name, paths, cookie] of groups) {
    for (const path of paths) {
      const start = Date.now();
      try {
        const res = await fetch(`${base}${path}`, {
          headers: cookie ? { cookie } : {},
          redirect: "manual",
        });
        const ms = Date.now() - start;
        slowest = Math.max(slowest, ms);
        const flag =
          res.status >= 300 && res.status < 400 ? ` → ${res.status}` : "";
        console.log(
          `  ${String(ms).padStart(5)}ms  ${name.padEnd(6)} ${path}${flag}`,
        );
      } catch (error) {
        console.log(`   fail  ${name.padEnd(6)} ${path}  (${error.message})`);
      }
    }
  }
  console.log(
    `✅ warmed. Clicks are now instant (slowest compile ${slowest}ms).\n`,
  );
}

function portFromArgsOrEnv() {
  return process.env.PORT || "3000";
}

async function waitForReady(base, timeoutMs = 120000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      await fetch(base, { redirect: "manual" });
      return true;
    } catch {
      await new Promise((r) => setTimeout(r, 400));
    }
  }
  return false;
}

if (warmOnly) {
  const base = `http://localhost:${portFromArgsOrEnv()}`;
  if (!(await waitForReady(base, 10000))) {
    console.error(`No dev server answering at ${base}. Start one first.`);
    process.exit(1);
  }
  await warm(base);
  process.exit(0);
}

// Boot the dev server, then warm it once it answers.
const child = spawn("pnpm", ["dev"], {
  stdio: ["inherit", "pipe", "inherit"],
  env: process.env,
});

let port = portFromArgsOrEnv();
let warmed = false;

child.stdout.on("data", (chunk) => {
  const text = chunk.toString();
  process.stdout.write(text);
  const match = text.match(/localhost:(\d+)/);
  if (match) port = match[1];
  if (!warmed && /Ready in|✓ Ready|started server/i.test(text)) {
    warmed = true;
    const base = `http://localhost:${port}`;
    waitForReady(base).then((up) => {
      if (up) warm(base);
    });
  }
});

const stop = () => child.kill("SIGINT");
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
child.on("exit", (code) => process.exit(code ?? 0));
