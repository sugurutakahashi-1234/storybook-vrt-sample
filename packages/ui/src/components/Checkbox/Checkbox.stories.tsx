/**
 * Checkbox コンポーネントの Storybook ストーリー定義
 *
 * ラベルの有無、チェック状態、無効化状態のストーリーを定義する。
 */
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";

import { Checkbox } from "./Checkbox";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** デフォルト: ラベル付き未チェック */
export const Default: Story = {
  args: {
    label: "Accept terms and conditions",
    onChange: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const [checkbox] = canvas.getAllByRole("checkbox") as [HTMLElement];

    await userEvent.click(checkbox);
    await expect(args.onChange).toHaveBeenCalledTimes(1);
  },
};

/** チェック済み */
export const Checked: Story = {
  args: {
    label: "Completed task",
    checked: true,
    readOnly: true,
  },
};

/** ラベルなし */
export const WithoutLabel: Story = {
  args: {
    "aria-label": "Toggle option",
  },
};

/** 無効化状態 */
export const Disabled: Story = {
  args: {
    label: "Unavailable option",
    disabled: true,
  },
};

/** 無効化 + チェック済み */
export const DisabledChecked: Story = {
  args: {
    label: "Locked option",
    disabled: true,
    checked: true,
    readOnly: true,
  },
};
