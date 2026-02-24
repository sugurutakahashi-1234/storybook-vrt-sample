/**
 * Storybook VRT（ビジュアルリグレッションテスト）用 Playwright 設定
 *
 * Storybook で描画されたコンポーネントのスクリーンショットを撮影し、
 * リファレンス画像と比較することで意図しない見た目の変更を検出する。
 *
 * 実行: bun run vrt:snapshot（ルートからは bun run storybook:vrt:snapshot）
 */
import { defineConfig } from "@playwright/test";

export default defineConfig({
  // テスト実行前にスクリーンショットディレクトリをクリア（削除されたストーリーの残存防止）
  globalSetup: "./vrt/global-setup.ts",

  // テストファイルの配置ディレクトリ
  testDir: "./vrt",

  // テストを並列実行する（独立したコンポーネントのスクリーンショットなので並列で問題ない）
  fullyParallel: true,

  // CI 環境では .only の使用を禁止（テストの実行漏れを防止）
  forbidOnly: !!process.env.CI,

  // CI 環境ではフレーキーテスト対策として最大2回リトライ、ローカルではリトライしない
  retries: process.env.CI ? 2 : 0,

  // CI 環境ではスクリーンショットの一貫性のため1ワーカーに制限、ローカルはCPUに合わせて自動
  ...(process.env.CI ? { workers: 1 } : {}),

  // テスト結果レポーター
  // - HTML: playwright-report/ に生成（標準レポート）
  // - Allure: allure-results/ に生成（リッチなテストレポート）
  reporter: [
    ["html"],
    [
      "allure-playwright",
      {
        resultsDir: "allure-results",
        environmentInfo: {
          Framework: "Storybook",
          TestType: "VRT",
        },
      },
    ],
  ],

  use: {
    // Storybook の URL
    baseURL: "http://localhost:6006",

    // テスト失敗時の自動スクリーンショットは無効（VRT 自体がスクリーンショット比較のため不要）
    screenshot: "off",
  },

  // ビルド済み Storybook を http-server で配信（index.json の読み取りにビルドが必要）
  webServer: {
    command:
      "PLAYWRIGHT=1 npx http-server storybook-static --port 6006 --silent",
    url: "http://localhost:6006",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
