"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";

/** テーマの種類 */
export type Theme = "light" | "dark";

/** テーマ設定に基づいて html 要素の dark クラスを更新する */
const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
};

/**
 * テーマ切り替えボタン
 *
 * light ↔ dark の2状態をトグルする。
 * 初回表示時に localStorage に値がなければ OS のカラースキームから初期値を決定する。
 */
export const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    let initial: Theme;
    if (stored === "light" || stored === "dark") {
      initial = stored;
    } else {
      initial = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    setTheme(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "light" ? "dark" : "light";
      applyTheme(next);
      localStorage.setItem("theme", next);
      return next;
    });
  }, []);

  // マウント前はレイアウトシフトを防ぐためプレースホルダーを表示
  if (!mounted) {
    return <div className="h-10 w-10" />;
  }

  const label = theme === "light" ? "ライト" : "ダーク";

  return (
    <button
      aria-label={`テーマ: ${label}（クリックで切り替え）`}
      className="rounded-lg p-2 text-interactive-muted transition-colors hover:bg-interactive-hover"
      onClick={toggle}
      type="button"
    >
      {theme === "light" ? (
        <SunIcon className="h-6 w-6" />
      ) : (
        <MoonIcon className="h-6 w-6" />
      )}
    </button>
  );
};
