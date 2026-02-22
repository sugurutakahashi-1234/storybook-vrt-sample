/**
 * @storybook-vrt-sample/ui パッケージのエントリーポイント
 *
 * 共有 UI コンポーネントとその型定義を re-export する。
 * apps/web から import { Button } from "@storybook-vrt-sample/ui" のように使用される。
 */

export type { BadgeProps } from "./components/Badge";
// Badge コンポーネント: Info / Success / Warning / Error の4バリアント
export { Badge } from "./components/Badge";
export type { ButtonProps } from "./components/Button";
// Button コンポーネント: Primary / Secondary / Danger の3バリアント、3サイズ対応
export { Button } from "./components/Button";
export type { CardProps } from "./components/Card";
// Card コンポーネント: Default（シャドウ）/ Outlined（ボーダー）の2バリアント
export { Card } from "./components/Card";
// ユーティリティ: クラス名結合（clsx + tailwind-merge）
export { cn } from "./utils/cn";
// ユーティリティ: カウント表示フォーマット
export { formatCount } from "./utils/format-count";
