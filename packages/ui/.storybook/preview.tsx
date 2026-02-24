/**
 * Storybook プレビュー設定
 *
 * 全ストーリーに適用されるグローバル設定を定義する。
 * デコレーター、パラメーター、グローバルスタイルの読み込みなど。
 *
 * テーマ切り替え:
 * ツールバーから Auto / Light / Dark / Side by side を選択可能。
 * Auto モードでは OS の prefers-color-scheme に従う（Playwright の colorScheme 設定が反映される）。
 * Side by side モードではライト・ダーク両方を横並びで表示する。
 */

import type { Decorator, Preview } from "@storybook/react";

// グローバル CSS を読み込み（Tailwind CSS のベーススタイル）
// これにより全ストーリーで Tailwind のユーティリティクラスが使用可能になる
import "../src/styles.css";

const withTheme: Decorator = (Story, { globals: { theme } }) => {
  if (theme === "side-by-side") {
    // Light 側に "light" クラスを付与し、OS ダークモード時でもライトテーマを強制する
    return (
      <div style={{ display: "flex", gap: "24px" }}>
        <div>
          <div style={{ marginBottom: "4px", fontSize: "12px", color: "#666" }}>
            Light
          </div>
          <div className="light bg-background p-4">
            <Story />
          </div>
        </div>
        <div>
          <div style={{ marginBottom: "4px", fontSize: "12px", color: "#999" }}>
            Dark
          </div>
          <div className="dark bg-background p-4">
            <Story />
          </div>
        </div>
      </div>
    );
  }

  const isDark =
    theme === "auto"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : theme === "dark";

  return (
    <div className={isDark ? "dark bg-background" : "bg-background"}>
      <Story />
    </div>
  );
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Theme for components",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "side-by-side", icon: "sidebar", title: "Side by side" },
          { value: "light", icon: "circlehollow", title: "Light" },
          { value: "dark", icon: "circle", title: "Dark" },
          { value: "auto", icon: "browser", title: "System" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "side-by-side",
  },
  decorators: [withTheme],
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
