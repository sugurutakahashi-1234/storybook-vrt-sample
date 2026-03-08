# reg-cli 差分分析ガイド（共通リファレンス）

VRT・E2E 両スキルで共通の分析手順。

## .reg ディレクトリ構造

```
.reg/
├── out.json          # reg-cli の比較結果（差分サマリー）
├── expected/         # main ブランチの baseline スクリーンショット
├── actual/           # 現在のブランチのスクリーンショット
├── diff/             # 差分ハイライト画像（変更箇所が赤く表示）
└── report/
    └── index.html    # ブラウザで確認できるレポート
```

## out.json の構造

```json
{
  "failedItems": [...],     // 差分が検出された画像
  "newItems": [...],         // 新規追加された画像（expected にない）
  "deletedItems": [...],     // 削除された画像（actual にない）
  "passedItems": [...],      // 差分なしの画像
  "expectedItems": [...],    // expected 内の全画像
  "actualItems": [...],      // actual 内の全画像
  "diffItems": [...],        // diff 画像が生成された画像
  "actualDir": "./actual",
  "expectedDir": "./expected",
  "diffDir": "./diff"
}
```

## 差分サマリー取得

out.json を Read で読み取り、以下を集計する:

- `failedItems`（changed）: 差分が検出された画像
- `newItems`: 新規追加された画像
- `deletedItems`: 削除された画像
- `passedItems`: 差分なしの画像

差分がない場合（failedItems / newItems / deletedItems がすべて空）は「差分なし」と報告して終了する。

## スクリーンショット差分の確認

**まず diff 画像を優先的に確認する。** diff 画像は変更箇所が赤くハイライトされており、これだけで差分の性質を把握できることが多い。diff 画像だけでは判断が難しい場合のみ expected（main 版）と actual（現在版）を追加で確認する。

各 failedItem について:

- `.reg/diff/<name>` を Read で確認（必須）
- `.reg/expected/<name>` と `.reg/actual/<name>` は diff 画像だけでは不明な場合のみ確認

各 newItem について:

- `.reg/actual/<name>` を Read で確認

各 deletedItem について:

- `.reg/expected/<name>` を Read で確認

## 判定カテゴリ

- **意図的な変更**: コード変更と視覚的差分が明確に対応している
- **意図的な追加**: 新規追加に伴う新規スクリーンショット
- **意図的な削除**: 削除に伴うスクリーンショットの削除
- **予期せぬ差分**: コード変更と無関係な視覚的差分が検出された
- **要確認**: 対応関係が不明確で人間の確認が必要

## レポートフォーマット

```
### サマリー
- Changed: N 件
- New: N 件
- Deleted: N 件
- Passed: N 件

### 分析結果

| スクリーンショット | 差分タイプ | 判定 | 理由 |
|---|---|---|---|
| Name | changed | 意図的な変更 | コードの○○変更に対応する差分 |

### 総合判定
（すべて意図的 / 要確認あり の判定を記載）
```
