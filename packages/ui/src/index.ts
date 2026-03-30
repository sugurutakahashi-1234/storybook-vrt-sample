/**
 * @storybook-vrt-sample/ui パッケージのエントリーポイント
 *
 * 共有 UI コンポーネントとその型定義を re-export する。
 * apps/web から import { Button } from "@storybook-vrt-sample/ui" のように使用される。
 */

export type { AlertProps } from "./components/Alert";
// Alert コンポーネント: scv() ショーケース — severity で5スロット一括制御
export { Alert } from "./components/Alert";
export type { BadgeProps } from "./components/Badge";
// Badge コンポーネント: Info / Success / Warning / Error の4バリアント
export { Badge, badgeVariants } from "./components/Badge";
export type { ButtonProps } from "./components/Button";
// Button コンポーネント: Primary / Secondary / Danger の3バリアント、3サイズ対応
export { Button, buttonVariants } from "./components/Button";
export type { CheckboxProps } from "./components/Checkbox";
// Checkbox コンポーネント: ラベル付きチェックボックス
export { Checkbox } from "./components/Checkbox";
export type { CardProps } from "./components/Card";
// Card コンポーネント: Default（シャドウ）/ Outlined（ボーダー）の2バリアント
export { Card } from "./components/Card";
export type { ChipProps } from "./components/Chip";
// Chip コンポーネント: compoundVariants ショーケース — variant × color の組み合わせスタイル
export { Chip } from "./components/Chip";
export type { ErrorBannerProps } from "./components/ErrorBanner";
// ErrorBanner コンポーネント: エラーメッセージ表示 + オプショナル Retry ボタン
export { ErrorBanner } from "./components/ErrorBanner";
export type {
  EnvironmentBannerItem,
  EnvironmentBannerProps,
} from "./components/EnvironmentBanner";
// EnvironmentBanner コンポーネント: 画面上部に環境情報タグをオーバーレイ表示
export { EnvironmentBanner } from "./components/EnvironmentBanner";
export type { TextFieldProps } from "./components/TextField";
// TextField コンポーネント: ラベル、エラー、ヘルパーテキスト対応の入力フィールド
export { TextField } from "./components/TextField";
export type { Theme } from "./components/ThemeToggle";
// ThemeToggle コンポーネント: system / light / dark の3状態テーマ切り替えボタン
export { ThemeToggle } from "./components/ThemeToggle";
export type { TodoListProps } from "./components/TodoList";
// TodoList コンポーネント: props ベースの Presentational コンポーネント
export { TodoList } from "./components/TodoList";
// ユーティリティ: クラス名結合（clsx + tailwind-merge）
export { cn } from "./utils/cn";
