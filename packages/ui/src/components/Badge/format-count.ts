/**
 * 通知バッジの件数を上限付きでフォーマットする
 *
 * @param count - 表示する件数
 * @param max - 表示上限（デフォルト: 99）。超過時は "99+" のように表示
 * @returns フォーマット済み文字列。0以下の場合は空文字
 */
export const formatCount = (count: number, max = 99): string => {
  if (count <= 0) {
    return "";
  }
  if (count > max) {
    return `${max}+`;
  }
  return String(count);
};
