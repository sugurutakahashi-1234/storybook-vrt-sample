/**
 * Next.js Instrumentation（サーバーサイド）
 *
 * Next.js の instrumentation hook を使い、サーバーサイドの Sentry SDK を初期化する。
 * - Node.js ランタイム → sentry.server.config.ts を読み込む
 * - Edge ランタイム → sentry.edge.config.ts を読み込む
 *
 * onRequestError はサーバーコンポーネント・API Route 等で発生した
 * 未捕捉エラーを自動的に Sentry に報告するフック。
 *
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
import * as Sentry from "@sentry/nextjs";

export const register = async () => {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
};

/**
 * サーバーサイドのリクエスト処理中に発生した未捕捉エラーを Sentry に送信する。
 * Next.js 15+ で利用可能。
 */
export const onRequestError = Sentry.captureRequestError;
