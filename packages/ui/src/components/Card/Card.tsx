import { cn } from "@ui/utils/cn";
import { cv } from "css-variants";
import type { HTMLAttributes, ReactNode } from "react";

const cardVariants = cv({
  base: "overflow-hidden rounded-lg",
  variants: {
    variant: {
      default: "bg-surface shadow-md dark:shadow-shadow-dark/50",
      outlined: "bg-surface border border-border",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/** Card コンポーネントの Props */
export type CardProps = HTMLAttributes<HTMLDivElement> &
  Parameters<typeof cardVariants>[0] & {
    /** カードのヘッダー部分に表示するコンテンツ（省略可） */
    header?: ReactNode;
  };

/**
 * カードコンポーネント
 *
 * コンテンツをグルーピングして表示するためのコンテナ。
 * default（シャドウ付き）と outlined（ボーダー付き）の2バリアントを提供する。
 * header を指定するとヘッダー部分が表示される。
 */
export const Card = ({
  variant,
  header,
  className,
  children,
  ...props
}: CardProps) => (
  <div className={cn(cardVariants({ variant }), className)} {...props}>
    {header && (
      <div className="border-border-subtle border-b px-6 py-4 font-semibold text-on-background">
        {header}
      </div>
    )}
    <div className="px-6 py-4 text-on-surface">{children}</div>
  </div>
);
