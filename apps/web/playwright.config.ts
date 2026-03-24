/**
 * E2E テスト用 Playwright 設定
 *
 * Next.js アプリケーションに対するエンドツーエンドテストの設定。
 * ページ遷移、レスポンシブ表示などの機能テストと、ページレベルの a11y チェック（axe-core）を行う。
 * VRT（スクリーンショット比較）は Storybook VRT でカバーしているため、ここでは行わない。
 *
 * a11y テストは light/dark 両テーマで実行する（テーマ別のコントラスト等を検証するため）。
 * テーマ切り替えは各テスト内で page.emulateMedia() を使用する。
 *
 * 実行: bun run e2e
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
  ...(process.env.CI ? { workers: 1 } : {}),

  // テスト結果レポーター（playwright-report/ に生成）
  reporter: [["html"]],

  use: {
    // Next.js dev サーバーの URL
    baseURL: "http://localhost:3000",

    // VRT は Storybook VRT でカバーしているため、スクリーンショット撮影は無効
    screenshot: "off",
  },

  // テスト実行前に Next.js dev サーバーを自動起動する設定
  webServer: {
    // Next.js を Turbopack モードで起動（ルートの bun run dev 経由）
    command: "PLAYWRIGHT=1 bun run dev",
    url: "http://localhost:3000",

    // ローカルでは既に起動済みのサーバーを再利用（開発効率向上）
    // CI では常に新規起動（クリーンな環境を保証）
    reuseExistingServer: !process.env.CI,

    // dev サーバーの起動待ちタイムアウト（2分）
    timeout: 120_000,
  },
});
