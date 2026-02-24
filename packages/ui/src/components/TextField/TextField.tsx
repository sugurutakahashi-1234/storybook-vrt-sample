import { cn } from "@ui/utils/cn";
import type { InputHTMLAttributes } from "react";
import { useId } from "react";

/** TextField コンポーネントの Props */
export interface TextFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
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
  default: "border-border-input bg-surface text-on-background",
  outlined: "border-border-input-strong bg-transparent text-on-background",
};

/**
 * テキスト入力コンポーネント
 *
 * ラベル、エラー表示、ヘルパーテキストを備えた入力フィールド。
 * default / outlined の2バリアントを提供する。
 */
export const TextField = ({
  label,
  error,
  helperText,
  variant = "default",
  className,
  id: externalId,
  ...props
}: TextFieldProps) => {
  const generatedId = useId();
  const id = externalId ?? generatedId;

  const getAriaDescribedBy = () => {
    if (error) {
      return `${id}-error`;
    }
    if (helperText) {
      return `${id}-helper`;
    }
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <label className="font-medium text-on-surface text-sm" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        aria-describedby={getAriaDescribedBy()}
        aria-invalid={error ? true : undefined}
        className={cn(
          "rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-ring-offset disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-error focus:ring-error" : variantStyles[variant]
        )}
        id={id}
        {...props}
      />
      {error && (
        <p className="text-error-text text-sm" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p className="text-on-surface-muted text-sm" id={`${id}-helper`}>
          {helperText}
        </p>
      )}
    </div>
  );
};
