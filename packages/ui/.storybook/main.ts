/**
 * Storybook メイン設定
 *
 * Storybook の基本構成を定義する。
 * フレームワーク、ストーリーの探索パス、Vite プラグインなどを設定。
 */
import path from "node:path";

import type { StorybookConfig } from "@storybook/nextjs-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  // ストーリーファイルの探索パターン
  // src/ 配下の全 .stories.ts/.stories.tsx ファイルを対象とする
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],

  // アドオン設定
  addons: [
    // addon-docs: MDX によるドキュメント自動生成と Docs ページの提供
    "@storybook/addon-docs",

    // addon-a11y: アクセシビリティチェック（axe-core ベース）を Storybook UI に統合
    "@storybook/addon-a11y",

    // addon-pseudo-states: CSS 疑似状態（:hover, :focus 等）を強制表示し VRT にも活用可能
    "storybook-addon-pseudo-states",

    // storybook-addon-vis: VRT 用の画像スナップショット比較機能を提供
    "storybook-addon-vis",

    // addon-mcp: AI エージェントが MCP 経由で Storybook のコンポーネント情報にアクセス可能にする
    // test: false は run-story-tests ツールが Storybook 10.3.0-alpha.8 以上を要求するため無効化
    {
      name: "@storybook/addon-mcp",
      options: {
        toolsets: { dev: true, docs: true, test: false },
      },
    },

    // addon-vitest: Storybook UI にテスト実行パネルを提供（vitest plugin としては vitest.config.ts で使用）
    // 同一 configDir で複数プロジェクトを定義するとプロジェクト名が衝突しクラッシュするため無効化
    // https://github.com/storybookjs/storybook/issues/32427
    // "@storybook/addon-vitest",
  ],

  // Docs ツール有効化のためコンポーネントマニフェストを生成
  features: {
    experimentalComponentsManifest: true,
  },

  // MSW Service Worker を配信するための静的ディレクトリ
  staticDirs: ["../public"],

  // Next.js + Vite をビルドフレームワークとして使用
  // next/link, next/image, next/navigation 等の Next.js モジュールを自動モックする
  framework: "@storybook/nextjs-vite",

  // Vite の設定をカスタマイズ
  // Tailwind CSS v4 の Vite プラグインを追加して、Storybook 内でも Tailwind が動作するようにする
  viteFinal(viteConfig) {
    viteConfig.plugins = viteConfig.plugins || [];
    viteConfig.plugins.push(tailwindcss());
    // tsconfig.json の paths と同じエイリアスを Vite にも設定。
    // TypeScript は tsconfig の paths でエイリアスを解決するが、
    // Vite（ランタイムのバンドラー）は tsconfig を参照しないため、同じ対応が必要。
    viteConfig.resolve = viteConfig.resolve || {};
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      // packages/ui/src 内の import 用（例: @ui/components/Button）
      "@ui": path.resolve(import.meta.dirname, "../src"),
      // apps/web/app 内の import 用（例: @/todos/page）
      // ページストーリーが apps/web のコンポーネントを直接 import するために必要
      "@": path.resolve(import.meta.dirname, "../../../apps/web/app"),
    };
    return viteConfig;
  },
};

export default config;
