/**
 * VRT（ビジュアルリグレッションテスト）用 vitest セットアップ
 *
 * storybook-addon-vis の自動スナップショット機能を使い、
 * 各ストーリーのライト・ダーク両テーマのスクリーンショットを自動撮影する。
 *
 * vis.setup({ auto: { light, dark } }) により:
 * - "snapshot" タグ付きストーリーが自動で VRT 対象になる
 * - 各テーマの callback でダークモードクラスの切り替えと
 *   body の inline-block 化（コンポーネントサイズにフィット）を行う
 */
import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from "@storybook/react";
import { vis, visAnnotations } from "storybook-addon-vis/vitest-setup";
import { beforeAll } from "vitest";

import * as previewAnnotations from "./preview";

const annotations = setProjectAnnotations([
  a11yAddonAnnotations,
  visAnnotations,
  previewAnnotations,
  // VRT ではテーマを vis.setup で制御するため side-by-side を無効化
  { initialGlobals: { theme: "light" } },
]);

beforeAll(annotations.beforeAll);

/**
 * body をコンポーネントサイズにフィットさせる。
 * デフォルトでは body が viewport 全体を占めるため、
 * display: inline-block + height: auto で内容に合わせて縮小する。
 */
const fitBodyToContent = () => {
  const { style } = document.body;
  style.display = "inline-block";
  style.minHeight = "auto";
  style.height = "auto";
  document.documentElement.style.minHeight = "auto";
  document.documentElement.style.height = "auto";
};

vis.setup({
  auto: {
    light() {
      document.documentElement.classList.remove("dark");
      fitBodyToContent();
    },
    dark() {
      document.documentElement.classList.add("dark");
      fitBodyToContent();
    },
  },
});
