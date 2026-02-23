import { cn } from "@ui/utils/cn";
import type { HTMLAttributes } from "react";
import { formatCount } from "./format-count";

/** Badge コンポーネントの Props */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** 表示する件数（指定時は formatCount でフォーマットされる） */
  count?: number;
  /** 件数の表示上限（デフォルト: 99）。超過時は "99+" のように表示 */
  maxCount?: number;
  /** バッジのスタイルバリアント（デフォルト: info） */
  variant?: "info" | "success" | "warning" | "error";
}

/** バリアントごとの Tailwind CSS クラス定義 */
const variantStyles: Record<string, string> = {
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  warning:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
};

/**
 * バッジコンポーネント
 *
 * ステータスやラベルをインラインで表示するための小さなタグ。
 * info / success / warning / error の4バリアントを提供する。
 */
export function Badge({
  variant = "info",
  className,
  count,
  maxCount,
  children,
  ...props
}: BadgeProps) {
  const formattedCount =
    count !== undefined ? formatCount(count, maxCount) : undefined;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {formattedCount || children}
    </span>
  );
}
