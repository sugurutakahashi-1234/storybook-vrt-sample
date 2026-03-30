import { XMarkIcon } from "@heroicons/react/20/solid";
import { cn } from "@ui/utils/cn";
import { cv } from "css-variants";
import type { HTMLAttributes, ReactNode } from "react";

/**
 * cv() + compoundVariants
 *
 * 【いつ使うか】
 * 2つ以上の variant 軸があり、その「組み合わせ」でスタイルが変わるとき。
 * 例: variant(filled/outlined) × color(5色) = 10通りのスタイルパターン
 *
 * 【compoundVariants なしだとどうなるか】
 * 各 variant の値を個別に定義するだけでは組み合わせのスタイルを表現できない。
 *   - filled の定義に背景色を書くと、全 color 共通の背景色しか指定できない
 *   - color: info の定義に背景色を書くと、outlined のときも同じ背景色になる
 * 結局コンポーネント内で `variant === "filled" && color === "info"` のような
 * 条件分岐を書くことになり、variant の追加で分岐が爆発する。
 *
 * 【補足】
 * compoundVariants 自体は cva にもある機能だが、キー名が異なる:
 *   - cva: `class` キー
 *   - css-variants: `className` キー
 */
const chipVariants = cv({
  base: "inline-flex items-center gap-1 rounded-full font-medium text-xs transition-colors",
  variants: {
    color: {
      default: "",
      info: "",
      success: "",
      warning: "",
      error: "",
    },
    size: {
      sm: "px-2 py-0.5 text-xs",
      md: "px-3 py-1 text-sm",
    },
    variant: {
      filled: "",
      outlined: "bg-transparent border",
    },
  },
  compoundVariants: [
    // filled × color — 背景色を適用
    {
      variant: "filled",
      color: "default",
      className: "bg-secondary text-on-secondary",
    },
    {
      variant: "filled",
      color: "info",
      className: "bg-badge-info-bg text-badge-info-text",
    },
    {
      variant: "filled",
      color: "success",
      className: "bg-badge-success-bg text-badge-success-text",
    },
    {
      variant: "filled",
      color: "warning",
      className: "bg-badge-warning-bg text-badge-warning-text",
    },
    {
      variant: "filled",
      color: "error",
      className: "bg-badge-error-bg text-badge-error-text",
    },
    // outlined × color — ボーダー色とテキスト色を適用
    {
      variant: "outlined",
      color: "default",
      className: "border-border text-on-surface",
    },
    {
      variant: "outlined",
      color: "info",
      className: "border-badge-info-text/40 text-badge-info-text",
    },
    {
      variant: "outlined",
      color: "success",
      className: "border-badge-success-text/40 text-badge-success-text",
    },
    {
      variant: "outlined",
      color: "warning",
      className: "border-badge-warning-text/40 text-badge-warning-text",
    },
    {
      variant: "outlined",
      color: "error",
      className: "border-badge-error-text/40 text-badge-error-text",
    },
  ],
  defaultVariants: {
    color: "default",
    size: "md",
    variant: "filled",
  },
});

/** Chip コンポーネントの Props */
export type ChipProps = HTMLAttributes<HTMLSpanElement> &
  Parameters<typeof chipVariants>[0] & {
    /** チップのラベル */
    label: ReactNode;
    /** 削除ボタンのコールバック（省略時は削除ボタン非表示） */
    onDelete?: () => void;
  };

/**
 * チップコンポーネント — cv() + compoundVariants のショーケース
 *
 * ## いつ使うか
 * 2つ以上の variant 軸があり、その **組み合わせ** でスタイルが変わるとき。
 *
 * 例: `variant`(filled/outlined) × `color`(5色) = 10通りのスタイルパターン
 *
 * ## compoundVariants なしだとどうなるか
 * 各 variant の値を個別に定義するだけでは組み合わせのスタイルを表現できない。
 * - `filled` の定義に背景色を書くと、全 color 共通の背景色しか指定できない
 * - `color: info` の定義に背景色を書くと、`outlined` のときも同じ背景色になる
 *
 * 結局コンポーネント内で `variant === 'filled' && color === 'info'` のような条件分岐を書くことになり、variant の追加で分岐が爆発する。
 *
 * ## 補足
 * compoundVariants 自体は cva にもある機能だが、キー名が異なる:
 * - cva: `class` キー
 * - css-variants: `className` キー
 */
export const Chip = ({
  color,
  size,
  variant,
  label,
  onDelete,
  className,
  ...props
}: ChipProps) => (
  <span
    className={cn(chipVariants({ color, size, variant }), className)}
    {...props}
  >
    {label}
    {onDelete && (
      <button
        aria-label="削除"
        className="inline-flex size-4 items-center justify-center rounded-full opacity-60 transition-opacity hover:opacity-100"
        onClick={onDelete}
        type="button"
      >
        <XMarkIcon className="size-3" />
      </button>
    )}
  </span>
);
