/**
 * Sentry クライアントサイド設定（instrumentation-client.ts）
 *
 * ブラウザ上で発生するエラーやパフォーマンスデータを Sentry に送信する。
 * Next.js が自動的にこのファイルを読み込み、クライアントバンドルに含める。
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

  // ── ノイズ除去 ──
  // ユーザー操作に影響しない既知のブラウザエラーを無視して、無料枠を節約する
  ignoreErrors: [
    // ResizeObserver のループ超過（ブラウザ仕様上の無害な警告）
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
    // ネットワーク切断やタイムアウトで発生する一時的なエラー
    /^Load failed$/,
    /^Failed to fetch$/,
    /^NetworkError/,
    // Next.js のクライアントナビゲーション中断（ユーザーが素早くページ遷移した場合）
    "NEXT_NOT_FOUND",
    // 非 Error オブジェクトが throw された場合のフォールバック（有用な情報がない）
    /^Non-Error exception captured/,
  ],

  // ブラウザ拡張やサードパーティスクリプトのエラーを送信しない
  // 自分のアプリ由来でないエラーは対処不能なので除外する
  denyUrls: [
    /extensions\//i,
    /^chrome:\/\//i,
    /^chrome-extension:\/\//i,
    /^moz-extension:\/\//i,
    /^safari-extension:\/\//i,
  ],
});
