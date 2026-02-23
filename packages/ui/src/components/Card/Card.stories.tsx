/**
 * Card コンポーネントの Storybook ストーリー定義
 *
 * 各バリアント（Default / Outlined）とヘッダーなしパターンのストーリーを定義する。
 * VRT テスト（vrt/card.spec.ts）でスクリーンショット比較の対象となる。
 */
import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

const meta = {
  // Storybook のサイドバーでの表示パス
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outlined"],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default バリアント（シャドウ付き） */
export const Default: Story = {
  args: {
    header: "Card Title",
    children: "This is the card body content. You can put any content here.",
  },
};

/** Outlined バリアント（ボーダー付き） */
export const Outlined: Story = {
  args: {
    variant: "outlined",
    header: "Outlined Card",
    children: "This card has an outlined style instead of a shadow.",
  },
};

/** ヘッダーなし */
export const WithoutHeader: Story = {
  args: {
    children: "This card has no header, just body content.",
  },
};
