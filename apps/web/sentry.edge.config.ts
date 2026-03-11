/**
 * Sentry Edge Runtime 設定
 *
 * Middleware や Edge API Routes で発生するエラーを Sentry に送信する。
 * instrumentation.ts の register() 内で動的 import される。
 *
 * 環境変数の読み込み:
 *   dotenvx が Next.js 起動前に .env を復号して process.env に注入する。
 *   Next.js の .env 自動読み込みは既存の process.env を上書きしないため、
 *   常に復号された正しい値が使われる。
 *
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
 */
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // パフォーマンスモニタリングのサンプリング率
  // 全リクエストを記録すると課金が膨らむため、本番では 10% に抑える
  // 開発中は全件記録して動作確認しやすくする
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,
});
