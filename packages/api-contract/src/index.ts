/**
 * API コントラクト定義
 *
 * oRPC のコントラクトとして API のスキーマ（入出力の型・HTTP メソッド・パス）を定義する。
 * このコントラクトは以下の箇所から参照される:
 * - apps/api: サーバー側の実装（implement() でハンドラーを紐づける）
 * - apps/web: クライアント側の API 呼び出し（createApiClient()）
 * - packages/ui: MSW モックハンドラーの型として（ストーリーごとにモックデータを差し替え可能）
 *
 * API を追加する場合:
 * 1. src/ に新しいファイルを作成（例: user.ts）
 * 2. スキーマとルート定義を書く
 * 3. このファイルで re-export し、contract.router() に追加する
 *
 * ※ サブディレクトリ（contracts/ 等）に分けると Turbopack が .js 拡張子を
 *   解決できないため、同階層に置くこと（vercel/next.js#82945）
 */
import { oc } from "@orpc/contract";

import { healthContract } from "./health";
import { todoContract } from "./todo";

export { TodoSchema } from "./todo";
export type { Todo } from "./todo";

export const contract = oc.router({
  health: healthContract,
  todo: todoContract,
});
