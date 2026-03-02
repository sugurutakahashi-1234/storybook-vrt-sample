/**
 * カラーパレットの Storybook ストーリー定義
 *
 * セマンティックカラートークン一覧を表示するドキュメントページ。
 * addon-themes でテーマを切り替えると Light / Dark の値がリアルタイムで確認できる。
 */
import type { Meta, StoryObj } from "@storybook/react";

import { ColorPalette } from "./ColorPalette";

const meta = {
  title: "Foundations/Color Palette",
  component: ColorPalette,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ColorPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 全グループ一覧 */
export const All: Story = {
  tags: ["!snapshot"],
};

/** Surface & Border */
export const SurfaceAndBorder: Story = {
  args: { groupFilter: ["Surface", "Border"] },
};

/** Primary & Secondary & Danger */
export const Buttons: Story = {
  args: { groupFilter: ["Primary", "Secondary", "Danger"] },
};

/** Error & Ring */
export const ErrorAndRing: Story = {
  args: { groupFilter: ["Error", "Ring"] },
};

/** Badge */
export const BadgeColors: Story = {
  args: { groupFilter: ["Badge"] },
};

/** Interactive */
export const Interactive: Story = {
  args: { groupFilter: ["Interactive"] },
};
