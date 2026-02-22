/**
 * E2E テスト用 Playwright 設定
 *
 * Next.js アプリケーションに対するエンドツーエンドテストの設定。
 * ページ遷移、レスポンシブ表示、スクリーンショット比較などを検証する。
 *
 * 実行: bun run web:e2e:playwright
 */
import { defineConfig } from "@playwright/test";

export default defineConfig({
  // テストファイルの配置ディレクトリ
  testDir: "./e2e",

  // テストを並列実行する
  fullyParallel: true,

  // CI 環境では .only の使用を禁止（テストの実行漏れを防止）
  forbidOnly: !!process.env.CI,

  // CI 環境ではフレーキーテスト対策として最大2回リトライ、ローカルではリトライしない
  retries: process.env.CI ? 2 : 0,

  // CI 環境では安定性のため1ワーカーに制限、ローカルはCPUに合わせて自動
  workers: process.env.CI ? 1 : undefined,

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
          Framework: "Next.js",
          TestType: "E2E",
        },
      },
    ],
  ],

  use: {
    // Next.js dev サーバーの URL
    baseURL: "http://localhost:3000",

    // テスト失敗時の自動スクリーンショットは無効（E2E テスト内で明示的に撮影するため不要）
    screenshot: "off",
  },

  // テスト実行前に Next.js dev サーバーを自動起動する設定
  webServer: {
    // Next.js を Turbopack モードで起動（ルートの bun run dev 経由）
    command: "bun run dev",
    url: "http://localhost:3000",

    // ローカルでは既に起動済みのサーバーを再利用（開発効率向上）
    // CI では常に新規起動（クリーンな環境を保証）
    reuseExistingServer: !process.env.CI,

    // dev サーバーの起動待ちタイムアウト（2分）
    timeout: 120_000,
  },
});
