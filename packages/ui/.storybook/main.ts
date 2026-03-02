/**
 * Storybook メイン設定
 *
 * Storybook の基本構成を定義する。
 * フレームワーク、ストーリーの探索パス、Vite プラグインなどを設定。
 */
import path from "node:path";

import type { StorybookConfig } from "@storybook/react-vite";
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
    // addon-vitest: Storybook ストーリーを Vitest テストとして実行
    "@storybook/addon-vitest",
    // storybook-addon-vis: VRT 用の画像スナップショット比較機能を提供
    "storybook-addon-vis",
    // addon-mcp: AI エージェントが MCP 経由で Storybook のコンポーネント情報にアクセス可能にする
    // test: false は addon-vitest が同一 configDir の複数プロジェクト名上書きを行うため無効化（#32427）
    {
      name: "@storybook/addon-mcp",
      options: {
        toolsets: { dev: true, docs: true, test: false },
      },
    },
  ],

  // Docs ツール有効化のためコンポーネントマニフェストを生成
  features: {
    experimentalComponentsManifest: true,
  },

  // React + Vite をビルドフレームワークとして使用
  framework: "@storybook/react-vite",

  // Vite の設定をカスタマイズ
  // Tailwind CSS v4 の Vite プラグインを追加して、Storybook 内でも Tailwind が動作するようにする
  viteFinal(viteConfig) {
    viteConfig.plugins = viteConfig.plugins || [];
    viteConfig.plugins.push(tailwindcss());
    // tsconfig.json の paths と同じエイリアスを Vite にも設定
    viteConfig.resolve = viteConfig.resolve || {};
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      "@ui": path.resolve(import.meta.dirname, "../src"),
    };
    return viteConfig;
  },
};

export default config;
