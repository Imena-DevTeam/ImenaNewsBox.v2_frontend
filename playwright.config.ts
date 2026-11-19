import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  /* A first visit compiles the page in dev; signing in then visits two. */
  timeout: 120_000,
  fullyParallel: true,
  /* One browser at a time. Every test shares one dev server, which compiles
     each page on its first visit; several browsers asking at once made it
     compile everything together and pages ran past the two-minute timeout
     (13 of 23 failed, 17 Nov 2026). One worker: 23 of 23 in 7.4 minutes. */
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3100",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  /* Its own port, so a dev server already running with a real API behind it
     is never reused; and no API, so the stand-ins answer and every flow can
     be walked without a backend. */
  webServer: {
    command: "pnpm dev --port 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: { API_URL: "", FRONTEND_ORIGIN: "http://localhost:3100" },
  },
});
