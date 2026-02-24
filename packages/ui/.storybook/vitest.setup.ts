// biome-ignore lint/performance/noNamespaceImport: setProjectAnnotations にはモジュール全体を渡す必要がある
import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from "@storybook/react";
import { beforeAll } from "vitest";
// biome-ignore lint/performance/noNamespaceImport: setProjectAnnotations にはモジュール全体を渡す必要がある
import * as previewAnnotations from "./preview";

const annotations = setProjectAnnotations([
  a11yAddonAnnotations,
  previewAnnotations,
  // テスト時は side-by-side を無効化（Story が2重レンダリングされ play 関数が複数要素を検出するため）
  { initialGlobals: { theme: "light" } },
]);

beforeAll(annotations.beforeAll);
