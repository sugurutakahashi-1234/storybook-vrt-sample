/**
 * スクリーンショットユーティリティ
 *
 * スクリーンショットを2箇所に保存する:
 * - e2e/screenshots/ : git 管理用（変更履歴を追跡）
 * - .reg/actual/     : reg-cli 比較用（CI でベースラインとの差分検出）
 *
 * テストファイル名・スクリーンショット名は test.info() から自動生成する。
 */
import { mkdirSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import type { Locator, Page } from "@playwright/test";
import { test } from "@playwright/test";

const counters = new Map<string, number>();

export async function takeScreenshot(
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

  const testFile = basename(info.file);

  // git 管理用: e2e/screenshots/ に保存（Mac のみ・変更履歴を追跡）
  if (process.platform === "darwin") {
    const screenshotPath = join("e2e", "screenshots", testFile, name);
    mkdirSync(dirname(screenshotPath), { recursive: true });
    await target.screenshot({ path: screenshotPath, ...options });
  }

  // reg-cli 用: .reg/actual/ に保存（常に実行・CI での差分比較に使用）
  const regPath = join(".reg", "actual", testFile, name);
  mkdirSync(dirname(regPath), { recursive: true });
  await target.screenshot({ path: regPath, ...options });
}
