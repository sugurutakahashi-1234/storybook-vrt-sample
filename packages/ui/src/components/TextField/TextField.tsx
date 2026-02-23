import { cn } from "@ui/utils/cn";
import type { InputHTMLAttributes } from "react";
import { useId } from "react";

/** TextField コンポーネントの Props */
export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** エラーメッセージ（指定時はエラースタイルが適用される） */
  error?: string;
  /** 補足テキスト（入力フィールドの下に表示） */
  helperText?: string;
  /** ラベルテキスト */
  label?: string;
  /** スタイルバリアント（デフォルト: default） */
  variant?: "default" | "outlined";
}

/** バリアントごとの Tailwind CSS クラス定義 */
const variantStyles: Record<string, string> = {
  default: "border-gray-300 bg-white",
  outlined: "border-gray-400 bg-transparent",
};

/**
 * テキスト入力コンポーネント
 *
 * ラベル、エラー表示、ヘルパーテキストを備えた入力フィールド。
 * default / outlined の2バリアントを提供する。
 */
export function TextField({
  label,
  error,
  helperText,
  variant = "default",
  className,
  id: externalId,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const id = externalId ?? generatedId;

  const getAriaDescribedBy = () => {
    if (error) {
      return `${id}-error`;
    }
    if (helperText) {
      return `${id}-helper`;
    }
    return undefined;
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <label className="font-medium text-gray-700 text-sm" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        aria-describedby={getAriaDescribedBy()}
        aria-invalid={error ? true : undefined}
        className={cn(
          "rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-red-500 focus:ring-red-500" : variantStyles[variant]
        )}
        id={id}
        {...props}
      />
      {error && (
        <p className="text-red-600 text-sm" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p className="text-gray-500 text-sm" id={`${id}-helper`}>
          {helperText}
        </p>
      )}
    </div>
  );
}
