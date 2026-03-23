/**
 * Next.js 設定
 *
 * Next.js アプリケーションのビルド・ランタイム設定を定義する。
 * withSentryConfig でラップすることで、ビルド時のソースマップアップロード等を自動化する。
 *
 * initOpenNextCloudflareForDev() は Next.js dev サーバーで Cloudflare バインディング
 * （D1, R2, KV 等）を利用可能にする。本番ビルド時は何もしない。
 */
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  // モノレポ内の内部パッケージをトランスパイル対象に含める
  // @storybook-vrt-sample/ui は TypeScript のソースを直接参照しているため、
  // Next.js のビルド時にトランスパイルが必要
  transpilePackages: [
    "@storybook-vrt-sample/ui",
    "@storybook-vrt-sample/api-contract",
  ],

  // E2E テスト時のみデバッグインジケータ（画面右下のバッジ）を無効化
  // Playwright が webServer 経由で dev サーバーを起動する際に PLAYWRIGHT=1 を設定する
  ...(process.env.PLAYWRIGHT && { devIndicators: false as const }),

  // MSW モードが無効な場合、./app/mocks/browser を空モジュールに差し替えて
  // 本番バンドルに MSW チャンクが含まれないようにする
  ...(process.env.NEXT_PUBLIC_MSW_ENABLED !== "true" && {
    turbopack: {
      resolveAlias: {
        "./app/mocks/browser": "./app/mocks/noop.ts",
      },
    },
  }),
};

export default withSentryConfig(nextConfig, {
  // Sentry のオーガニゼーションとプロジェクトの識別子
  // ソースマップアップロード時にどのプロジェクトに紐づけるかを指定する
  org: "suguru-takahashi",
  project: "storybook-vrt-sample",

  // CI 環境以外ではビルドログに Sentry のアップロード進捗を表示しない
  silent: !process.env.CI,

  // ビルド時にソースマップを Sentry にアップロードし、本番のスタックトレースを読みやすくする
  // SENTRY_AUTH_TOKEN 環境変数が未設定の場合はスキップされる
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },

  // Sentry のテレメトリ（SDK 利用状況の匿名統計）を無効化する
  telemetry: false,
});
