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

// MSW モード: API サーバーなしで UI を確認するためのモックサーバー
// NEXT_PUBLIC_MSW_ENABLED=true のときのみ Service Worker を起動する
if (process.env.NEXT_PUBLIC_MSW_ENABLED === "true") {
  const { worker } = await import("./app/mocks/browser");
  // "bypass": ハンドラーに一致しないリクエストはそのまま実際のネットワークに通す。
  // 静的アセットや Sentry 等のリクエストまで警告・エラーにしないため。
  await worker.start({ onUnhandledRequest: "bypass" });
}

// Next.js のクライアントナビゲーションを Sentry のトランザクションとして計測する。
// @see https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
//
// oxlint が「captureRouterTransitionStart が見つからない」と報告するが、実行時には正常に動作する。
// 原因: @sentry/nextjs の package.json exports が条件付き（browser / node / edge）で、
// captureRouterTransitionStart は browser 条件の index.client.js にのみ存在する。
// しかし types 条件の index.types.d.ts にはこの export が含まれていないため、
// oxlint が型定義だけを見て「存在しない」と判定してしまう（Sentry 側の型定義の不備）。
// @see https://github.com/getsentry/sentry-javascript/issues/19939
// oxlint-disable-next-line import/namespace
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

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
