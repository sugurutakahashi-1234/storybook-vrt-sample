/**
 * グローバルエラーバウンダリ
 *
 * ルートレイアウトを含むアプリ全体の未捕捉エラーをキャッチし、
 * Sentry に報告しつつフォールバック UI を表示する。
 *
 * このファイルは App Router の規約で、ルートレイアウト（layout.tsx）自体が
 * エラーを投げた場合の最終フォールバックとして機能する。
 * 通常のページエラーは各ルートの error.tsx が処理するため、
 * ここに到達するのは致命的なエラーのみ。
 *
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling#handling-global-errors
 */
"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

const GlobalError = ({ error }: { error: Error & { digest?: string } }) => {
  // エラーが発生したら Sentry に自動報告する
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ja">
      <body>
        {/* statusCode={0} は Next.js のデフォルトエラーページを表示する */}
        {/* global-error はルートレイアウトの外で描画されるため、独自の <html>/<body> が必要 */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
};

export default GlobalError;
