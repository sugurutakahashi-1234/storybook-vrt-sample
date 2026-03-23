import type { Todo } from "@storybook-vrt-sample/api-contract";
import { TodoSchema, contract } from "@storybook-vrt-sample/api-contract";
/**
 * リソース別 MSW ハンドラー（正常系）
 *
 * orpc-msw を使い、コントラクトから型安全な MSW ハンドラーを生成する。
 * リソースが増えたら createXxxHandlers を追加していく。
 */
import type { HttpHandler } from "msw";
import { createMSWUtilities } from "orpc-msw";

/** Todo リソースの正常系ハンドラーを生成する */
export const createTodoHandlers = (
  baseUrl: string,
  todos: Todo[] = [TodoSchema.parse({ id: "1" })]
): HttpHandler[] => {
  // orpc-msw が提供する createMSWUtilities で、
  // コントラクトから型安全な MSW ハンドラービルダーを生成する。
  // msw.todo.list.handler(fn) のようにチェーンすると:
  //   - パスの手書き不要（コントラクトの path 定義から自動解決）
  //   - fn の引数 { input } がコントラクトの入力スキーマから型推論される
  //   - fn の戻り値がコントラクトの出力スキーマと不一致なら型エラーになる
  const msw = createMSWUtilities({ router: contract, baseUrl });
  return [
    msw.todo.list.handler(() => todos),
    msw.todo.create.handler(({ input }: { input: { title: string } }) =>
      TodoSchema.parse({ id: crypto.randomUUID(), title: input.title })
    ),
    msw.todo.toggle.handler(({ input }: { input: { id: string } }) => {
      const todo = todos.find((t) => t.id === input.id);
      if (!todo) {
        return Response.json({ message: "Not found" }, { status: 404 });
      }
      return { ...todo, completed: !todo.completed };
    }),
  ];
};
