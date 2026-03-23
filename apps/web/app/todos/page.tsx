import { Badge, Card } from "@storybook-vrt-sample/ui";
import type { Metadata } from "next";

import { formatPageTitle } from "@/utils/format";

import { TodoListContainer } from "./TodoListContainer";

export const metadata: Metadata = {
  title: formatPageTitle("Todos"),
};

/**
 * タスク管理ページ
 *
 * タスクの一覧表示・作成・完了トグルを行う。
 * API エラー時はバナー表示し、Retry で再取得できる。
 *
 * - `GET /api/todos` → `Todo[]`
 * - `POST /api/todos` `{ title }` → `Todo`
 * - `PATCH /api/todos/{id}` `{ id }` → `Todo`
 */
export default function TodosPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-2 font-bold text-4xl text-on-surface">Todos</h1>
      <p className="mb-8 text-lg text-on-surface-muted">
        oRPC クライアント経由で API と通信する TODO 管理ページです。
      </p>

      <div className="mb-8 flex flex-wrap gap-2">
        <Badge variant="info">oRPC</Badge>
        <Badge variant="success">リアルタイム API</Badge>
        <Badge variant="warning">認証不要</Badge>
      </div>

      <section className="mb-12">
        <TodoListContainer
          {...(process.env.NEXT_PUBLIC_API_BASE_URL && {
            apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
          })}
        />
      </section>

      <section>
        <h2 className="mb-4 font-semibold text-2xl text-on-surface">
          API エンドポイント
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card header="GET /api/todos">
            TODO 一覧を取得します。ページ表示時に自動で呼び出されます。
          </Card>
          <Card header="POST /api/todos">
            新しい TODO を作成します。タイトルをリクエストボディに含めます。
          </Card>
          <Card header="PATCH /api/todos/{id}" variant="outlined">
            指定した TODO の完了状態をトグルします。
          </Card>
        </div>
      </section>
    </main>
  );
}
