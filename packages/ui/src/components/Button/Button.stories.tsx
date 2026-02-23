/**
 * Button コンポーネントの Storybook ストーリー定義
 *
 * 各バリアント（Primary / Secondary / Danger）、サイズ（Small / Large）、
 * 状態（Disabled）のストーリーを定義する。
 * VRT テスト（vrt/button.spec.ts）でスクリーンショット比較の対象となる。
 */
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "./Button";

const meta = {
  // Storybook のサイドバーでの表示パス
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Primary バリアント（デフォルト） */
export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
    onClick: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    // クリック → onClick が呼び出されることを検証
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

/** Secondary バリアント */
export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
  },
};

/** Danger バリアント */
export const Danger: Story = {
  args: {
    children: "Danger Button",
    variant: "danger",
  },
};

/** Small サイズ */
export const Small: Story = {
  args: {
    children: "Small Button",
    size: "sm",
  },
};

/** Large サイズ */
export const Large: Story = {
  args: {
    children: "Large Button",
    size: "lg",
  },
};

/** 無効化状態 */
export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    // ボタンが disabled 状態であることを検証
    await expect(button).toBeDisabled();
  },
};
