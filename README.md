# Storybook VRT + E2E Sample

Storybook コンポーネントのビジュアルリグレッションテスト（VRT）と E2E テストのサンプルプロジェクトです。

## 技術スタック

| 技術               | 用途                                                               |
| ------------------ | ------------------------------------------------------------------ |
| Next.js 16         | アプリケーション                                                   |
| Storybook 10       | コンポーネントカタログ                                             |
| storybook-addon-vis | VRT スクリーンショット撮影（vitest browser mode）                 |
| Playwright         | E2E テスト                                                         |
| reg-cli            | VRT / E2E 差分 HTML レポート（スライド / オーバーレイ / 2up / ブレンド） |
| Tailwind CSS v4    | スタイリング                                                       |
| Oxlint + Oxfmt     | リンター + フォーマッター                                          |
| bun                | パッケージマネージャー + モノレポ管理                              |
| TypeScript         | 型安全性（tsgo による高速型チェック）                              |

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

# Playwright ブラウザインストール（VRT の vitest browser mode + E2E の両方で使用）
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

### リント & フォーマット設定（Ultracite）

Ultracite のゼロコンフィグプリセットで Oxlint + Oxfmt を管理しています。
Ultracite のアップデート時は、以下のコマンドを対話的に実行して設定を再生成してください:

```bash
bunx ultracite init
```

**選択肢の推奨設定:**

| 項目         | 選択                       |
| ------------ | -------------------------- |
| Linter       | Oxlint + Oxfmt             |
| Frameworks   | React, Next.js             |
| Editors      | VSCode / Cursor / Windsurf |
| Agents       | Claude Code                |
| Agent hooks  | Claude Code                |
| Integrations | Lefthook pre-commit hook   |

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
# VRT スクリーンショット撮影
bun run storybook:vrt:snapshot
```

#### Playwright から storybook-addon-vis への移行

VRT のスクリーンショット撮影を Playwright テストランナーから storybook-addon-vis（vitest browser mode）に移行しました。

**移行の動機: VRT で必要なのは「スクリーンショット撮影」だけ**

VRT の画像比較は reg-cli（REG Suite）が担っており、テストランナー側に求めるのはスクリーンショットを正確に・高速に撮ることだけです。Playwright テストランナーは `storybook build` → `http-server` → ブラウザで撮影という3段階が必要でしたが、storybook-addon-vis は vitest browser mode 上でストーリーを直接レンダリングしてスクリーンショットを撮るため、ビルドもサーバーも不要です。

**移行で得られたメリット:**

| 項目 | Playwright | storybook-addon-vis |
| --- | --- | --- |
| 事前ビルド | `storybook build` 必須 | 不要 |
| HTTP サーバー | `http-server` 必須 | 不要 |
| スクリーンショット範囲 | 要素セレクタを手動指定 (`#storybook-root`) | body の `display: inline-block` でコンポーネントサイズに自動フィット |
| テーマ別撮影 | ストーリー URL のクエリパラメータで手動制御 | `vis.setup({ auto: { light, dark } })` で宣言的に設定 |
| ストーリー列挙 | `index.json` をパースして動的生成 | `@storybook/addon-vitest` が自動列挙 |
| VRT 除外制御 | 独自タグ `skip-vrt` | Storybook 標準の `!snapshot` タグ |
| 依存パッケージ | `@playwright/test` + `allure-playwright` + `http-server` | `storybook-addon-vis` のみ（追加） |
| 実行速度 (24ストーリー) | ~10s（ビルド含む） | ~3s（約70%短縮） |

**検討したが見送ったツール:**

