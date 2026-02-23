/**
 * Badge コンポーネントの Storybook ストーリー定義
 *
 * 各バリアント（Info / Success / Warning / Error）のストーリーを定義する。
 * VRT テスト（vrt/badge.spec.ts）でスクリーンショット比較の対象となる。
 */
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { Badge } from "./Badge";

const meta = {
  // Storybook のサイドバーでの表示パス
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "error"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Info バリアント（青系） */
export const Info: Story = {
  args: {
    children: "Info",
    variant: "info",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // テキスト "Info" が表示されていることを検証
    await expect(canvas.getByText("Info")).toBeVisible();
  },
};

/** Success バリアント（緑系） */
export const Success: Story = {
  args: {
    children: "Success",
    variant: "success",
  },
};

/** Warning バリアント（黄系） */
export const Warning: Story = {
  args: {
    children: "Warning",
    variant: "warning",
  },
};

/** Error バリアント（赤系） */
export const ErrorVariant: Story = {
  name: "Error",
  args: {
    children: "Error",
    variant: "error",
  },
};

/** 件数表示（上限以内） */
export const WithCount: Story = {
  args: {
    count: 5,
    variant: "info",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("5")).toBeVisible();
  },
};

/** 件数表示（上限超過 → "99+" 表示） */
export const WithCountOverflow: Story = {
  args: {
    count: 150,
    variant: "error",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("99+")).toBeVisible();
  },
};

/** 件数表示（負数 → 何も表示されない） */
export const WithNegativeCount: Story = {
  args: {
    count: -1,
    children: "Fallback",
    variant: "info",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // 負数の場合は formatCount が空文字を返すため、children の "Fallback" が表示される
    await expect(canvas.getByText("Fallback")).toBeVisible();
  },
};
