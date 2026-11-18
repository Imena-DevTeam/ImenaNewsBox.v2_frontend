import { expect, test } from "@playwright/test";

/* Fixture mode: the two sample links in features/invitations/fixture.ts. */
test.describe("invitation links", () => {
  test("a member's link shows the name, then fills it in at the login", async ({
    page,
  }) => {
    await page.goto("/invitation#token=member-demo");
    await expect(page.getByText("Aganze", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Go to login" }).click();
    await expect(page).toHaveURL(/\/login\?name=Aganze$/);
    await expect(page.getByLabel("Name")).toHaveValue("Aganze");
  });

  test("an administrator's link asks for a password", async ({ page }) => {
    await page.goto("/invitation#token=admin-demo");
    await page.getByLabel("Password", { exact: true }).fill("correct-horse");
    await page.getByLabel("Confirm password").fill("correct-horse");
    await page.getByRole("button", { name: "Set password" }).click();

    await page.getByRole("link", { name: "Go to admin login" }).click();
    await expect(page).toHaveURL(/\/admin\/login\?name=Shema$/);
    await expect(page.getByLabel("Name")).toHaveValue("Shema");
  });

  test("a link the server refuses says so", async ({ page }) => {
    await page.goto("/invitation#token=guessed");
    await expect(page.getByText("This link no longer works.")).toBeVisible();
  });

  test("a link with no token says it is incomplete", async ({ page }) => {
    await page.goto("/invitation");
    await expect(page.getByText("This link is incomplete.")).toBeVisible();
  });

  test("none of them signs anybody in", async ({ page }) => {
    await page.goto("/invitation#token=admin-demo");
    await page.getByLabel("Password", { exact: true }).fill("correct-horse");
    await page.getByLabel("Confirm password").fill("correct-horse");
    await page.getByRole("button", { name: "Set password" }).click();
    await expect(page.getByText("Your password is set.")).toBeVisible();

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("the forgot-password page is open to a signed-out visitor", async ({
    page,
  }) => {
    await page.goto("/admin/forgot-password");
    await expect(page).toHaveURL(/\/admin\/forgot-password$/);
  });
});
