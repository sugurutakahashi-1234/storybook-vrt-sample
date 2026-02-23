/**
 * ルートレイアウト
 *
 * Next.js App Router の最上位レイアウト。
 * 全ページに共通する HTML 構造、メタデータ、グローバルスタイルを定義する。
 */
import type { Metadata } from "next";
import "./globals.css";
import { ThemeToggle } from "@storybook-vrt-sample/ui";
import { formatPageTitle } from "./utils/format";

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
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased dark:bg-gray-900 dark:text-gray-100">
        <header className="flex justify-end px-4 py-3">
          <ThemeToggle />
        </header>
        {children}
      </body>
    </html>
  );
}
