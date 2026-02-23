/**
 * VRT テストのグローバルセットアップ
 *
 * テスト実行前にスクリーンショットディレクトリをクリアし、
 * 削除されたストーリーの古いスクリーンショットが残らないようにする。
 */
import { rmSync } from "node:fs";
import { join } from "node:path";

export default function globalSetup() {
  if (process.platform === "darwin") {
    const screenshotsDir = join(import.meta.dirname, "screenshots");
    rmSync(screenshotsDir, { recursive: true, force: true });
  }

  // .reg/actual/ もクリア（削除されたストーリーの古いスクリーンショットが残らないようにする）
  const regActualDir = join(import.meta.dirname, "..", ".reg", "actual");
  rmSync(regActualDir, { recursive: true, force: true });
}
