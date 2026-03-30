/**
 * Chip コンポーネントの Storybook ストーリー定義
 *
 * css-variants の compoundVariants のショーケース。
 * variant（filled / outlined）× color（5色）の組み合わせスタイルを紹介する。
 */
import { fn } from "storybook/test";

import preview from "#.storybook/preview";

import { Chip } from "./Chip";

const meta = preview.meta({
  title: "Components/Chip",
  component: Chip,
  argTypes: {
    color: {
      control: "select",
      options: ["default", "info", "success", "warning", "error"],
    },
    size: {
      control: "select",
      options: ["sm", "md"],
    },
    variant: {
      control: "select",
      options: ["filled", "outlined"],
    },
  },
});

/** Filled / Default */
export const FilledDefault = meta.story({
  args: {
    label: "Default",
    color: "default",
    variant: "filled",
  },
});

/** Filled / Info */
export const FilledInfo = meta.story({
  args: {
    label: "Info",
    color: "info",
    variant: "filled",
  },
});

/** Filled / Success */
export const FilledSuccess = meta.story({
  args: {
    label: "Success",
    color: "success",
    variant: "filled",
  },
});

/** Filled / Warning */
export const FilledWarning = meta.story({
  args: {
    label: "Warning",
    color: "warning",
    variant: "filled",
  },
});

/** Filled / Error */
export const FilledError = meta.story({
  args: {
    label: "Error",
    color: "error",
    variant: "filled",
  },
});

/** Outlined / Default */
export const OutlinedDefault = meta.story({
  args: {
    label: "Default",
    color: "default",
    variant: "outlined",
  },
});

/** Outlined / Info */
export const OutlinedInfo = meta.story({
  args: {
    label: "Info",
    color: "info",
    variant: "outlined",
  },
});

/** Outlined / Success */
export const OutlinedSuccess = meta.story({
  args: {
    label: "Success",
    color: "success",
    variant: "outlined",
  },
});

/** Outlined / Warning */
export const OutlinedWarning = meta.story({
  args: {
    label: "Warning",
    color: "warning",
    variant: "outlined",
  },
});

/** Outlined / Error */
export const OutlinedError = meta.story({
  args: {
    label: "Error",
    color: "error",
    variant: "outlined",
  },
});

/** Small サイズ */
export const Small = meta.story({
  args: {
    label: "Small",
    size: "sm",
    color: "info",
    variant: "filled",
  },
});

/** 削除ボタン付き */
export const Deletable = meta.story({
  args: {
    label: "React",
    color: "info",
    variant: "filled",
    onDelete: fn(),
  },
});

/** Outlined + 削除ボタン */
export const OutlinedDeletable = meta.story({
  args: {
    label: "TypeScript",
    color: "success",
    variant: "outlined",
    onDelete: fn(),
  },
});
