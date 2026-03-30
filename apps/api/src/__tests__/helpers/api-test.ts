/**
 * API テスト共通ヘルパー
 *
 * wrangler の getPlatformProxy() でローカル D1 を取得し、
 * oRPC の createRouterClient() で router を直接呼び出す。
 * Hono や HTTP 層を経由しないため、ハンドラーのロジックと DB 操作を直接テストできる。
 *
 * マイグレーションは test スクリプト内で `wrangler d1 migrations apply --local` が
 * テスト前に実行されるため、ここでは管理しない。
 *
 * テストファイルでは以下のように使う:
 *   import { client, env } from "./helpers/api-test.js";
 *   beforeEach(async () => { await env.DB.exec("DELETE FROM todos"); });
 *   test("...", async () => {
 *     const todo = await client.todo.create({ title: "test" });
 *   });
 */
import { resolve } from "node:path";

import { createRouterClient } from "@orpc/server";
import { getPlatformProxy } from "wrangler";

import { createDb } from "../../db/index.js";
import { createRouter } from "../../router.js";

/**
 * wrangler.jsonc を参照してローカル D1 バインディングを取得する。
 * miniflare が裏で起動し、.wrangler/state/v3 の SQLite を D1 として提供する。
 * wrangler dev や wrangler d1 migrations apply --local と同じ DB を参照する。
 */
// dispose() は呼ばない。bun:test ではモジュールレベルの afterAll がファイル間で
// 共有され、先に完了したファイルの afterAll が dispose() を呼ぶと後続ファイルで
// "poisoned stub" エラーになる。テストプロセス終了時にクリーンアップされるため実害なし。
const { env } = await getPlatformProxy<{ DB: D1Database }>({
  configPath: resolve(import.meta.dir, "../../../wrangler.jsonc"),
});

export { env };

/**
 * oRPC router を直接呼び出す型安全クライアント。
 * Hono や HTTP 層を経由せず、ハンドラーのロジックと DB 操作を直接テストする。
 * 戻り値はコントラクトから推論された型（Todo, Todo[] 等）になるため、
 * キャストや JSON.stringify が不要。
 */
const db = createDb(env.DB);
const router = createRouter(db);

export const client = createRouterClient(router);