- [storycap-testrun](https://github.com/reg-viz/storycap-testrun): `page.screenshot()` によるビューポート全体キャプチャのみ対応。vitest browser mode ではストーリーのルート要素（`#storybook-root`）が存在せず、要素レベルのスクリーンショットが撮れない。コンポーネント単位の正確な差分検出には不向きなため見送り。storybook-addon-vis は `iframe.locator(selector).screenshot()` で要素レベル SS をネイティブにサポートしている

#### VRT 対象外ストーリー（`!snapshot` タグ）

play 関数で DOM を変更するストーリー（テキスト入力、テーマトグルなど）は、
スクリーンショットが実行タイミングにより不安定になるため VRT 対象外にできます。

`preview.tsx` で全ストーリーに `tags: ["snapshot"]` を設定し、
個別のストーリーに `tags: ["!snapshot"]` を追加すると VRT 対象から除外されます。
これは storybook-addon-vis のネイティブ機能です。

```typescript
export const Typing: Story = {
  tags: ["!snapshot"],
  play: async ({ canvasElement }) => {
    // DOM を変更する play 関数
  },
};
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

| 保存先                                  | 用途                                     | 保存条件            |
| --------------------------------------- | ---------------------------------------- | ------------------- |
| `vrt/screenshots/` / `e2e/screenshots/` | git 管理用（PR diff で視覚的変更を確認） | Mac（`darwin`）のみ |
| `.reg/actual/`                          | reg-cli 用（差分レポート生成）           | 常に保存            |

**git 管理用は Mac のみ保存する理由:**
開発は Mac を前提としており、OS 間のレンダリング差異（フォント・アンチエイリアス等）で無意味な diff が出るのを防ぐため、`process.platform === "darwin"` の場合のみ保存します。

**ローカル reg-cli 比較も Mac 前提:**
`*:report:reg:local` コマンドは `git archive` で main ブランチの git 管理スクリーンショットをベースラインとして取得するため、Mac で撮影した画像同士の比較になります。

**CI では動的ベースライン生成:**
CI では git worktree でベースブランチをチェックアウトし、同一 CI 環境でビルド・テスト実行してスクリーンショットを取得します。同一環境での比較により OS 差異の問題を回避しています。

**なぜ Docker を使わないか:**
Docker を使えばローカルと CI の環境を統一できますが、セットアップの複雑化・ビルド速度の低下・ローカル開発でも Docker 必須になるなどデメリットが大きく、現在の「ローカルは Mac 同士、CI は CI 同士」で比較する方式を採用しています。

### Allure レポート

E2E テスト実行後に Allure レポートでリッチな結果を確認できます（ブラウザが自動で開きます）。

```bash
# E2E テストの Allure レポートを表示
bun run web:e2e:report:allure
```

## Git Hooks（Lefthook）

| フック     | ジョブ                               | 内容                                                    |
| ---------- | ------------------------------------ | ------------------------------------------------------- |
| pre-commit | oxlint-fix                           | Oxlint によるリント自動修正                             |
| pre-commit | oxfmt-fix                            | Oxfmt によるフォーマット自動修正                        |
| pre-commit | conflict-markers                     | コンフリクトマーカーの残存チェック                      |
| pre-commit | no-secrets                           | .env ファイルの誤コミット防止                           |
| pre-push   | unit-test                            | ユニットテスト（bun test）                              |
| pre-push   | lint-check                           | Oxlint + Oxfmt リント + フォーマットチェック（CI 同等） |
| pre-push   | typecheck                            | TypeScript 型チェック                                   |
| pre-push   | build                                | Next.js ビルド                                          |
| pre-push   | bun-version-check                    | bun バージョン整合性チェック                            |
| pre-push   | dependency-version-consistency-check | 依存パッケージバージョン整合性チェック                  |
| pre-push   | knip                                 | 未使用ファイル・依存関係チェック                        |

## CI/CD

PR 作成時に GitHub Actions が自動実行されます。

- **CI** (`ci.yml`): 全 PR で Lint / Typecheck / Knip / Test / Build を実行
- **Storybook VRT** (`storybook-vrt.yml`): `packages/ui/` の変更時に実行
- **E2E テスト** (`web-e2e.yml`): `apps/web/` または `packages/ui/` の変更時に実行

PR 時はベースブランチからベースラインを動的生成し、reg-cli で差分レポートを生成します。
VRT・E2E ともにスクリーンショット撮影が目的であり、ビジュアル変更があってもテストは失敗しません。差分は reg-cli レポートで確認します。

### テスト構成の棲み分け

| レイヤー            | 役割                                                                 | ツール               | CI での判定                 |
| ------------------- | -------------------------------------------------------------------- | -------------------- | --------------------------- |
| storybook-addon-vis | コンポーネントのスクリーンショット撮影（vitest browser mode）        | storybook-addon-vis  | pass/fail（機能テストのみ） |
| Playwright E2E      | ページ遷移・レスポンシブ表示のスクリーンショット撮影 + 機能テスト    | Playwright           | pass/fail（機能テストのみ） |
| reg-cli             | リッチな差分レポート生成（スライド / オーバーレイ / 2up / ブレンド） | reg-cli              | レポートのみ（fail しない） |

- ベースライン画像はリポジトリにコミットせず、ベースブランチから動的生成する
- reg-cli はテスト実行時に `.reg/actual/` に保存されたスクリーンショットと、ベースブランチから生成した `.reg/expected/` を比較してレポートを生成する

### GitHub Pages レポート構成

CI 実行後、以下の URL でレポートを確認できます。
PR ごとにディレクトリが分離されるため、複数の PR が同時に CI を実行しても互いのレポートを上書きしません。
PR がクローズ（マージ含む）されると、該当ディレクトリは自動的に削除されます。

```
https://<owner>.github.io/<repo>/pr/<pr-number>/
├── storybook-vrt/
│   └── reg-report/        # Storybook VRT - reg-cli 差分レポート
│       ├── report/        #   HTML レポート（index.html）
│       ├── actual/        #   実際のスクリーンショット
│       ├── expected/      #   ベースラインのスクリーンショット
│       └── diff/          #   差分画像
└── web-e2e/
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
