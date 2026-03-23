import { Button } from "@ui/components/Button";
import { cn } from "@ui/utils/cn";
import type { HTMLAttributes } from "react";

/** ErrorBanner コンポーネントの Props */
export interface ErrorBannerProps extends HTMLAttributes<HTMLDivElement> {
  /** エラーメッセージ */
  message: string;
  /** Retry ボタン押下時のコールバック（未指定時はボタン非表示） */
  onRetry?: () => void;
}

/**
 * エラーバナーコンポーネント
 *
 * エラーメッセージをインラインで表示する。
 * onRetry を渡すと Retry ボタンも表示される。
 */
export const ErrorBanner = ({
  message,
  onRetry,
  className,
  ...props
}: ErrorBannerProps) => (
  <div
    role="alert"
    className={cn(
      "flex items-center justify-between rounded-md bg-badge-error-bg px-3 py-2 text-sm text-badge-error-text",
      className
    )}
    {...props}
  >
    <span>{message}</span>
    {onRetry && (
      <Button size="sm" onClick={onRetry}>
        Retry
      </Button>
    )}
  </div>
);
