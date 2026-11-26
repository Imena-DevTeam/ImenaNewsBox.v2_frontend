import { expect, test } from "@playwright/test";
import { memberLogin } from "./helpers";

/* Fixture mode: the sample account. Nothing is stored, and the page says so. */
test.describe("the profile", () => {
  test("shows the account and this device, and edits the details", async ({
    page,
  }) => {
    test.setTimeout(180_000);
    await memberLogin(page, "Aganze");
    await page.goto("/profile");

    await expect(
      page.getByRole("heading", { level: 1, name: /Aganze/ }),
    ).toBeVisible({ timeout: 60_000 });
    await expect(page.getByText("What you log in with")).toBeVisible();
    await expect(page.getByText(/^This device/)).toBeVisible();

    await page.getByRole("button", { name: "Edit your details" }).click();
    await page.getByLabel("About you").fill("I keep the family photographs.");
    await page.getByRole("button", { name: "Save changes" }).click();

    await expect(page.getByText(/nothing was stored/)).toBeVisible();
    await expect(
      page.getByText("I keep the family photographs."),
    ).toBeVisible();
  });
});
