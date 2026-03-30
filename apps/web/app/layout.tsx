/**
 * ルートレイアウト
 *
 * Next.js App Router の最上位レイアウト。
 * 全ページに共通する HTML 構造、メタデータ、グローバルスタイルを定義する。
 */

import { ThemeToggle } from "@storybook-vrt-sample/ui";
import type { Metadata } from "next";

import "./globals.css";
import { formatPageTitle } from "./utils/format";

// MSW モック有効時に「MSW MOCK」リボンを表示するためのフラグ。
// 環境変数は instrumentation-client.ts での MSW 起動と共有。
const isMswEnabled = process.env.NEXT_PUBLIC_MSW_ENABLED === "true";

// 環境名を表示するリボン（production 以外で表示）
// PR preview の場合は Worker 名（storybook-vrt-sample-web-pr-135-xxx）から
// "PR-135" 部分を抽出して短く表示する
const deployEnv = process.env.NEXT_PUBLIC_DEPLOY_ENV ?? "local";
const showEnvRibbon = deployEnv !== "production";
const envLabel = (() => {
  const prMatch = deployEnv.match(/pr-(\d+)/);
  if (prMatch) {
    return `PR-${prMatch[1]}`;
  }
  return deployEnv.toUpperCase();
})();

/** サイト全体のメタデータ（<title> や <meta> タグに反映される） */
export const metadata: Metadata = {
  title: formatPageTitle(),
  description: "Playwright VRT + Storybook sample project with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* ページ描画前にテーマを適用し、ちらつき（FOUC）を防止する */}
        {/* localStorage に値がなければ OS のカラースキームに従う */}
        <script
          // oxlint-disable-next-line react/no-danger -- FOUC 防止のためインラインスクリプトが必須
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme');
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (!theme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-on-background antialiased">
        {isMswEnabled && (
          <div
            className="pointer-events-none fixed top-0 left-0 z-50 overflow-hidden"
            style={{ width: "150px", height: "150px" }}
          >
            <div className="absolute top-10 -left-8.75 w-50 -rotate-45 bg-badge-warning-bg py-1 text-center font-bold text-badge-warning-text text-xs shadow-sm">
              MSW MOCK
            </div>
          </div>
        )}
        {showEnvRibbon && (
          <div
            className="pointer-events-none fixed top-0 right-0 z-50 overflow-hidden"
            style={{ width: "150px", height: "150px" }}
          >
            <div className="absolute top-10 -right-8.75 w-50 rotate-45 bg-badge-info-bg py-1 text-center font-bold text-badge-info-text text-xs shadow-sm">
              {envLabel}
            </div>
          </div>
        )}
        <header className="flex justify-end px-4 py-3">
          <ThemeToggle />
        </header>
        {children}
      </body>
    </html>
  );
}
