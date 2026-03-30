import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@ui/utils/cn";
import { scv } from "css-variants";
import type { HTMLAttributes, ReactNode } from "react";

/**
 * scv() — Slot Class Variants
 *
 * 【いつ使うか】
 * 1つのコンポーネントが複数の HTML 要素（スロット）で構成されていて、
 * variant に応じてそれぞれのスロットのスタイルを連動して切り替えたいとき。
 * 例: Alert の root(背景色), icon(アイコン色), title(文字色) を severity で一括切替
 *
 * 【cva ではどうなるか】
 * cva は単一要素にしか対応しないため、以下のいずれかが必要だった:
 *   1. スロットごとに個別の cva() を定義（alertRootVariants, alertIconVariants, ...）
 *   2. variant の値を手動で条件分岐して各要素に className を振る
 * どちらも variant の追加時に複数箇所を同期して修正する必要があり、バグの温床になる。
 *
 * 【scv() だと】
 * 1つの定義で全スロットの variant を一元管理。型推論もスロット単位で効く。
 */
const alertVariants = scv({
  slots: ["root", "icon", "title", "description", "close"],
  base: {
    root: "relative flex gap-3 rounded-lg border p-4",
    icon: "size-5 shrink-0 mt-0.5",
    title: "font-semibold text-sm",
    description: "text-sm mt-1",
    close:
      "absolute top-3 right-3 size-5 cursor-pointer rounded transition-colors",
  },
  variants: {
    severity: {
      info: {
        root: "border-badge-info-text/30 bg-badge-info-bg",
        icon: "text-badge-info-text",
        title: "text-badge-info-text",
        description: "text-badge-info-text",
        close: "text-badge-info-text/60 hover:text-badge-info-text",
      },
      success: {
        root: "border-badge-success-text/30 bg-badge-success-bg",
        icon: "text-badge-success-text",
        title: "text-badge-success-text",
        description: "text-badge-success-text",
        close: "text-badge-success-text/60 hover:text-badge-success-text",
      },
      warning: {
        root: "border-badge-warning-text/30 bg-badge-warning-bg",
        icon: "text-badge-warning-text",
        title: "text-badge-warning-text",
        description: "text-badge-warning-text",
        close: "text-badge-warning-text/60 hover:text-badge-warning-text",
      },
      error: {
        root: "border-badge-error-text/30 bg-badge-error-bg",
        icon: "text-badge-error-text",
        title: "text-badge-error-text",
        description: "text-badge-error-text",
        close: "text-badge-error-text/60 hover:text-badge-error-text",
      },
    },
  },
  defaultVariants: {
    severity: "info",
  },
});

const severityIcons = {
  info: InformationCircleIcon,
  success: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
  error: XCircleIcon,
} as const;

/** Alert コンポーネントの Props */
export type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> &
  Parameters<typeof alertVariants>[0] & {
    /** アラートのタイトル */
    title: ReactNode;
    /** アラートの説明文（省略可） */
    description?: ReactNode;
    /** 閉じるボタンのコールバック（省略時は閉じるボタン非表示） */
    onClose?: () => void;
  };

/**
 * アラートコンポーネント — scv()（Slot Class Variants）のショーケース
 *
 * ## いつ使うか
 * 1つのコンポーネントが複数の HTML 要素（スロット）で構成されていて、
 * variant に応じてそれぞれのスロットのスタイルを **連動して** 切り替えたいとき。
 *
 * 例: Alert の root(背景色), icon(アイコン色), title(文字色), description(説明色), close(ボタン色) を `severity` で一括切替
 *
 * ## cva ではどうなるか
 * cva は単一要素にしか対応しないため、以下のいずれかが必要だった:
 * 1. スロットごとに個別の `cva()` を定義（`alertRootVariants`, `alertIconVariants`, ...）
 * 2. variant の値を手動で条件分岐して各要素に className を振る
 *
 * どちらも variant の追加時に **複数箇所を同期して修正** する必要があり、バグの温床になる。
 *
 * ## scv() だと
 * 1つの定義で全スロットの variant を一元管理。型推論もスロット単位で効く。
 */
export const Alert = ({
  severity,
  title,
  description,
  onClose,
  className,
  ...props
}: AlertProps) => {
  const classes = alertVariants({ severity });
  const Icon = severityIcons[severity ?? "info"];

  return (
    <div className={cn(classes.root, className)} role="alert" {...props}>
      <Icon className={classes.icon} />
      <div>
        <p className={classes.title}>{title}</p>
        {description && <p className={classes.description}>{description}</p>}
      </div>
      {onClose && (
        <button
          aria-label="閉じる"
          className={classes.close}
          onClick={onClose}
          type="button"
        >
          <XMarkIcon />
        </button>
      )}
    </div>
  );
};
