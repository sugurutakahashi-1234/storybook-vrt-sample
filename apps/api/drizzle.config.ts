/**
 * Drizzle Kit 設定
 *
 * D1（SQLite）向けのマイグレーション生成に使用する。
 * `bunx drizzle-kit generate` でスキーマ差分からマイグレーション SQL を生成し、
 * `bunx wrangler d1 migrations apply` で D1 に適用する。
 */
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
});
