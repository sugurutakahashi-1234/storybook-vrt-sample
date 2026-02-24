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
  info: "bg-badge-info-bg text-badge-info-text",
  success: "bg-badge-success-bg text-badge-success-text",
  warning: "bg-badge-warning-bg text-badge-warning-text",
  error: "bg-badge-error-bg text-badge-error-text",
};

/**
 * バッジコンポーネント
 *
 * ステータスやラベルをインラインで表示するための小さなタグ。
 * info / success / warning / error の4バリアントを提供する。
 */
export const Badge = ({
  variant = "info",
  className,
  count,
  maxCount,
  children,
  ...props
}: BadgeProps) => {
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
};
