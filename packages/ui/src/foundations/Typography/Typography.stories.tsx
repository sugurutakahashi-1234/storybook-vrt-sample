/**
 * タイポグラフィの Storybook ストーリー定義
 *
 * 利用可能なフォントファミリー・サイズ・ウェイトの一覧を表示するドキュメントページ。
 * addon-themes でテーマを切り替えると Light / Dark の値がリアルタイムで確認できる。
 */
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";

import { Typography } from "./Typography";

const meta = {
  title: "Foundations/Typography",
  component: Typography,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

/** タイポグラフィ一覧 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 主要セクションが表示されていることを検証
    await expect(canvas.getByText("Typography")).toBeVisible();
    await expect(canvas.getByText("Font Family")).toBeVisible();
    await expect(canvas.getByText("Font Size")).toBeVisible();
    await expect(canvas.getByText("Font Weight")).toBeVisible();
    await expect(canvas.getByText("Letter Spacing")).toBeVisible();
    await expect(canvas.getByText("Line Height")).toBeVisible();
  },
};
