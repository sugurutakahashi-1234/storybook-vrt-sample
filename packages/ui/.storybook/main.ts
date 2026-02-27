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
  // addon-a11y: アクセシビリティチェック（axe-core ベース）を Storybook UI に統合
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
    "storybook-addon-vis",
  ],

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
