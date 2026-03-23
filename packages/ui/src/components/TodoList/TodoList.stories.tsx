import { TodoSchema } from "@storybook-vrt-sample/api-contract";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { TodoList } from "./TodoList";

const sampleTodos = [
  TodoSchema.parse({ id: "1", title: "Buy groceries" }),
  TodoSchema.parse({ id: "2", title: "Write tests", completed: true }),
  TodoSchema.parse({ id: "3", title: "Review PR" }),
];

const meta = {
  title: "Components/TodoList",
  component: TodoList,
  args: {
    todos: sampleTodos,
    loading: false,
    error: null,
    onToggle: fn(),
    onCreate: fn(),
  },
} satisfies Meta<typeof TodoList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** デフォルト: 3件の TODO */
export const Default: Story = {};

/** 空リスト */
export const Empty: Story = {
  args: {
    todos: [],
  },
};

/** 全て完了済み */
export const AllCompleted: Story = {
  args: {
    todos: [
      TodoSchema.parse({ id: "1", title: "Buy groceries", completed: true }),
      TodoSchema.parse({ id: "2", title: "Write tests", completed: true }),
      TodoSchema.parse({ id: "3", title: "Review PR", completed: true }),
    ],
  },
};

/** タイトルが空文字の TODO を含む */
export const EmptyTitle: Story = {
  args: {
    todos: [
      TodoSchema.parse({ id: "1", title: "" }),
      TodoSchema.parse({ id: "2", title: "Normal todo" }),
    ],
  },
};

/** ローディング中 */
export const Loading: Story = {
  args: {
    todos: [],
    loading: true,
  },
};

/** 一覧取得エラー: エラー画面 + Retry ボタン */
export const FetchError: Story = {
  args: {
    todos: [],
    error: "Failed to load todos.",
    onRetry: fn(),
  },
};

/** 作成エラー: 操作エラーバナー表示 */
export const CreateError: Story = {
  args: {
    error: "Failed to create todo.",
  },
};

/** トグルエラー: 操作エラーバナー表示 */
export const ToggleError: Story = {
  args: {
    error: "Failed to toggle todo.",
  },
};
