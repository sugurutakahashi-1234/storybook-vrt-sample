/**
 * TextField コンポーネントの Storybook ストーリー定義
 *
 * 各状態（Default / WithLabel / WithError / WithHelperText / Disabled）のストーリーを定義する。
 * play 関数によるインタラクションテストを含む。
 */
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";

import { TextField } from "./TextField";

const meta = {
  title: "Components/TextField",
  component: TextField,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outlined"],
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** デフォルト状態 */
export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

/** テキスト入力テスト（VRT 対象外: play 関数で DOM が変化するためスクリーンショットが不安定） */
export const Typing: Story = {
  args: {
    placeholder: "Enter text...",
  },
  tags: ["!snapshot"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    // テキストを入力し、値が反映されることを検証
    await userEvent.type(input, "Hello, World!");
    await expect(input).toHaveValue("Hello, World!");
  },
};

/** ラベル付き */
export const WithLabel: Story = {
  args: {
    label: "Username",
    placeholder: "Enter username...",
  },
};

/** エラー状態 */
export const WithError: Story = {
  args: {
    label: "Email",
    error: "Invalid email address",
    defaultValue: "invalid-email",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // エラーメッセージが表示されていることを検証
    const errorMessage = canvas.getByRole("alert");
    await expect(errorMessage).toHaveTextContent("Invalid email address");

    // input に aria-invalid が設定されていることを検証
    const input = canvas.getByRole("textbox");
    await expect(input).toHaveAttribute("aria-invalid", "true");
  },
};

/** ヘルパーテキスト付き */
export const WithHelperText: Story = {
  args: {
    label: "Password",
    helperText: "Must be at least 8 characters",
    type: "password",
  },
};

/** 無効化状態 */
export const Disabled: Story = {
  args: {
    label: "Disabled Field",
    placeholder: "Cannot type here",
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    // 入力不可であることを検証
    await expect(input).toBeDisabled();
  },
};
