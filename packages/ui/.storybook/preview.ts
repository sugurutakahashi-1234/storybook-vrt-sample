/**
 * Storybook プレビュー設定
 *
 * 全ストーリーに適用されるグローバル設定を定義する。
 * デコレーター、パラメーター、グローバルスタイルの読み込みなど。
 */

import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react";

// グローバル CSS を読み込み（Tailwind CSS のベーススタイル）
// これにより全ストーリーで Tailwind のユーティリティクラスが使用可能になる
import "../src/styles.css";

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
  ],
  parameters: {
    controls: {
      // Storybook Controls パネルの自動マッチング設定
      // プロパティ名に基づいて適切なコントロールUIを自動選択する
      matchers: {
        // "background" や "color" を含むプロパティにはカラーピッカーを表示
        color: /(background|color)$/i,
        // "Date" で終わるプロパティにはデートピッカーを表示
        date: /Date$/i,
      },
    },
    // アクセシビリティチェックのグローバル設定
    // コンポーネント単位のストーリーでは landmark region が存在しないため無効化
    a11y: {
      config: {
        rules: [{ id: "region", enabled: false }],
      },
    },
  },
};

export default preview;
