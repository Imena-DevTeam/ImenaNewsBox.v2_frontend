import { expect, test } from "@playwright/test";
import { adminLogin, memberLogin } from "./helpers";

test.describe("the member door", () => {
  test("a name and a code reach the dashboard", async ({ page }) => {
    await memberLogin(page, "Aganze");
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(
      page.getByRole("heading", { name: "Family birthdays" }),
    ).toBeVisible();
  });

  test("a member who reaches for /admin lands on the dashboard", async ({
    page,
  }) => {
    await memberLogin(page, "Aganze");
    await expect(page).toHaveURL(/\/dashboard/);
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("the blogger is given the studio by name", async ({ page }) => {
    await memberLogin(page, "Ngabe");
    await expect(page).toHaveURL(/\/dashboard/);
    await page.goto("/studio");
    await expect(page).toHaveURL(/\/studio/);
  });
});

test.describe("the administrators' door", () => {
  test("a signed-out visitor is sent to the admin login", async ({ page }) => {
    await page.goto("/admin/members");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("a wrong password is refused", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("Name").fill("Aganze");
    await page.getByPlaceholder("Enter password").fill("not-the-password");
    await page.getByRole("button", { name: "Log in", exact: true }).click();
    await expect(page.getByText(/that name and password/i)).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("the forged role in the URL grants nothing", async ({ page }) => {
    await page.goto("/verify?role=admin");
    await page.getByLabel("Digit 1").click();
    await page.keyboard.type("12345");
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("an administrator reaches the register", async ({ page }) => {
    await adminLogin(page, "Aganze", "aganze-dev-admin");
    await page.goto("/admin/members");
    await expect(page).toHaveURL(/\/admin\/members$/);
    await expect(page.getByRole("table")).toBeVisible();
  });
});
