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

/** テキスト入力テスト */
export const Typing: Story = {
  args: {
    placeholder: "Enter text...",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Side by side モードでは Light/Dark 両方に入力欄が存在するため getAllByRole を使用
    const [input] = canvas.getAllByRole("textbox");

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
    const [errorMessage] = canvas.getAllByRole("alert");
    await expect(errorMessage).toHaveTextContent("Invalid email address");

    // input に aria-invalid が設定されていることを検証
    const [input] = canvas.getAllByRole("textbox");
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
    const [input] = canvas.getAllByRole("textbox");

    // 入力不可であることを検証
    await expect(input).toBeDisabled();
  },
};
