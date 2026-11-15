import { expect, test, type Page } from "@playwright/test";
import { adminLogin } from "./helpers";

/** §9: no page scrolls sideways at the four widths the project is judged at. */
const WIDTHS = [360, 390, 768, 1440];
const PUBLIC = ["/", "/our-story", "/family-tree", "/login", "/admin/login"];

async function overflow(page: Page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
}

for (const width of WIDTHS) {
  test(`public pages hold at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of PUBLIC) {
      await page.goto(path);
      expect(await overflow(page), path).toBeLessThanOrEqual(0);
    }
  });

  test(`the register holds at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await adminLogin(page, "Aganze", "aganze-dev-admin");
    for (const path of ["/dashboard", "/admin", "/admin/members"]) {
      await page.goto(path);
      expect(await overflow(page), path).toBeLessThanOrEqual(0);
    }
  });
}
