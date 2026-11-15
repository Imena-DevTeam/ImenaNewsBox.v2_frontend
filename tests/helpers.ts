import { expect, type Page } from "@playwright/test";

/** Any five digits pass the stand-in check; the role was decided a step earlier. */
export async function enterCode(page: Page) {
  /* Submitting runs a server action, compiled on first use in dev. */
  await expect(page).toHaveURL(/\/verify/, { timeout: 60_000 });
  await page.getByLabel("Digit 1").click();
  await page.keyboard.type("12345");
  /* The first visit compiles the destination in dev, which can take a while. */
  await page.waitForURL((url) => !url.pathname.startsWith("/verify"), {
    timeout: 90_000,
  });
}

export async function memberLogin(page: Page, name: string) {
  await page.goto("/login");
  await page.getByLabel("Name").fill(name);
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await enterCode(page);
}

export async function adminLogin(page: Page, name: string, password: string) {
  await page.goto("/admin/login");
  await page.getByLabel("Name").fill(name);
  await page.getByPlaceholder("Enter password").fill(password);
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await enterCode(page);
}
