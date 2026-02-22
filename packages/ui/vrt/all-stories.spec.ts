/**
 * 全ストーリー自動 VRT（ビジュアルリグレッションテスト）
 *
 * Storybook ビルド時に生成される index.json からストーリー一覧を読み取り、
 * 全ストーリーに対して動的にテストケースを生成する。
 * これにより、新しいストーリーを追加しても VRT テストファイルの変更は不要。
 *
 * なぜ Playwright テストランナーを使うのか:
 *   スクリーンショット撮影だけなら Storycap 等の専用ツールや単純な Node スクリプトでも可能だが、
 *   E2E テスト（apps/web）と同じ Playwright テストランナーを使うことで、
 *   ブラウザインストール・テスト実行コマンド・レポート出力（HTML / Allure）・CI ワークフローを
 *   すべて共通化できる（.github/workflows/_playwright-test.yml）。
 *
 * 前提: テスト実行前に `storybook build` が必要（storybook-static/index.json を参照するため）
 *       package.json の vrt スクリプトにはビルドが組み込み済み。
 *
 * 実行: bun run storybook:vrt:playwright
 */
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "@playwright/test";

// ESM では __dirname が未定義のため、import.meta.url から取得
const __dirname = dirname(fileURLToPath(import.meta.url));

// storybook-static/index.json にはビルド済み Storybook の全エントリ（story / docs）が含まれる
const indexJson = JSON.parse(
  readFileSync(join(__dirname, "../storybook-static/index.json"), "utf-8")
);

// type === "story" のエントリのみ抽出（docs エントリはスクリーンショット不要）
const stories = Object.values(indexJson.entries).filter(
  (entry: any) => entry.type === "story"
);

// 各ストーリーに対してテストケースを動的生成
// テスト名: "Components/Button - Primary" のように title と name を結合
for (const story of stories as any[]) {
  test(`${story.title} - ${story.name}`, async ({ page }) => {
    // Storybook の iframe モードでストーリーを単独描画
    await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
    const root = page.locator("#storybook-root");

    // #storybook-root 内のコンポーネントをスクリーンショット撮影
    // story.title の階層構造をディレクトリとして使用（例: "Components/Badge/Error.png"）
    const name = [...story.title.split("/"), `${story.name}.png`];

    // git 管理用: vrt/screenshots/ に保存（変更履歴を追跡）
    const screenshotPath = join("vrt", "screenshots", ...name);
    mkdirSync(dirname(screenshotPath), { recursive: true });
    await root.screenshot({ path: screenshotPath });

    // reg-cli 用: .reg/actual/ に保存（CI での差分比較に使用）
    const regPath = join(".reg", "actual", ...name);
    mkdirSync(dirname(regPath), { recursive: true });
    await root.screenshot({ path: regPath });
  });
}
