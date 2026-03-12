/**
 * TODO API コントラクト定義
 *
 * oRPC のコントラクトとして API のスキーマ（入出力の型・HTTP メソッド・パス）を定義する。
 * このコントラクトは以下の2箇所から参照される:
 * - apps/api: サーバー側の実装（implement() でハンドラーを紐づける）
 * - packages/ui: MSW モックハンドラーの型として（ストーリーごとにモックデータを差し替え可能）
 */
import { oc } from "@orpc/contract";
import { z } from "zod";

export const TodoSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
});
export type Todo = z.infer<typeof TodoSchema>;

export const contract = oc.router({
  todo: {
    list: oc
      .route({ method: "GET", path: "/todos" })
      .output(z.array(TodoSchema)),
    create: oc
      .route({ method: "POST", path: "/todos" })
      .input(z.object({ title: z.string() }))
      .output(TodoSchema),
    toggle: oc
      .route({ method: "PATCH", path: "/todos/{id}" })
      .input(z.object({ id: z.string() }))
      .output(TodoSchema),
  },
});
