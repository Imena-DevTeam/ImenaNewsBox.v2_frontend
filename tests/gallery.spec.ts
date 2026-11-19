import { expect, test, type Page } from "@playwright/test";
import { memberLogin } from "./helpers";

/* The photo viewer's touch gestures, in a real browser at phone size. The
   gestures are pointer events of type "touch", which is what a finger
   produces; they are sent to the photograph's frame directly. */
test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

async function gesture(page: Page, dx: number, dy: number) {
  await page.evaluate(
    ([dx, dy]) => {
      const frame = document.querySelector("dialog[open] img")!
        .parentElement as HTMLElement;
      const at = (type: string, x: number, y: number) =>
        frame.dispatchEvent(
          new PointerEvent(type, {
            pointerId: 7,
            pointerType: "touch",
            clientX: x,
            clientY: y,
            bubbles: true,
          }),
        );
      at("pointerdown", 200, 300);
      at("pointermove", 200 + dx / 2, 300 + dy / 2);
      at("pointermove", 200 + dx, 300 + dy);
      at("pointerup", 200 + dx, 300 + dy);
    },
    [dx, dy],
  );
}

test("swipe between photographs, then swipe down to close", async ({
  page,
}) => {
  await memberLogin(page, "Aganze");
  await page.goto("/gallery/family-celebrations");
  await page.getByRole("button", { name: /^Open photograph 1:/ }).click();

  const dialog = page.locator("dialog[open]");
  await expect(dialog).toHaveAttribute("aria-label", /photograph 1 of 6/);

  await gesture(page, -150, 5);
  await expect(dialog).toHaveAttribute("aria-label", /photograph 2 of 6/);

  await gesture(page, 150, 5);
  await expect(dialog).toHaveAttribute("aria-label", /photograph 1 of 6/);

  await gesture(page, 5, 220);
  await expect(page.locator("dialog[open]")).toHaveCount(0);
});

test("the document viewer shows the file itself", async ({ page }) => {
  await memberLogin(page, "Aganze");
  await page.goto("/resources");
  await page.getByText("View PDF").first().click();

  const frame = page.locator("dialog[open] iframe");
  await expect(frame).toHaveAttribute("src", /\.pdf$/);
  const response = await page.request.get(
    (await frame.getAttribute("src")) ?? "",
  );
  expect(response.headers()["content-type"]).toContain("application/pdf");
});
