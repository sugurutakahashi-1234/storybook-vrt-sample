/**
 * oRPC + Hono API サーバーのエントリポイント
 *
 * Bun.serve の規約に従い default export で { port, fetch } を返す。
 * `bun run --hot src/index.ts` でホットリロード付きの開発サーバーが起動する。
 *
 * OpenAPIHandler を使用する理由:
 * - oRPC の RPCHandler ではなく OpenAPI 形式でルーティングする
 * - これにより MSW（orpc-msw）が HTTP メソッド + パスでリクエストをインターセプトできる
 * - `/api/*` プレフィックスで全ルートをマウント
 *
 * fetch adapter を使用する理由:
 * - @orpc/openapi/node は Node.js の IncomingMessage を前提とするが、
 *   Bun + Hono は Web 標準の Request/Response で動作するため fetch adapter が必要
 */
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { router } from "./router.js";

const handler = new OpenAPIHandler(router, {
  interceptors: [],
});

const app = new Hono();

// Storybook（localhost:6006）からの API 呼び出しを許可
app.use("*", cors());

app.all("/api/*", async (c) => {
  const { response } = await handler.handle(c.req.raw, {
    prefix: "/api",
  });
  return response ?? c.notFound();
});

export default {
  port: 3001,
  fetch: app.fetch,
};
