/**
 * E2E テストのグローバルセットアップ
 *
 * テスト実行前にスクリーンショットディレクトリをクリアし、
 * 削除されたテストケースの古いスクリーンショットが残らないようにする。
 */
import { rmSync } from "node:fs";
import { join } from "node:path";

export default function globalSetup() {
  if (process.platform === "darwin") {
    const screenshotsDir = join(import.meta.dirname, "screenshots");
    rmSync(screenshotsDir, { recursive: true, force: true });
  }
}
