/**
 * Next.js 設定
 *
 * Next.js アプリケーションのビルド・ランタイム設定を定義する。
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // モノレポ内の内部パッケージをトランスパイル対象に含める
  // @storybook-vrt-sample/ui は TypeScript のソースを直接参照しているため、
  // Next.js のビルド時にトランスパイルが必要
  transpilePackages: ["@storybook-vrt-sample/ui"],

  // E2E テスト時のみデバッグインジケータ（画面右下のバッジ）を無効化
  // Playwright が webServer 経由で dev サーバーを起動する際に PLAYWRIGHT=1 を設定する
  devIndicators: process.env.PLAYWRIGHT ? false : undefined,
};

export default nextConfig;
