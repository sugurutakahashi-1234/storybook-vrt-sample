/**
 * VRT テストのグローバルセットアップ
 *
 * テスト実行前にスクリーンショットディレクトリをクリアし、
 * 削除されたストーリーの古いスクリーンショットが残らないようにする。
 */
import { rmSync } from "node:fs";
import { join } from "node:path";

export default function globalSetup() {
  const screenshotsDir = join(import.meta.dirname, "screenshots");
  rmSync(screenshotsDir, { recursive: true, force: true });
}
