/**
 * ナビゲーション・レスポンシブ表示の E2E テスト
 *
 * ページタイトルの確認と、各デバイスサイズでのレスポンシブ表示を
 * スクリーンショット比較で検証する。
 */
import { expect, test } from "@playwright/test";
import { expectScreenshot } from "./reg-screenshot";

test.describe("Navigation", () => {
  /** <title> タグが正しく設定されていることを確認 */
  test("ページタイトルが正しい", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Loki Sample/);
  });

  /** モバイル（iPhone X: 375x812）でのレスポンシブ表示を検証 */
  test("レスポンシブ表示 - モバイル", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // reg-cli 用のスクリーンショットも同時に .reg/actual/ へ保存
    await expectScreenshot(page, { fullPage: true });
  });

  /** タブレット（iPad: 768x1024）でのレスポンシブ表示を検証 */
  test("レスポンシブ表示 - タブレット", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // reg-cli 用のスクリーンショットも同時に .reg/actual/ へ保存
    await expectScreenshot(page, { fullPage: true });
  });
});
