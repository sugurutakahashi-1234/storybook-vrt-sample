import { cn } from "@ui/utils/cn";
import type { InputHTMLAttributes } from "react";
import { useId } from "react";

/** Checkbox コンポーネントの Props */
export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> {
  /** チェックボックスの横に表示するラベルテキスト */
  label?: string;
}

/**
 * チェックボックスコンポーネント
 *
 * ラベル付きのチェックボックス。
 * HTML の input[type="checkbox"] の全属性を透過的に受け付ける。
 */
export const Checkbox = ({
  label,
  className,
  id: externalId,
  ...props
}: CheckboxProps) => {
  const generatedId = useId();
  const id = externalId ?? generatedId;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <input
        type="checkbox"
        id={id}
        className="size-4 accent-primary"
        aria-label={label || props["aria-label"]}
        {...props}
      />
      {label && (
        <label className="text-sm text-on-surface" htmlFor={id}>
          {label}
        </label>
      )}
    </div>
  );
};
