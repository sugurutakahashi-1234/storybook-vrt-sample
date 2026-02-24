const SITE_NAME = "Storybook VRT Sample";

/**
 * ページタイトルをサイト名付きでフォーマットする
 *
 * @param pageName - ページ名。省略または空文字の場合はサイト名のみ返す
 * @returns フォーマット済みタイトル
 */
export const formatPageTitle = (pageName?: string): string => {
  if (!pageName) {
    return SITE_NAME;
  }
  return `${pageName} | ${SITE_NAME}`;
};
