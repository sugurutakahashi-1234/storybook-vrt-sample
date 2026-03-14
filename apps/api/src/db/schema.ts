/**
 * Drizzle ORM スキーマ定義（D1 / SQLite）
 *
 * コントラクト（packages/api-contract）の Todo 型に合わせたテーブル定義。
 *
 * - id: UUID 文字列（コントラクトが z.string() のため text 型を使用）
 * - title: TODO のタイトル（空文字不可）
 * - completed: 完了フラグ（SQLite に boolean 型がないため integer(0/1) を使い、
 *   Drizzle の mode: "boolean" で TypeScript 側では boolean として扱う）
 *
 * このスキーマから drizzle-kit でマイグレーション SQL を自動生成し、
 * wrangler d1 migrations apply で D1 に適用する。
 */
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
  /** TODO の一意識別子（UUID v4 文字列） */
  id: text("id").primaryKey(),
  /** TODO のタイトル */
  title: text("title").notNull(),
  /**
   * 完了フラグ
   * SQLite では INTEGER(0/1) として保存され、
   * Drizzle の mode: "boolean" により TypeScript では boolean に変換される
   */
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
});
