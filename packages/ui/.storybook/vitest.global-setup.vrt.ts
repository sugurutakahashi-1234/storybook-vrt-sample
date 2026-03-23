/**
 * VRT テストのグローバルセットアップ／ティアダウン（Node.js コンテキストで実行）
 *
 * setup: テスト実行前にベースラインディレクトリをクリアし、
 *        削除されたストーリーの古いスクリーンショットが残らないようにする。
 * teardown (return): storybook-addon-vis が生成したスナップショットを
 *                    reg-cli 用の .reg/actual/ と git 管理用の vrt/screenshots/ にコピーする。
 *
 * vitest globalSetup の teardown は default export した関数の戻り値として定義する。
 * named export の teardown は vitest に認識されないため注意。
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";

/**
 * カテゴリディレクトリからソート用プレフィックスを返す。
 * preview.tsx の storySort.order と対応: Pages → 1, Components → 2, Foundations → 3
 * Introduction は MDX のみでスナップショット対象外のため含まない。
 * カテゴリを変更する場合は preview.tsx の storySort.order も合わせて更新すること。
 */
const categoryPrefix: Record<string, string> = {
  pages: "1",
  components: "2",
  foundations: "3",
};

/**
 * スナップショットをフラット化してコピーする。
 * 入力: components/Badge/Badge.stories.tsx/error-dark.png
 * → カテゴリ "components" → プレフィックス "2"
 * → 親ディレクトリ "Badge.stories.tsx" から .stories.tsx を除去 → "Badge"
 * → 出力: destDir/2-Badge/error-dark.png
 */
const copyFlattened = (srcDir: string, destDir: string) => {
  const walkFiles = (dir: string): string[] => {
    const entries = readdirSync(dir, { withFileTypes: true });
    return entries.flatMap((e) =>
      e.isDirectory() ? walkFiles(join(dir, e.name)) : [join(dir, e.name)]
    );
  };

  for (const srcPath of walkFiles(srcDir)) {
    const rel = relative(srcDir, srcPath);
    const fileName = basename(rel);
    const parentDir = basename(dirname(rel));
    // "Badge.stories.tsx" → "Badge"
    const name = parentDir.replace(/\.stories\.tsx?$/, "");
    // "components/Badge/..." → "components"
    const [category] = rel.split("/");
    const prefix = categoryPrefix[category] ?? "9";
    const destPath = join(destDir, `${prefix}-${name}`, fileName);

    mkdirSync(dirname(destPath), { recursive: true });
    cpSync(srcPath, destPath);
  }
};

// vitest globalSetup は default export した関数を setup として実行し、
// その戻り値の関数を teardown として実行する
const setup = () => {
  const visRoot = join(import.meta.dirname, "..", "__vis__");
  const platform = process.env.CI ? process.platform : "local";
  const baselinesDir = join(visRoot, platform, "__baselines__");

  rmSync(baselinesDir, { recursive: true, force: true });

  // teardown: テスト完了後にスナップショットをコピー
  return () => {
    const projectRoot = join(import.meta.dirname, "..");

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

    const snapshotDir = join(visRoot, platformDirs[0], "__baselines__");
    const regActualDir = join(projectRoot, ".reg", "actual");
    const screenshotsDir = join(projectRoot, "vrt", "screenshots");

    // コピー先をクリーンアップ（削除済みストーリーの残存防止）
    rmSync(regActualDir, { recursive: true, force: true });
    copyFlattened(snapshotDir, regActualDir);
    console.log(`Copied (flattened): ${snapshotDir} -> ${regActualDir}`);

    // macOS のみ: git 管理用の vrt/screenshots/ にもコピー
    if (process.platform === "darwin") {
      rmSync(screenshotsDir, { recursive: true, force: true });
      copyFlattened(snapshotDir, screenshotsDir);
      console.log(`Copied (flattened): ${snapshotDir} -> ${screenshotsDir}`);
    }
  };
};

export default setup;
