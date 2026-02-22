/**
 * ホームページの E2E テスト
 *
 * Next.js アプリのホームページに対して、
 * コンテンツの表示確認とスクリーンショット比較を行う。
 */
import { expect, test } from "@playwright/test";
import { takeScreenshot } from "./reg-screenshot";

test.describe("Home Page", () => {
  /** ページが正しく表示され、メインの見出しが存在することを確認 */
  test("ホームページが正しく表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Playwright VRT + Storybook Demo"
    );
  });

  /** ページ全体のスクリーンショットをリファレンス画像と比較 */
  test("ホームページのスクリーンショット", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // reg-cli 用のスクリーンショットを .reg/actual/ へ保存
    await takeScreenshot(page, { fullPage: true });
  });

  /** Button / Card / Badge の全セクション見出しが表示されていることを確認 */
  test("全セクションが表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Button" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Card" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Badge" })).toBeVisible();
  });

  /** UI パッケージの Button コンポーネントが正しくレンダリングされていることを確認 */
  test("ボタンコンポーネントが表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Primary" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Secondary" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Danger" })).toBeVisible();
  });
});
