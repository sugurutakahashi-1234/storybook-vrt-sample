/**
 * oRPC ルーター実装（D1 対応版）
 *
 * packages/api-contract で定義したコントラクトに対してハンドラーを紐づける。
 * implement() によりコントラクトの入出力型が自動的に適用されるため、
 * ハンドラー内の input/output は型安全になる。
 *
 * ## ストレージ戦略
 *
 * - D1 が渡された場合: Drizzle ORM で D1 にクエリを実行（本番・Workers 環境）
 * - D1 が渡されない場合: インメモリ配列にフォールバック（Bun ローカル開発用）
 *
 * ## なぜルーターをファクトリ関数にしているか
 *
 * Workers はリクエストごとに isolate が起動するため、D1 バインディングは
 * リクエストハンドラの引数（env.DB）からしか取得できない。
 * モジュールスコープでは D1 にアクセスできないため、リクエストごとに
 * ルーターを生成する設計になっている。
 * Workers ではインスタンス共有の必要がないので、パフォーマンスの問題はない。
 */
import { implement } from "@orpc/server";
import { contract } from "@storybook-vrt-sample/api-contract";
import type { Todo } from "@storybook-vrt-sample/api-contract";
import { eq } from "drizzle-orm";

import type { Database } from "./db/index.js";
import { todos as todosTable } from "./db/schema.js";

/** インメモリ TODO ストア（Bun ローカル開発用フォールバック。サーバー再起動でリセット） */
const inMemoryTodos: Todo[] = [];

/** D1 から TODO を作成して返す */
const createTodoInD1 = async (db: Database, title: string): Promise<Todo> => {
  const [inserted] = await db
    .insert(todosTable)
    .values({ id: crypto.randomUUID(), title, completed: false })
    .returning();
  return inserted as Todo;
};

/** D1 で TODO の完了状態をトグルして返す */
const toggleTodoInD1 = async (db: Database, id: string): Promise<Todo> => {
  const existing = await db
    .select()
    .from(todosTable)
    .where(eq(todosTable.id, id))
    .get();
  if (!existing) {
    throw new Error(`Todo not found: ${id}`);
  }
  const [updated] = await db
    .update(todosTable)
    .set({ completed: !existing.completed })
    .where(eq(todosTable.id, id))
    .returning();
  return updated as Todo;
};

export const createRouter = (db: Database | null) =>
  implement(contract).router({
    health: {
      check: implement(contract.health.check).handler(() => ({
        status: "ok",
      })),
    },

    todo: {
      list: implement(contract.todo.list).handler(() => {
        if (db) {
          return db.select().from(todosTable);
        }
        return inMemoryTodos;
      }),

      create: implement(contract.todo.create).handler(({ input }) => {
        if (db) {
          return createTodoInD1(db, input.title);
        }
        const todo: Todo = {
          id: crypto.randomUUID(),
          title: input.title,
          completed: false,
        };
        inMemoryTodos.push(todo);
        return todo;
      }),

      toggle: implement(contract.todo.toggle).handler(({ input }) => {
        if (db) {
          return toggleTodoInD1(db, input.id);
        }
        const todo = inMemoryTodos.find((t) => t.id === input.id);
        if (!todo) {
          throw new Error(`Todo not found: ${input.id}`);
        }
        todo.completed = !todo.completed;
        return todo;
      }),
    },
  });
