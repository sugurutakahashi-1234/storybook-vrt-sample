/**
 * Drizzle + D1 データベース接続ファクトリ
 *
 * Cloudflare Workers のリクエストごとに Drizzle インスタンスを生成する。
 * Workers はリクエストごとに isolate が起動するため、インスタンスの共有は不要。
 *
 * 使用方法:
 *   const db = createDb(c.env.DB);  // Hono のコンテキストから D1 バインディングを取得
 *   const todos = await db.select().from(todosTable);
 *
 * スキーマを渡すことで、Drizzle のリレーショナルクエリ API が使える。
 */
import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schema.js";

/**
 * D1 バインディングから Drizzle インスタンスを生成する
 *
 * @param d1 - Cloudflare D1 データベースバインディング（wrangler.toml で設定）
 * @returns Drizzle ORM インスタンス（型安全なクエリビルダー）
 */
export const createDb = (d1: D1Database) => drizzle(d1, { schema });

/** Drizzle インスタンスの型（ルーター等で使用） */
export type Database = ReturnType<typeof createDb>;
