/**
 * スクリーンショットユーティリティ
 *
 * スクリーンショットを2箇所に保存する:
 * - e2e/screenshots/ : git 管理用（変更履歴を追跡）
 * - .reg/actual/     : reg-cli 比較用（CI でベースラインとの差分検出）
 *
 * テストファイル名・スクリーンショット名は test.info() から自動生成する。
 * テーマ（light / dark）は Playwright プロジェクト名から自動取得する。
 */
import { mkdirSync } from "node:fs";
import { basename, dirname, join } from "node:path";

import type { Locator, Page } from "@playwright/test";
import { test } from "@playwright/test";

export const takeScreenshot = async (
  target: Page | Locator,
  options?: { fullPage?: boolean }
) => {
  const info = test.info();
  const theme = info.project.name;

  const name = `${info.titlePath
    .slice(1)
    .join("-")
    .replaceAll(/\s+/g, "-")
    .replaceAll(/-{2,}/g, "-")}-${theme}.png`;

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
};
