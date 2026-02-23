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
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400",
  secondary:
    "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
  danger:
    "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400",
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
export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus:ring-offset-gray-900",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
