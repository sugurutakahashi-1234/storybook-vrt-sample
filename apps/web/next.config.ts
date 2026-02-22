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
};

export default nextConfig;
