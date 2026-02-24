/**
 * ThemeToggle コンポーネントの Storybook ストーリー定義
 *
 * テーマ切り替えボタンの2状態（Light / Dark）の表示と
 * クリックによるトグル動作を確認するストーリーを定義する。
 */
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { ThemeToggle } from "./ThemeToggle";

const meta = {
  title: "Components/ThemeToggle",
  component: ThemeToggle,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="flex items-center gap-4 p-4">
        <Story />
        <span className="text-on-surface-muted text-sm">
          クリックでテーマを切り替え
        </span>
      </div>
    ),
  ],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/** デフォルト状態 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    // ボタンが表示されていることを検証
    await expect(button).toBeVisible();
    // ライトまたはダークの aria-label を持つ
    await expect(button).toHaveAccessibleName(/ライト|ダーク/);
  },
};

/** クリックでテーマがトグルすることを検証 */
export const CycleThemes: Story = {
  tags: ["skip-vrt"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    // 初期状態を取得
    const initialLabel = button.getAttribute("aria-label") || "";
    const startsLight = /ライト/.test(initialLabel);

    // 1回クリック: light → dark または dark → light
    await userEvent.click(button);
    if (startsLight) {
      await expect(button).toHaveAccessibleName(/ダーク/);
    } else {
      await expect(button).toHaveAccessibleName(/ライト/);
    }

    // 2回クリック: 元に戻る
    await userEvent.click(button);
    if (startsLight) {
      await expect(button).toHaveAccessibleName(/ライト/);
    } else {
      await expect(button).toHaveAccessibleName(/ダーク/);
    }
  },
};
