---
name: e2e-analyze
description: ローカル E2E テスト（Playwright）を実行し、main ブランチとのスクリーンショット差分が妥当かを分析する。ユーザーが「E2E の差分見て」「ページのスクリーンショット確認して」「E2E リグレッション確認して」と言ったとき、またはアプリケーションや UI コンポーネントを変更した後にページ全体への視覚的影響を確認したいときに使う。
allowed-tools: Bash(bun run *), Bash(git diff *), Bash(git log *), Bash(git merge-base *), Read, Glob, Grep
---

# E2E 差分分析スキル

ローカルで E2E テストを実行し、main ブランチとのスクリーンショット差分を分析して妥当性を判定する。

分析の詳細な手順（.reg ディレクトリ構造、out.json スキーマ、差分確認方法、判定カテゴリ、レポートフォーマット）は VRT スキルの `../vrt-analyze/references/reg-analysis-guide.md` を参照すること。

## 手順

### 1. E2E テスト実行

`apps/web` ディレクトリで以下を実行する:

```bash
cd apps/web && bun run e2e:reg:local
```

このコマンドは以下を一括実行する:

- main ブランチの baseline スクリーンショットを `.reg/expected/` に取得
- Playwright E2E テスト実行（`.reg/actual/` にスクリーンショット保存）
- reg-cli で expected vs actual を比較し `.reg/out.json` と `.reg/diff/` を生成

差分検出時は reg-cli が exit code 1 を返すが、これは正常動作。

### 2. 差分サマリー取得

`apps/web/.reg/out.json` を Read で読み取り、差分を集計する。手順は `../vrt-analyze/references/reg-analysis-guide.md` の「差分サマリー取得」に従う。

### 3. 差分の詳細分析

差分がある場合:

1. `git diff main -- apps/web/ packages/ui/` でソースコード変更を確認（E2E は `packages/ui` の変更にも影響を受けるため両方確認する）
2. `../vrt-analyze/references/reg-analysis-guide.md` の「スクリーンショット差分の確認」に従い差分画像を確認
3. ソースコード変更と視覚的差分を照合し、各差分が変更の意図に合致しているかを分析（ページ全体のスクリーンショットなので、UI コンポーネントの変更がページ内のどの部分に影響しているかも確認する）

### 4. 判定結果の出力

`../vrt-analyze/references/reg-analysis-guide.md` の「レポートフォーマット」に従い、タイトルを「E2E 差分分析レポート」として出力する。
