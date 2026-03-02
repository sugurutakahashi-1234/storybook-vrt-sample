---
name: storybook-preview
description: Storybook のストーリーをブラウザで開いてスクリーンショット撮影し、表示状態を確認する
allowed-tools: mcp__storybook-mcp__*, mcp__plugin_web-dev-plugin_chrome-devtools__take_screenshot, mcp__plugin_web-dev-plugin_chrome-devtools__take_snapshot, mcp__plugin_web-dev-plugin_chrome-devtools__navigate_page, mcp__plugin_web-dev-plugin_chrome-devtools__list_pages, mcp__plugin_web-dev-plugin_chrome-devtools__select_page, mcp__plugin_web-dev-plugin_chrome-devtools__wait_for, Read, Glob, Grep
---

# ストーリープレビュー確認スキル

Storybook MCP とブラウザ（Chrome DevTools MCP）を使い、ストーリーの表示状態を確認する。

## 前提条件

- Storybook dev サーバーが起動していること（`cd packages/ui && bun run storybook`）
- Storybook MCP サーバーが利用可能であること
- Chrome DevTools MCP が利用可能であること

## 手順

### 1. ストーリー一覧の取得

Storybook MCP の `list-all-documentation` ツールを呼び出し、利用可能なストーリーの一覧を取得する。

### 2. 対象ストーリーの特定

ユーザーが指定したコンポーネント名やストーリー名から、対象のストーリーを特定する。指定がない場合はストーリー一覧を提示して選択を促す。

### 3. プレビュー URL の取得

Storybook MCP の `preview-stories` ツールを使い、対象ストーリーのプレビュー URL を取得する。

### 4. ブラウザでの表示確認

Chrome DevTools MCP を使い、以下の手順でストーリーを確認する:

1. `navigate_page` でプレビュー URL を開く
2. `wait_for` でコンテンツの読み込みを待つ
3. `take_screenshot` でスクリーンショットを撮影する

### 5. 確認レポートの出力

以下の情報を含むレポートを出力する:

- 確認したストーリー名
- スクリーンショット
- 表示状態の所見（レイアウト崩れ、スタイル欠落などの有無）
