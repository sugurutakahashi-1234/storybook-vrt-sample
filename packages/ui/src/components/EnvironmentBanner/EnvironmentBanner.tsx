import { cn } from "@ui/utils/cn";
import { cv } from "css-variants";
import type { HTMLAttributes } from "react";

const envTagVariants = cv({
  base: "rounded-b px-3 py-0.5",
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

/** バナーに表示する個々のタグ */
export type EnvironmentBannerItem = Parameters<typeof envTagVariants>[0] & {
  /** 表示テキスト */
  label: string;
};

/** EnvironmentBanner コンポーネントの Props */
export interface EnvironmentBannerProps extends HTMLAttributes<HTMLDivElement> {
  /** 表示するタグの配列 */
  items: EnvironmentBannerItem[];
}

/**
 * 環境バナーコンポーネント
 *
 * 画面上部に半透明でオーバーレイ表示される薄いバー。
 * 現在の環境名（staging, PR-123 など）や MSW モック状態を表示する。
 * pointer-events-none でコンテンツ操作を妨げない。
 */
export const EnvironmentBanner = ({
  items,
  className,
  ...props
}: EnvironmentBannerProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "pointer-events-none fixed top-0 right-0 left-0 z-50 flex h-6 items-center justify-center gap-3 text-xs font-bold",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <span
          key={item.label}
          className={envTagVariants({ variant: item.variant })}
        >
          {item.label}
        </span>
      ))}
    </div>
  );
};
