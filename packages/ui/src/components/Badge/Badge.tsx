import { cn } from "@ui/utils/cn";
import { cv } from "css-variants";
import type { HTMLAttributes } from "react";

import { formatCount } from "./format-count";

export const badgeVariants = cv({
  base: "inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs",
  variants: {
    variant: {
      info: "bg-badge-info-bg text-badge-info-text",
      success: "bg-badge-success-bg text-badge-success-text",
      warning: "bg-badge-warning-bg text-badge-warning-text",
      error: "bg-badge-error-bg text-badge-error-text",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

/** Badge コンポーネントの Props */
export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  Parameters<typeof badgeVariants>[0] & {
    /** 表示する件数（指定時は formatCount でフォーマットされる） */
    count?: number;
    /** 件数の表示上限（デフォルト: 99）。超過時は "99+" のように表示 */
    maxCount?: number;
  };

/**
 * バッジコンポーネント
 *
 * ステータスやラベルをインラインで表示するための小さなタグ。
 * info / success / warning / error の4バリアントを提供する。
 */
export const Badge = ({
  variant,
  className,
  count,
  maxCount,
  children,
  ...props
}: BadgeProps) => {
  const formattedCount =
    count !== undefined ? formatCount(count, maxCount) : undefined;

  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {formattedCount || children}
    </span>
  );
};
