/**
 * MSW ハンドラー定義
 *
 * Storybook のストーリーで API レスポンスをモックするための MSW ハンドラー。
 * msw-storybook-addon の parameters.msw.handlers に渡して使用する。
 *
 * createTodoHandlers() にモックデータを渡すことで、ストーリーごとに
 * 異なる API レスポンスを返すことができる（空リスト、全完了済み等）。
 *
 * 設計判断:
 * - orpc-msw（v0.1.0）を使えばコントラクトから MSW ハンドラーを自動生成できるが、
 *   v0.1.0 と初期段階のため安定性を優先して手動定義を選択した（未検証）
 * - エンドポイントが3つと少なく手動でも負担が小さいため、現時点では十分
 * - コントラクトの Todo 型を直接参照することで、スキーマ変更時に型エラーで検知可能
 */
import type { Todo } from "@storybook-vrt-sample/api-contract";
import { http, HttpResponse } from "msw";

/** API サーバーのベース URL（apps/api のデフォルトポート） */
const API_BASE = "http://localhost:3001/api";

export const defaultTodos: Todo[] = [
  { id: "1", title: "Buy groceries", completed: false },
  { id: "2", title: "Write tests", completed: true },
  { id: "3", title: "Review PR", completed: false },
];

export const createTodoHandlers = (todos: Todo[] = defaultTodos) => [
  http.get(`${API_BASE}/todos`, () => HttpResponse.json(todos)),
  http.post(`${API_BASE}/todos`, async ({ request }) => {
    const body = (await request.json()) as { title: string };
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: body.title,
      completed: false,
    };
    return HttpResponse.json(newTodo, { status: 201 });
  }),
  http.patch(`${API_BASE}/todos/:id`, ({ params }) => {
    const todo = todos.find((t) => t.id === params["id"]);
    if (!todo) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }
    return HttpResponse.json({ ...todo, completed: !todo.completed });
  }),
];
