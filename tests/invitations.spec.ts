import { expect, test } from "@playwright/test";

test.describe("invitation links", () => {
  test("a member's link shows the name to sign in with", async ({ page }) => {
    await page.goto("/invite/member-demo");
    await expect(page.getByRole("link", { name: "Go to login" })).toBeVisible();
  });

  test("an administrator's link goes on to set a password", async ({
    page,
  }) => {
    await page.goto("/invite/admin-demo");
    await expect(page).toHaveURL(/\/invite\/admin-demo\/signup/);
    await expect(page.getByLabel(/password/i).first()).toBeVisible();
  });

  for (const token of ["expired-demo", "used-demo"]) {
    test(`a ${token.split("-")[0]} link is refused`, async ({ page }) => {
      await page.goto(`/invite/${token}`);
      await expect(
        page.getByRole("heading", { name: "About this invitation" }),
      ).toBeVisible();
    });
  }

  test("none of them signs anybody in", async ({ page }) => {
    await page.goto("/invite/admin-demo/signup");
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
