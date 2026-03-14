/**
 * Drizzle Kit 設定
 *
 * D1（SQLite）向けのマイグレーション生成に使用する。
 * `bunx drizzle-kit generate` でスキーマ差分からマイグレーション SQL を生成し、
 * `bunx wrangler d1 migrations apply` で D1 に適用する。
 *
 * driver: "d1-http" + dbCredentials は省略している。
 * これらは `drizzle-kit push` でリモート D1 に直接マイグレーションを適用する場合に必要だが、
 * このプロジェクトでは `drizzle-kit generate`（SQL 生成のみ）+
 * `wrangler d1 migrations apply`（適用）のワークフローで運用するため不要。
 */
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
});
