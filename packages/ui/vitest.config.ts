import path from "node:path";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import tailwindcss from "@tailwindcss/vite";
import { playwright } from "@vitest/browser-playwright";
import { storybookVis } from "storybook-addon-vis/vitest-plugin";
import { defineConfig } from "vitest/config";

const configDir = path.resolve(import.meta.dirname, ".storybook");

export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      "@ui": path.resolve(import.meta.dirname, "src"),
    },
  },
  test: {
    projects: [
      {
        extends: true,
        // 並列実行のために 2 種類のキャッシュをプロジェクトごとに分離する。
        // 1. cacheDir: Vite の deps 事前バンドルキャッシュ（Vite が参照）
        // 2. CACHE_DIR 環境変数: Storybook の sb-vitest キャッシュ（lefthook.yml で設定）
        // 両者は独立しており、それぞれ個別に分離が必要。
        cacheDir: "node_modules/.cache/vite-storybook-test",
        plugins: [storybookTest({ configDir })],
        test: {
          name: "storybook-test",
          browser: {
            enabled: true,
            provider: playwright({}),
            headless: true,
            instances: (["light", "dark"] as const).map((colorScheme) => ({
              browser: "chromium" as const,
              name: colorScheme,
              provider: playwright({ contextOptions: { colorScheme } }),
            })),
          },
          setupFiles: ["./.storybook/vitest.setup.ts"],
        },
      },
      {
        extends: true,
        cacheDir: "node_modules/.cache/vite-storybook-snapshot",
        // storybookTest: .stories ファイルを Vitest テストに変換し Storybook レンダリング環境を構築
        //   play 関数・a11y チェックも含む一体のテストを生成するため分離不可
        // storybookVis: vitest-plugin-vis をラップし画像スナップショット比較機能を追加
        // 両方必須（storybookTest がないとストーリーの変換・レンダリングが行われない）
        plugins: [storybookTest({ configDir }), storybookVis()],
        test: {
          name: "storybook-snapshot",
          browser: {
            enabled: true,
            provider: playwright({}),
            headless: true,
            instances: [{ browser: "chromium" }],
          },
          globalSetup: ["./.storybook/vitest.global-setup.vrt.ts"],
          setupFiles: ["./.storybook/vitest.setup.vrt.ts"],
        },
      },
    ],
  },
});
