// biome-ignore lint/performance/noNamespaceImport: setProjectAnnotations にはモジュール全体を渡す必要がある
import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from "@storybook/react";
import { beforeAll } from "vitest";
// biome-ignore lint/performance/noNamespaceImport: setProjectAnnotations にはモジュール全体を渡す必要がある
import * as previewAnnotations from "./preview";

const annotations = setProjectAnnotations([
  a11yAddonAnnotations,
  previewAnnotations,
]);

beforeAll(annotations.beforeAll);
