/**
 * ページストーリー用のカスタム Docs page。
 * JSDoc の Description + プライマリストーリーのみ表示する。
 * MSW ベースのページストーリーは Docs モードの同一 iframe で
 * ハンドラーが競合するため、STORIES セクションは表示しない。
 */
import { Description, Primary, Title } from "@storybook/addon-docs/blocks";

export const PageDocsPage = () => (
  <>
    <Title />
    <Description />
    <Primary />
  </>
);
