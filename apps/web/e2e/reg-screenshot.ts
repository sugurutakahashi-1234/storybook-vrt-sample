/**
 * reg-cli 用スクリーンショットユーティリティ
 *
 * Playwright の toHaveScreenshot() によるスナップショット比較と、
 * reg-cli 用の .reg/actual/ へのスクリーンショット保存を一括で行う。
 * テストファイル名・スクリーンショット名は test.info() から自動生成する。
 */
import { mkdirSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

const counters = new Map<string, number>();

export async function expectScreenshot(
  target: Page | Locator,
  options?: { fullPage?: boolean }
) {
  const info = test.info();
  const count = (counters.get(info.testId) ?? 0) + 1;
  counters.set(info.testId, count);

  // テストタイトルからスクリーンショット名を自動生成
  const name = `${info.titlePath
    .slice(1)
    .join("-")
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")}-${count}.png`;

  await expect(target).toHaveScreenshot(name, options);

  const testFile = basename(info.file);
  const regPath = join(".reg", "actual", testFile, name);
  mkdirSync(dirname(regPath), { recursive: true });
  await target.screenshot({ path: regPath, ...options });
}
