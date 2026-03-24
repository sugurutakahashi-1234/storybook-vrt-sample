/**
 * ナビゲーション・レスポンシブ表示の E2E テスト
 *
 * ページタイトルの確認と、各デバイスサイズでのレスポンシブ表示を検証する。
 * VRT（スクリーンショット比較）は Storybook VRT でカバーしているため、ここでは行わない。
 */
import { expect, test } from "@playwright/test";

test.describe("Navigation", () => {
  /** <title> タグが正しく設定されていることを確認 */
  test("ページタイトルが正しい", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Storybook VRT Sample/);
  });

  /** モバイル（iPhone X: 375x812）でのレスポンシブ表示を検証 */
  test("レスポンシブ表示 - モバイル", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  /** タブレット（iPad: 768x1024）でのレスポンシブ表示を検証 */
  test("レスポンシブ表示 - タブレット", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
