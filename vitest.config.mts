import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      /* Images are statically imported through tsconfig's @public alias; the
         test environment needs it too or any component touching them fails
         to resolve. */
      "@public": path.resolve(import.meta.dirname, "./public"),
    },
  },
});
