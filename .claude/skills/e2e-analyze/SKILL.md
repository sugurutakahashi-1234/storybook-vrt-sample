---
name: e2e-analyze
description: ローカル E2E テストを実行し、main ブランチとのスクリーンショット差分が妥当かを分析する
allowed-tools: Bash(bun run *), Bash(git diff *), Bash(git log *), Bash(git merge-base *), Read, Glob, Grep
---

# E2E 差分分析スキル

ローカルで E2E テストを実行し、main ブランチとのスクリーンショット差分を分析して妥当性を判定する。

## .reg ディレクトリ構造

テスト実行後に `apps/web/.reg/` に以下が生成される:

```
.reg/
├── out.json          # reg-cli の比較結果（差分サマリー）
├── expected/         # main ブランチの baseline スクリーンショット
├── actual/           # 現在のブランチのスクリーンショット
├── diff/             # 差分ハイライト画像（変更箇所が赤く表示）
└── report/
    └── index.html    # ブラウザで確認できるレポート
```

### out.json の構造

```json
{
  "failedItems": ["home.spec.ts/Home-Page-xxx-1.png", ...], // 差分が検出された画像
  "newItems": [...],                                          // 新規追加された画像（expected にない）
  "deletedItems": [...],                                      // 削除された画像（actual にない）
  "passedItems": [...],                                       // 差分なしの画像
  "expectedItems": [...],                                     // expected 内の全画像
  "actualItems": [...],                                       // actual 内の全画像
  "diffItems": ["home.spec.ts/Home-Page-xxx-1.png", ...],    // diff 画像が生成された画像
  "actualDir": "./actual",
  "expectedDir": "./expected",
  "diffDir": "./diff"
}
```

## 手順

### 1. E2E テスト実行

`apps/web` ディレクトリで以下を実行する:

```bash
cd apps/web && bun run e2e:report:reg:local
```

このコマンドは以下を一括実行する:
- `e2e:baseline:local`: main ブランチの baseline スクリーンショットを `.reg/expected/` に取得
- `e2e:playwright`: Playwright E2E テスト実行（`.reg/actual/` にスクリーンショット保存）
- `e2e:report:reg`: reg-cli で expected vs actual を比較し `.reg/out.json` と `.reg/diff/` を生成

差分検出時は reg-cli が exit code 1 を返すが、これは正常動作。

### 2. 差分サマリー取得

`apps/web/.reg/out.json` を Read で読み取り、以下を集計する:
- `failedItems`（changed）: 差分が検出された画像
- `newItems`: 新規追加された画像
- `deletedItems`: 削除された画像
- `passedItems`: 差分なしの画像

差分がない場合（failedItems / newItems / deletedItems がすべて空）は「差分なし - すべてのスクリーンショットが main ブランチと一致しています」と報告して終了する。

### 3. 差分の詳細分析

差分がある場合、以下を実施する:

#### 3a. ソースコード変更の確認

```bash
git diff main -- apps/web/ packages/ui/
```

を実行し、アプリケーションコードおよび依存する UI コンポーネントの変更内容を把握する。
E2E テストは `packages/ui` の変更にも影響を受けるため、両方のディレクトリを確認する。

#### 3b. スクリーンショット差分の確認

**まず diff 画像を優先的に確認する。** diff 画像は変更箇所が赤くハイライトされており、これだけで差分の性質を把握できることが多い。diff 画像だけでは判断が難しい場合のみ expected（main 版）と actual（現在版）を追加で確認する。

各 failedItem について:
- `.reg/diff/<name>` （差分ハイライト画像）を Read で確認（必須）
- `.reg/expected/<name>` と `.reg/actual/<name>` は diff 画像だけでは不明な場合のみ確認

各 newItem について:
- `.reg/actual/<name>` を Read で確認

各 deletedItem について:
- `.reg/expected/<name>` を Read で確認

#### 3c. コード変更と視覚的差分の対応分析

ソースコードの変更内容と視覚的差分を照合し、各差分が変更の意図に合致しているかを分析する。
E2E テストではページ全体のスクリーンショットを取得するため、UI コンポーネントの変更がページ内のどの部分に影響しているかも確認する。

### 4. 判定結果の出力

以下のフォーマットでレポートを出力する:

```
## E2E 差分分析レポート

### サマリー
- Changed: N 件
- New: N 件
- Deleted: N 件
- Passed: N 件

### 分析結果

| スクリーンショット | 差分タイプ | 判定 | 理由 |
|---|---|---|---|
| PageName/ScenarioName | changed | 意図的な変更 | packages/ui の○○変更がページ内のボタンに反映 |
| ... | new | 意図的な追加 | 新規ページ追加に伴う新規スクリーンショット |
| ... | changed | 要確認 | コード変更と無関係な差分が検出 |

### 総合判定
（すべて意図的 / 要確認あり の判定を記載）
```

判定カテゴリ:
- **意図的な変更**: コード変更と視覚的差分が明確に対応している
- **意図的な追加**: 新規ページやシナリオの追加に伴う新規スクリーンショット
- **意図的な削除**: ページやシナリオの削除に伴うスクリーンショットの削除
- **予期せぬ差分**: コード変更と無関係な視覚的差分が検出された
- **要確認**: 対応関係が不明確で人間の確認が必要
