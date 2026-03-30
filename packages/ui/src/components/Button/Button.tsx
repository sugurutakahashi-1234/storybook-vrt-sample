import { cn } from "@ui/utils/cn";
import { cv } from "css-variants";
import type { ButtonHTMLAttributes } from "react";

export const buttonVariants = cv({
  base: "inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-ring-offset disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      primary: "bg-primary text-on-primary hover:bg-primary-hover",
      secondary: "bg-secondary text-on-secondary hover:bg-secondary-hover",
      danger: "bg-danger text-on-danger hover:bg-danger-hover",
    },
    size: {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

/** Button コンポーネントの Props */
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  Parameters<typeof buttonVariants>[0];

/**
 * 汎用ボタンコンポーネント
 *
 * 3つのバリアント（primary / secondary / danger）と3つのサイズ（sm / md / lg）を提供する。
 * HTML の button 要素の全属性を透過的に受け付ける。
 */
export const Button = ({
  variant,
  size,
  className,
  children,
  ...props
}: ButtonProps) => (
  <button
    type="button"
    className={cn(buttonVariants({ variant, size }), className)}
    {...props}
  >
    {children}
  </button>
);
