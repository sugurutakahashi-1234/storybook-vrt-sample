# CLAUDE.md

## デザイントークン

- 色の指定には必ずセマンティックカラートークンを使用する（`bg-primary`, `text-on-surface` 等）
- Tailwind のデフォルトカラー（`bg-blue-500`, `text-gray-600` 等）はビルドで無効化されているため使用不可
- 新しい色が必要な場合は `packages/ui/src/styles.css` の `@theme` にトークンを追加する
- 利用可能なトークン一覧は Storybook の「Foundations/Color Palette」で確認できる
