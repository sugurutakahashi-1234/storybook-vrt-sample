import { cn } from "@ui/utils/cn";
import type { ButtonHTMLAttributes } from "react";

/** Button コンポーネントの Props */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** ボタンのサイズ（デフォルト: md） */
  size?: "sm" | "md" | "lg";
  /** ボタンのスタイルバリアント（デフォルト: primary） */
  variant?: "primary" | "secondary" | "danger";
}

/** バリアントごとの Tailwind CSS クラス定義 */
const variantStyles: Record<string, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover",
  secondary: "bg-secondary text-on-secondary hover:bg-secondary-hover",
  danger: "bg-danger text-on-danger hover:bg-danger-hover",
};

/** サイズごとの Tailwind CSS クラス定義 */
const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

/**
 * 汎用ボタンコンポーネント
 *
 * 3つのバリアント（primary / secondary / danger）と3つのサイズ（sm / md / lg）を提供する。
 * HTML の button 要素の全属性を透過的に受け付ける。
 */
export const Button = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) => (
  <button
    type="button"
    className={cn(
      "inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-ring-offset disabled:pointer-events-none disabled:opacity-50",
      variantStyles[variant],
      sizeStyles[size],
      className
    )}
    {...props}
  >
    {children}
  </button>
);
