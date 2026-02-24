import { cn } from "@ui/utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

/** Card コンポーネントの Props */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** カードのヘッダー部分に表示するコンテンツ（省略可） */
  header?: ReactNode;
  /** カードのスタイルバリアント（デフォルト: default） */
  variant?: "default" | "outlined";
}

/** バリアントごとの Tailwind CSS クラス定義 */
const variantStyles: Record<string, string> = {
  default: "bg-surface shadow-md dark:shadow-shadow-dark/50",
  outlined: "bg-surface border border-border",
};

/**
 * カードコンポーネント
 *
 * コンテンツをグルーピングして表示するためのコンテナ。
 * default（シャドウ付き）と outlined（ボーダー付き）の2バリアントを提供する。
 * header を指定するとヘッダー部分が表示される。
 */
export function Card({
  variant = "default",
  header,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {header && (
        <div className="border-border-subtle border-b px-6 py-4 font-semibold text-on-background">
          {header}
        </div>
      )}
      <div className="px-6 py-4 text-on-surface">{children}</div>
    </div>
  );
}
