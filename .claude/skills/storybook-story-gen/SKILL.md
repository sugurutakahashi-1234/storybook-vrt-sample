---
name: storybook-story-gen
description: Storybook MCP を活用してコンポーネントのストーリーファイルを CSF3 形式で作成する
allowed-tools: mcp__storybook-mcp__*, Read, Edit, Write, Bash(bun run storybook), Bash(bun run storybook:*), Glob, Grep
---

# ストーリー作成補助スキル

Storybook MCP を活用して、指定されたコンポーネントのストーリーファイルを CSF3 形式で作成する。

## 前提条件

- Storybook dev サーバーが起動していること（`cd packages/ui && bun run storybook`）
- Storybook MCP サーバーが利用可能であること

## 手順

### 1. プロジェクト規約の取得

Storybook MCP の `get_ui_building_instructions` ツールを呼び出し、プロジェクトのストーリー作成規約を取得する。

### 2. コンポーネントの調査

- 対象コンポーネントのソースコードを Read で確認する
- コンポーネントの props、バリエーション、使用パターンを把握する
- 既存の類似ストーリーファイルがあれば参照し、プロジェクトの慣習に合わせる

### 3. ストーリーファイルの作成

以下の形式で CSF3 形式のストーリーファイルを作成する:

```ts
import type { Meta, StoryObj } from "@storybook/react";
import { ComponentName } from "./ComponentName";

const meta = {
  component: ComponentName,
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variant: Story = {
  args: {
    // props
  },
};
```

### 4. プレビューの確認

Storybook MCP の `preview-stories` ツールを呼び出し、作成したストーリーのプレビュー URL を取得する。URL をユーザーに提示して目視確認を促す。
