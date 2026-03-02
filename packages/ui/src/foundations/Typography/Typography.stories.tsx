/**
 * タイポグラフィの Storybook ストーリー定義
 *
 * 利用可能なフォントファミリー・サイズ・ウェイトの一覧を表示するドキュメントページ。
 * addon-themes でテーマを切り替えると Light / Dark の値がリアルタイムで確認できる。
 */
import type { Meta, StoryObj } from "@storybook/react";

import { Typography } from "./Typography";

const meta = {
  title: "Foundations/Typography",
  component: Typography,
  tags: ["!snapshot"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 全セクション一覧 */
export const All: Story = {};

/** フォントファミリー */
export const FontFamily: Story = {
  args: { sectionFilter: ["Font Family"] },
};

/** フォントサイズ */
export const FontSize: Story = {
  args: { sectionFilter: ["Font Size"] },
};

/** フォントウェイト */
export const FontWeight: Story = {
  args: { sectionFilter: ["Font Weight"] },
};

/** レタースペーシング */
export const LetterSpacing: Story = {
  args: { sectionFilter: ["Letter Spacing"] },
};

/** 行高 */
export const LineHeight: Story = {
  args: { sectionFilter: ["Line Height"] },
};
