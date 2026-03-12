/**
 * oRPC ルーター実装
 *
 * packages/api-contract で定義したコントラクトに対してハンドラーを紐づける。
 * implement() によりコントラクトの入出力型が自動的に適用されるため、
 * ハンドラー内の input/output は型安全になる。
 *
 * ストレージはインメモリ配列（DB 不要）。サーバー再起動でデータはリセットされる。
 */
import { implement } from "@orpc/server";
import { contract } from "@storybook-vrt-sample/api-contract";
import type { Todo } from "@storybook-vrt-sample/api-contract";

/** インメモリ TODO ストア（サーバー再起動でリセット） */
const todos: Todo[] = [];

export const router = implement(contract).router({
  todo: {
    list: implement(contract.todo.list).handler(() => todos),
    create: implement(contract.todo.create).handler(({ input }) => {
      const todo: Todo = {
        id: crypto.randomUUID(),
        title: input.title,
        completed: false,
      };
      todos.push(todo);
      return todo;
    }),
    toggle: implement(contract.todo.toggle).handler(({ input }) => {
      const todo = todos.find((t) => t.id === input.id);
      if (!todo) {
        throw new Error(`Todo not found: ${input.id}`);
      }
      todo.completed = !todo.completed;
      return todo;
    }),
  },
});
