# CLAUDE.md

## デザイントークン

- 色の指定には必ずセマンティックカラートークンを使用する（`bg-primary`, `text-on-surface` 等）
- Tailwind のデフォルトカラー（`bg-blue-500`, `text-gray-600` 等）はビルドで無効化されているため使用不可
- 新しい色が必要な場合は `packages/ui/src/styles.css` の `@theme` にトークンを追加する
- 利用可能なトークン一覧は Storybook の「Foundations/Color Palette」で確認できる

## Storybook MCP

- UI コンポーネント開発時は Storybook MCP を活用してストーリーを作成すること
- Storybook dev サーバー（`cd packages/ui && bun run storybook`）の起動が前提条件
- `/storybook-story-gen` skill でストーリー作成、`/storybook-preview` skill でプレビュー確認が可能
