/**
 * Alert コンポーネントの Storybook ストーリー定義
 *
 * css-variants の scv()（Slot Class Variants）のショーケース。
 * 1つの severity バリアントで5スロットのスタイルを一括制御する。
 */
import { fn } from "storybook/test";

import preview from "#.storybook/preview";

import { Alert } from "./Alert";

const meta = preview.meta({
  title: "Components/Alert",
  component: Alert,
  argTypes: {
    severity: {
      control: "select",
      options: ["info", "success", "warning", "error"],
    },
  },
});

/** Info（デフォルト） */
export const Info = meta.story({
  args: {
    title: "お知らせ",
    description: "新しいバージョンが利用可能です。",
    severity: "info",
  },
});

/** Success */
export const Success = meta.story({
  args: {
    title: "完了",
    description: "変更が正常に保存されました。",
    severity: "success",
  },
});

/** Warning */
export const Warning = meta.story({
  args: {
    title: "注意",
    description: "この操作は元に戻せません。",
    severity: "warning",
  },
});

/** Error */
export const ErrorVariant = meta.story({
  name: "Error",
  args: {
    title: "エラーが発生しました",
    description:
      "サーバーとの通信に失敗しました。しばらくしてから再度お試しください。",
    severity: "error",
  },
});

/** タイトルのみ（description なし） */
export const TitleOnly = meta.story({
  args: {
    title: "処理が完了しました",
    severity: "success",
  },
});

/** 閉じるボタン付き */
export const Dismissible = meta.story({
  args: {
    title: "Cookie の使用について",
    description: "このサイトでは Cookie を使用しています。",
    severity: "info",
    onClose: fn(),
  },
});
