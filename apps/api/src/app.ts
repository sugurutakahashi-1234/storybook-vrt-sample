/**
 * Hono アプリケーション定義
 *
 * oRPC ルーターを Hono にマウントした共通アプリケーション。
 * エントリポイント（Bun dev / Cloudflare Workers）から import して使う。
 *
 * ## D1 接続の仕組み
 *
 * Workers 環境ではリクエストごとに c.env.DB（D1 バインディング）から
 * Drizzle インスタンスを生成し、oRPC ルーターに渡す。
 * Bun ローカル開発（dev:bun）では D1 バインディングがないため、
 * db=null でインメモリフォールバックする。
 *
 * ## wrangler dev でのローカル開発
 *
 * `wrangler dev` を使う場合はローカル D1（SQLite ファイル）が自動的に使われる。
 * 初回は `bunx wrangler d1 migrations apply <db-name> --local` で
 * マイグレーションを適用する必要がある。
 *
 * CORS は全オリジン許可（検証用リポジトリのため）。
 * 本番運用では環境ごとに許可オリジンを制限すること。
 */
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { createDb } from "./db/index.js";
import { createRouter } from "./router.js";

/**
 * Cloudflare Workers のバインディング型定義
 *
 * wrangler.jsonc の [[d1_databases]] binding = "DB" に対応する。
 * Bun ローカル開発では D1 バインディングが存在しないため optional にしている。
 */
export const app = new Hono<{
  Bindings: { DB?: D1Database; DEPLOY_ENV?: string };
}>();

app.use("*", cors());

/**
 * oRPC ハンドラーのマウント
 *
 * リクエストごとにルーターと OpenAPIHandler を生成する。
 * Workers はリクエストごとに isolate が起動するため、
 * インスタンス共有の必要はなくパフォーマンス問題もない。
 */
app.all("/api/*", async (c) => {
  const db = c.env.DB ? createDb(c.env.DB) : null;
  const rawEnv = c.env.DEPLOY_ENV ?? "local";
  const prMatch = rawEnv.match(/pr-(\d+)/);
  const deployEnv = prMatch ? `pr-${prMatch[1]}` : rawEnv;
  const router = createRouter(db, deployEnv);
  const handler = new OpenAPIHandler(router);
  const { response } = await handler.handle(c.req.raw, {
    prefix: "/api",
  });
  return response ?? c.notFound();
});
