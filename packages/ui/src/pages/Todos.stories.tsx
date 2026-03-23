import { contract, TodoSchema } from "@storybook-vrt-sample/api-contract";
import {
  createContractErrorHandlers,
  createContractLoadingHandlers,
  createTodoHandlers,
} from "@storybook-vrt-sample/api-contract/mocks";
import type { Meta, StoryObj } from "@storybook/react";

import TodosPage from "@/todos/page";

import { PageDocsPage } from "./PageDocsPage";

const BASE = "http://localhost:3001/api";

const sampleTodos = [
  TodoSchema.parse({ id: "1", title: "Buy groceries" }),
  TodoSchema.parse({ id: "2", title: "Write tests", completed: true }),
  TodoSchema.parse({ id: "3", title: "Review PR" }),
];

const meta = {
  title: "Pages/Todos",
  component: TodosPage,
  parameters: {
    layout: "fullscreen",
    docs: { page: PageDocsPage },
  },
} satisfies Meta<typeof TodosPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** デフォルト: 3件の TODO */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: createTodoHandlers(BASE, sampleTodos),
    },
  },
};

/** 空リスト */
export const Empty: Story = {
  parameters: {
    msw: {
      handlers: createTodoHandlers(BASE, []),
    },
  },
};

/** API エラー */
export const FetchError: Story = {
  parameters: {
    msw: {
      handlers: createContractErrorHandlers(BASE, contract.todo, ["list"]),
    },
  },
};

/** ローディング中 */
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: createContractLoadingHandlers(BASE, contract.todo, ["list"]),
    },
  },
};
