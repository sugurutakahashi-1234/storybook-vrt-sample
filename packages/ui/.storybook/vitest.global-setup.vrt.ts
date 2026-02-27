/**
 * VRT テストのグローバルセットアップ／ティアダウン（Node.js コンテキストで実行）
 *
 * setup: テスト実行前にベースラインディレクトリをクリアし、
 *        削除されたストーリーの古いスクリーンショットが残らないようにする。
 * teardown: storybook-addon-vis が生成したスナップショットを
 *           reg-cli 用の .reg/actual/ と git 管理用の vrt/screenshots/ にコピーする。
 */
import { cpSync, existsSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const setup = () => {
  const visRoot = join(import.meta.dirname, "..", "__vis__");
  const platform = process.env.CI ? process.platform : "local";
  const baselinesDir = join(visRoot, platform, "__baselines__");

  rmSync(baselinesDir, { recursive: true, force: true });
};

// vitest globalSetup は default export を要求するが、`export default const` は構文エラーのため分離
export default setup;

// vitest には globalTeardown 設定がないため、globalSetup から teardown を named export する
export const teardown = () => {
  const projectRoot = join(import.meta.dirname, "..");
  const visRoot = join(projectRoot, "__vis__");

  // __vis__/ 配下のプラットフォームディレクトリを検索（local, linux, darwin, win32）
  const platformDirs = existsSync(visRoot)
    ? readdirSync(visRoot).filter((d) =>
        existsSync(join(visRoot, d, "__baselines__"))
      )
    : [];

  if (platformDirs.length === 0) {
    console.error("Warning: No __vis__/*/__baselines__/ directory found.");
    return;
  }

  const baselinesDir = join(visRoot, platformDirs[0], "__baselines__");
  const regActualDir = join(projectRoot, ".reg", "actual");
  const screenshotsDir = join(projectRoot, "vrt", "screenshots");

  // コピー先をクリーンアップ（削除済みストーリーの残存防止）
  rmSync(regActualDir, { recursive: true, force: true });
  cpSync(baselinesDir, regActualDir, { recursive: true });
  console.log(`Copied: ${baselinesDir} -> ${regActualDir}`);

  // macOS のみ: git 管理用の vrt/screenshots/ にもコピー
  if (process.platform === "darwin") {
    rmSync(screenshotsDir, { recursive: true, force: true });
    cpSync(baselinesDir, screenshotsDir, { recursive: true });
    console.log(`Copied: ${baselinesDir} -> ${screenshotsDir}`);
  }
};
