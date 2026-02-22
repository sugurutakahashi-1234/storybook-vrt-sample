# Playwright VRT + Storybook Sample

Playwright を使ったビジュアルリグレッションテスト（VRT）と E2E テストのサンプルプロジェクトです。

## 技術スタック

| 技術 | 用途 |
|------|------|
| Next.js 16 | アプリケーション |
| Storybook 10 | コンポーネントカタログ |
| Playwright | VRT + E2E テスト |
| reg-cli | VRT 差分 HTML レポート（スライド / オーバーレイ / 2up / ブレンド） |
| Tailwind CSS v4 | スタイリング |
| Ultracite (Biome) | リンター + フォーマッター |
| bun | パッケージマネージャー + モノレポ管理 |
| TypeScript | 型安全性 |

## プロジェクト構成

```
storybook-vrt-sample/
├── apps/
│   └── web/                  # Next.js アプリ + E2E テスト
├── packages/
│   └── ui/                   # 共有 UI コンポーネント + Storybook + VRT
└── .github/workflows/        # CI (VRT + E2E)
```

## セットアップ

```bash
# 依存関係インストール
bun install

# Playwright ブラウザインストール
cd packages/ui && bunx playwright install --with-deps && cd ../..
cd apps/web && bunx playwright install --with-deps && cd ../..
```

## 開発ワークフロー

### Storybook 開発

```bash
# Storybook 起動 (http://localhost:6006)
bun run storybook
```

### Next.js アプリ開発

```bash
# Next.js dev サーバー起動 (http://localhost:3000)
bun run dev
```

### リント & フォーマット

```bash
# リント + フォーマットチェック（CI 用）
bun run lint

# リント + フォーマット自動修正（ローカル開発用）
bun run lint:fix
```

## テスト

### ユニットテスト

純粋関数のユニットテストを `bun test` で実行します。

```bash
# 全パッケージのユニットテスト実行
bun run test
```

### Storybook VRT（ビジュアルリグレッションテスト）

コンポーネントの見た目が意図せず変わっていないかをスクリーンショット比較で検証します。

```bash
# VRT テスト実行（Storybook ビルド + スクリーンショット撮影）
bun run storybook:vrt
```

### E2E テスト

Next.js アプリに対するシナリオベースのテスト + ページ全体のスクリーンショット撮影です。

```bash
# E2E テスト実行（Next.js dev サーバーが自動起動）
bun run web:e2e:playwright
```

### reg-cli レポート

テスト実行時にスクリーンショットが `.reg/actual/` に自動保存されます。
CI（PR 時）ではベースブランチからベースラインを動的生成し、reg-cli で差分レポートを自動作成して GitHub Pages にデプロイします。

### スクリーンショット管理戦略

VRT / E2E テスト実行時、スクリーンショットは **2箇所** に保存されます。

| 保存先 | 用途 | 保存条件 |
|--------|------|----------|
| `vrt/screenshots/` / `e2e/screenshots/` | git 管理用（PR diff で視覚的変更を確認） | Mac（`darwin`）のみ |
| `.reg/actual/` | reg-cli 用（差分レポート生成） | 常に保存 |

**git 管理用は Mac のみ保存する理由:**
開発は Mac を前提としており、OS 間のレンダリング差異（フォント・アンチエイリアス等）で無意味な diff が出るのを防ぐため、`process.platform === "darwin"` の場合のみ保存します。

**ローカル reg-cli 比較も Mac 前提:**
`*:report:reg:local` コマンドは `git archive` で main ブランチの git 管理スクリーンショットをベースラインとして取得するため、Mac で撮影した画像同士の比較になります。

**CI では動的ベースライン生成:**
CI では git worktree でベースブランチをチェックアウトし、同一 CI 環境でビルド・テスト実行してスクリーンショットを取得します。同一環境での比較により OS 差異の問題を回避しています。

**なぜ Docker を使わないか:**
Docker を使えばローカルと CI の環境を統一できますが、セットアップの複雑化・ビルド速度の低下・ローカル開発でも Docker 必須になるなどデメリットが大きく、現在の「ローカルは Mac 同士、CI は CI 同士」で比較する方式を採用しています。

