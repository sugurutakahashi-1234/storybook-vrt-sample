import type { Meta, StoryObj } from "@storybook/react";

import Home from "@/page";

import { PageDocsPage } from "./PageDocsPage";

const meta = {
  title: "Pages/Home",
  component: Home,
  parameters: {
    layout: "fullscreen",
    docs: { page: PageDocsPage },
  },
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

/** デフォルト表示 */
export const Default: Story = {};
