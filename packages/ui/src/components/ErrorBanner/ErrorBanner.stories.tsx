import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { ErrorBanner } from "./ErrorBanner";

const meta = {
  title: "Components/ErrorBanner",
  component: ErrorBanner,
} satisfies Meta<typeof ErrorBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** メッセージのみ */
export const Default: Story = {
  args: {
    message: "Something went wrong.",
  },
};

/** Retry ボタン付き */
export const WithRetry: Story = {
  args: {
    message: "Failed to load data.",
    onRetry: fn(),
  },
};