### Allure レポート

テスト実行後に Allure レポートでリッチな結果を確認できます（ブラウザが自動で開きます）。

```bash
# E2E テストの Allure レポートを表示
bun run web:e2e:report:allure

# VRT の Allure レポートを表示
bun run storybook:vrt:report:allure
```

## Git Hooks（Lefthook）

| フック | ジョブ | 内容 |
|-------|--------|------|
| pre-commit | lint-fix | Biome によるリント + フォーマット自動修正 |
| pre-commit | conflict-markers | コンフリクトマーカーの残存チェック |
| pre-commit | no-secrets | .env ファイルの誤コミット防止 |
| pre-push | unit-test | ユニットテスト（bun test） |
| pre-push | lint-check | Biome リント + フォーマットチェック（CI 同等） |
| pre-push | typecheck | TypeScript 型チェック |
| pre-push | build | Next.js ビルド |
| pre-push | bun-version-check | bun バージョン整合性チェック |
| pre-push | dependency-version-consistency-check | 依存パッケージバージョン整合性チェック |
| pre-push | knip | 未使用ファイル・依存関係チェック |

## CI/CD

PR 作成時に GitHub Actions が自動実行されます。Docker コンテナは使用せず、CI ランナー上で直接 Playwright を実行します。

- **Lint & Format** (`lint.yml`): 全 PR で Biome によるリント + フォーマットチェック
- **Storybook VRT** (`vrt.yml`): `packages/ui/` の変更時に実行
- **E2E テスト** (`e2e.yml`): `apps/web/` または `packages/ui/` の変更時に実行

PR 時はベースブランチからベースラインを動的生成し、reg-cli で差分レポートを生成します。
テスト自体は `toHaveScreenshot()` を使わないため、ビジュアル変更があってもテストは失敗しません。差分は reg-cli レポートで確認します。

Allure レポートもアーティファクトとしてアップロードされ、テスト結果の詳細分析が可能です。

### テスト構成の棲み分け

| レイヤー | 役割 | ツール | CI での判定 |
|---------|------|--------|-----------|
| Playwright VRT | コンポーネントのスクリーンショット撮影 | Playwright | pass/fail（機能テストのみ） |
| Playwright E2E | ページ遷移・レスポンシブ表示のスクリーンショット撮影 + 機能テスト | Playwright | pass/fail（機能テストのみ） |
| reg-cli | リッチな差分レポート生成（スライド / オーバーレイ / 2up / ブレンド） | `reg-cli` | レポートのみ（fail しない） |

- ベースライン画像はリポジトリにコミットせず、ベースブランチから動的生成する
- reg-cli はテスト実行時に `.reg/actual/` に保存されたスクリーンショットと、ベースブランチから生成した `.reg/expected/` を比較してレポートを生成する

### GitHub Pages レポート構成

CI 実行後、以下の URL でレポートを確認できます。
PR ごとにディレクトリが分離されるため、複数の PR が同時に CI を実行しても互いのレポートを上書きしません。
PR がクローズ（マージ含む）されると、該当ディレクトリは自動的に削除されます。

```
https://<owner>.github.io/<repo>/pr/<pr-number>/
├── vrt/
│   ├── html-report/      # Storybook VRT - Playwright HTML レポート
│   ├── allure-report/     # Storybook VRT - Allure レポート
│   └── reg-report/        # Storybook VRT - reg-cli 差分レポート
│       ├── report/        #   HTML レポート（index.html）
│       ├── actual/        #   実際のスクリーンショット
│       ├── expected/      #   ベースラインのスクリーンショット
│       └── diff/          #   差分画像
└── e2e/
    ├── html-report/       # E2E - Playwright HTML レポート
    ├── allure-report/     # E2E - Allure レポート
    └── reg-report/        # E2E - reg-cli 差分レポート
        ├── report/        #   HTML レポート（index.html）
        ├── actual/        #   実際のスクリーンショット
        ├── expected/      #   ベースラインのスクリーンショット
        └── diff/          #   差分画像
```

`workflow_dispatch` で手動実行した場合は `manual/<run-id>/` 配下にデプロイされます。

PR にはレポートリンク付きのコメントが自動投稿されます。
