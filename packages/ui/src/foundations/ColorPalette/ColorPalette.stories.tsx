/**
 * カラーパレットの Storybook ストーリー定義
 *
 * セマンティックカラートークン一覧を表示するドキュメントページ。
 * addon-themes でテーマを切り替えると Light / Dark の値がリアルタイムで確認できる。
 */
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";

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

/** カラーパレット一覧 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 主要セクションが表示されていることを検証
    await expect(canvas.getByText("Color Palette")).toBeVisible();
    await expect(canvas.getByText("Surface")).toBeVisible();
    await expect(canvas.getByText("Primary")).toBeVisible();
    await expect(canvas.getByText("Badge")).toBeVisible();
  },
};
