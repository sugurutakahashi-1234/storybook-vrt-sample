---
name: vrt-analyze
description: ローカル VRT（Visual Regression Testing）を実行し、main ブランチとのスクリーンショット差分が妥当かを分析する。ユーザーが「VRT 回して」「スクリーンショット差分見て」「ビジュアルリグレッション確認して」「UI の変更が正しいか確認して」と言ったとき、または UI コンポーネントを変更した後に視覚的な影響を確認したいときに使う。
allowed-tools: Bash(bun run *), Bash(git diff *), Bash(git log *), Bash(git merge-base *), Read, Glob, Grep
---

# VRT 差分分析スキル

ローカルで Storybook VRT を実行し、main ブランチとのスクリーンショット差分を分析して妥当性を判定する。

分析の詳細な手順（.reg ディレクトリ構造、out.json スキーマ、差分確認方法、判定カテゴリ、レポートフォーマット）は `references/reg-analysis-guide.md` を参照すること。

## 手順

### 1. VRT 実行

`packages/ui` ディレクトリで以下を実行する:

```bash
cd packages/ui && bun run storybook:reg:local
```

このコマンドは以下を一括実行する:

- main ブランチの baseline スクリーンショットを `.reg/expected/` に取得
- vitest browser mode でスクリーンショット撮影（`.reg/actual/` に保存）
- reg-cli で expected vs actual を比較し `.reg/out.json` と `.reg/diff/` を生成

差分検出時は reg-cli が exit code 1 を返すが、これは正常動作。

### 2. 差分サマリー取得

`packages/ui/.reg/out.json` を Read で読み取り、差分を集計する。手順は `references/reg-analysis-guide.md` の「差分サマリー取得」に従う。

### 3. 差分の詳細分析

差分がある場合:

1. `git diff main -- packages/ui/` でソースコード変更を確認
2. `references/reg-analysis-guide.md` の「スクリーンショット差分の確認」に従い差分画像を確認
3. ソースコード変更と視覚的差分を照合し、各差分が変更の意図に合致しているかを分析

### 4. 判定結果の出力

`references/reg-analysis-guide.md` の「レポートフォーマット」に従い、タイトルを「VRT 差分分析レポート」として出力する。
