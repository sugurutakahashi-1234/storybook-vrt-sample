/**
 * TodoList コンポーネントの Storybook ストーリー定義
 *
 * msw-storybook-addon により、ストーリーごとに異なる MSW ハンドラーを設定できる。
 * parameters.msw.handlers に渡したハンドラーが、そのストーリーの描画中のみ有効になる。
 * meta レベルで設定したハンドラーは全ストーリーのデフォルトとなり、
 * 個別ストーリーの parameters.msw.handlers で上書き可能。
 */
import type { Meta, StoryObj } from "@storybook/react";
import { createTodoHandlers, defaultTodos } from "@ui/mocks/handlers";

import { TodoList } from "./TodoList";

const meta = {
  title: "Components/TodoList",
  component: TodoList,
  parameters: {
    // デフォルトの MSW ハンドラー（3件の TODO を返す）
    msw: {
      handlers: createTodoHandlers(),
    },
  },
} satisfies Meta<typeof TodoList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** デフォルト: 3件の TODO */
export const Default: Story = {};

/** 空リスト */
export const Empty: Story = {
  parameters: {
    msw: {
      handlers: createTodoHandlers([]),
    },
  },
};

/** 全て完了済み */
export const AllCompleted: Story = {
  parameters: {
    msw: {
      handlers: createTodoHandlers(
        defaultTodos.map((t) => ({ ...t, completed: true }))
      ),
    },
  },
};
