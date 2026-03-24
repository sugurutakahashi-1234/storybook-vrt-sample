/**
 * ホームページの E2E テスト
 *
 * Next.js アプリのホームページに対して、コンテンツの表示確認とページレベルの a11y チェックを行う。
 * VRT（スクリーンショット比較）は Storybook VRT でカバーしているため、ここでは行わない。
 *
 * a11y の責務分担:
 * - Storybook a11y: コンポーネントレベル（コントラスト、aria-label 等）
 * - E2E a11y（ここ）: ページレベル（ランドマーク構造、見出し階層、テーマ別コントラスト等）
 */
import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Home Page", () => {
  /** ページが正しく表示され、メインの見出しが存在することを確認 */
  test("ホームページが正しく表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Storybook VRT Sample"
    );
  });

  /** Button / Card / Badge / TextField の全セクション見出しが表示されていることを確認 */
  test("全セクションが表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Button" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Card" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Badge" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "TextField" })
    ).toBeVisible();
  });

  /** UI パッケージの Button コンポーネントが正しくレンダリングされていることを確認 */
  test("ボタンコンポーネントが表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Primary" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Secondary" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Danger" })).toBeVisible();
  });

  /** ページ全体の a11y チェック — Light テーマ */
  test("アクセシビリティ違反がない（Light）", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  /** ページ全体の a11y チェック — Dark テーマ */
  test("アクセシビリティ違反がない（Dark）", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
