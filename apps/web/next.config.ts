/**
 * Next.js 設定
 *
 * Next.js アプリケーションのビルド・ランタイム設定を定義する。
 * withSentryConfig でラップすることで、ビルド時のソースマップアップロード等を自動化する。
 */
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // モノレポ内の内部パッケージをトランスパイル対象に含める
  // @storybook-vrt-sample/ui は TypeScript のソースを直接参照しているため、
  // Next.js のビルド時にトランスパイルが必要
  transpilePackages: ["@storybook-vrt-sample/ui"],

  // E2E テスト時のみデバッグインジケータ（画面右下のバッジ）を無効化
  // Playwright が webServer 経由で dev サーバーを起動する際に PLAYWRIGHT=1 を設定する
  ...(process.env.PLAYWRIGHT && { devIndicators: false as const }),
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
