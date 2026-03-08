# Storybook VRT + E2E Sample

[![CI](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/ci.yml)
[![Storybook VRT](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/storybook-vrt.yml/badge.svg?branch=main)](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/storybook-vrt.yml)
[![E2E Tests](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/web-e2e.yml/badge.svg?branch=main)](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/web-e2e.yml)
[![Storybook Chromatic Deploy](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/storybook-chromatic-deploy.yml/badge.svg?branch=main)](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/storybook-chromatic-deploy.yml)
[![Infra CI](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/infra-ci.yml/badge.svg?branch=main)](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/infra-ci.yml)
[![Cleanup GitHub Pages](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/github-pages-cleanup.yml/badge.svg?branch=main)](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/github-pages-cleanup.yml)
[![Storybook Cloudflare Deploy](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/storybook-cloudflare-deploy.yml/badge.svg?branch=main)](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/storybook-cloudflare-deploy.yml)
[![Storybook](https://img.shields.io/badge/Storybook-Chromatic-ff4785)](https://main--69a67d8928ff3a182e0b5dfa.chromatic.com)

Storybook コンポーネントのビジュアルリグレッションテスト（VRT）と E2E テストのサンプルプロジェクトです。

## 技術スタック

| 技術                | 用途                                                                     |
| ------------------- | ------------------------------------------------------------------------ |
| Next.js 16          | アプリケーション                                                         |
| Storybook 10        | コンポーネントカタログ                                                   |
| storybook-addon-vis | VRT スクリーンショット撮影（vitest browser mode）                        |
| Playwright          | E2E テスト                                                               |
| reg-cli             | VRT / E2E 差分 HTML レポート（スライド / オーバーレイ / 2up / ブレンド） |
| Tailwind CSS v4     | スタイリング                                                             |
| Oxlint + Oxfmt      | リンター + フォーマッター                                                |
| bun                 | パッケージマネージャー + モノレポ管理                                    |
| TypeScript          | 型安全性（tsgo による高速型チェック）                                    |

## プロジェクト構成

```
storybook-vrt-sample/
├── apps/
│   └── web/                  # Next.js アプリ + E2E テスト
├── packages/
│   └── ui/                   # 共有 UI コンポーネント + Storybook + VRT
├── infra/
│   └── cloudflare-access/    # Cloudflare Access (Zero Trust) の Terraform 管理
└── .github/workflows/        # CI (VRT + E2E + デプロイ)
```

## セットアップ

### 前提条件

[mise](https://mise.jdx.dev/) でランタイムと CLI ツールを管理しています。
`mise activate` 設定済みであればプロジェクトディレクトリに移動するだけでツールが自動インストールされます。

| ツール    | 用途                                  |
| --------- | ------------------------------------- |
| node      | ランタイム                            |
| bun       | パッケージマネージャー + モノレポ管理 |
| gh        | GitHub CLI                            |
| terraform | Cloudflare Access の IaC 管理         |
| dotenvx   | .env 暗号化管理                       |
| gcloud    | Google Cloud CLI（OAuth 設定等）      |

```bash
# mise 未インストールの場合
curl https://mise.run | sh
```

### プロジェクトセットアップ

```bash
# ツールインストール
mise install

# パッケージインストール
bun install

# クリーンインストール + 全チェック実行（リント・型チェック・テスト・ビルド・VRT・E2E）
bun run clean:setup
```

## オンボーディング（新メンバー向け）

新しくチームに参加するメンバーは、上記のセットアップに加えて以下を実施してください。

1. **Cloudflare Access にメールアドレスを追加してもらう**
   - 管理者に依頼して `infra/cloudflare-access/main.tf` の `allowed_emails` に自分のメールアドレスを追加・apply してもらう
   - これにより Cloudflare Pages 上の Storybook にアクセスできるようになる
2. **Terraform Cloud Organization への招待を受ける**
   - 管理者に依頼して [Terraform Cloud](https://app.terraform.io/) の Organization `sugurutakahashi-org` に招待してもらう
3. **Terraform Cloud にログイン**
   ```bash
   terraform login
   ```
   ブラウザが開くので、Terraform Cloud で認証する。トークンが `~/.terraform.d/credentials.tfrc.json` に保存される。
4. **`.env.keys` の取得**
   - `infra/cloudflare-access/.env.keys` をパスワードマネージャーから取得して配置する
   - このファイルには dotenvx の復号キー（`DOTENV_PRIVATE_KEY`）が含まれる
5. **動作確認**
   ```bash
   cd infra/cloudflare-access
   terraform init
   dotenvx run -- terraform plan
   ```
   `No changes.` と表示されれば正常にセットアップ完了。

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
| Agents       | 設定不要                   |
| Agent hooks  | 設定不要                   |
| Integrations | 設定不要                   |

## テスト

### ユニットテスト

純粋関数のユニットテストを `bun test` で実行します。

```bash
# 全パッケージのユニットテスト実行
bun run test
```

### Storybook テスト（play 関数 + a11y）

ストーリーの play 関数とアクセシビリティチェックを light / dark 両モードで実行します。
`@storybook/addon-a11y` の `test: "error"` により、WCAG 違反はテスト失敗として検出されます。

```bash
# Storybook テスト実行（light + dark）
bun run storybook:test
```

### Storybook VRT（ビジュアルリグレッションテスト）

コンポーネントの見た目が意図せず変わっていないかをスクリーンショット比較で検証します。

```bash
# VRT スクリーンショット撮影
bun run storybook:snapshot
```

#### Playwright から storybook-addon-vis への移行

VRT のスクリーンショット撮影を Playwright テストランナーから storybook-addon-vis（vitest browser mode）に移行しました。

**移行の動機: VRT で必要なのは「スクリーンショット撮影」だけ**

VRT の画像比較は reg-cli（REG Suite）が担っており、テストランナー側に求めるのはスクリーンショットを正確に・高速に撮ることだけです。Playwright テストランナーは `storybook build` → `http-server` → ブラウザで撮影という3段階が必要でしたが、storybook-addon-vis は vitest browser mode 上でストーリーを直接レンダリングしてスクリーンショットを撮るため、ビルドもサーバーも不要です。

**移行で得られたメリット:**

| 項目                    | Playwright                                               | storybook-addon-vis                                                  |
| ----------------------- | -------------------------------------------------------- | -------------------------------------------------------------------- |
| 事前ビルド              | `storybook build` 必須                                   | 不要                                                                 |
| HTTP サーバー           | `http-server` 必須                                       | 不要                                                                 |
| スクリーンショット範囲  | 要素セレクタを手動指定 (`#storybook-root`)               | body の `display: inline-block` でコンポーネントサイズに自動フィット |
| テーマ別撮影            | ストーリー URL のクエリパラメータで手動制御              | `vis.setup({ auto: { light, dark } })` で宣言的に設定                |
| ストーリー列挙          | `index.json` をパースして動的生成                        | `@storybook/addon-vitest` が自動列挙                                 |
| VRT 除外制御            | 独自タグ `skip-vrt`                                      | Storybook 標準の `!snapshot` タグ                                    |
| 依存パッケージ          | `@playwright/test` + `allure-playwright` + `http-server` | `storybook-addon-vis` のみ（追加）                                   |
| 実行速度 (24ストーリー) | ~10s（ビルド含む）                                       | ~3s（約70%短縮）                                                     |

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
`*:reg:local` コマンドは `git archive` で main ブランチの git 管理スクリーンショットをベースラインとして取得するため、Mac で撮影した画像同士の比較になります。

**CI では動的ベースライン生成:**
CI では git worktree でベースブランチをチェックアウトし、同一 CI 環境でビルド・テスト実行してスクリーンショットを取得します。同一環境での比較により OS 差異の問題を回避しています。

**なぜ Docker を使わないか:**
Docker を使えばローカルと CI の環境を統一できますが、セットアップの複雑化・ビルド速度の低下・ローカル開発でも Docker 必須になるなどデメリットが大きく、現在の「ローカルは Mac 同士、CI は CI 同士」で比較する方式を採用しています。

### Allure レポート

E2E テスト実行後に Allure レポートでリッチな結果を確認できます（ブラウザが自動で開きます）。

```bash
# E2E テストの Allure レポートを表示
bun run web:e2e:allure
```

## CI/CD

PR 作成時に GitHub Actions が自動実行されます。

- **CI** (`ci.yml`): 全 PR で Lint / Typecheck / Knip / Test / Build を実行
- **Infra CI** (`infra-ci.yml`): `infra/` の変更時に Terraform Format / Validate / tflint を実行
- **Storybook VRT** (`storybook-vrt.yml`): `packages/ui/` の変更時に実行
- **E2E テスト** (`web-e2e.yml`): `apps/web/` または `packages/ui/` の変更時に実行
- **Storybook Chromatic Deploy** (`storybook-chromatic-deploy.yml`): main マージ時・PR 時に Storybook を Chromatic へデプロイ
- **Storybook Cloudflare Deploy** (`storybook-cloudflare-deploy.yml`): main マージ時・PR 時に Storybook を Cloudflare Pages へデプロイ（Cloudflare Access による認証付き）
- **Cleanup GitHub Pages** (`github-pages-cleanup.yml`): PR クローズ時に gh-pages の容量をチェックし、800MB 超過時に古いレポートを削除

### Storybook ホスティング

Storybook は 2 つのプラットフォームでホスティングされています。

| プラットフォーム | アクセス制御                    | 用途                 |
| ---------------- | ------------------------------- | -------------------- |
| Chromatic        | 公開                            | 外部共有・レビュー用 |
| Cloudflare Pages | Cloudflare Access（Zero Trust） | チーム内限定共有     |

Cloudflare Pages は Cloudflare Access で保護されており、`allowed_emails` に登録されたメールアドレスのユーザーのみアクセスできます。
認証方法は GitHub OAuth / Google OAuth / メール OTP（One-time PIN）で、プロダクション・プレビューデプロイの両方が保護対象です。
アクセス制御の設定は `infra/cloudflare-access/` で Terraform により IaC 管理しています。

| タイミング | Chromatic                                                  | Cloudflare Pages                                       |
| ---------- | ---------------------------------------------------------- | ------------------------------------------------------ |
| main push  | https://main--69a67d8928ff3a182e0b5dfa.chromatic.com       | https://storybook-vrt-sample.pages.dev                 |
| PR         | `https://<branch>--69a67d8928ff3a182e0b5dfa.chromatic.com` | `https://<branch-hash>.storybook-vrt-sample.pages.dev` |

PR 時は各プラットフォームがプレビューデプロイを自動作成し、PR コメントでリンクを共有します。

PR 時はベースブランチからベースラインを動的生成し、reg-cli で差分レポートを生成します。
VRT・E2E ともにスクリーンショット撮影が目的であり、ビジュアル変更があってもテストは失敗しません。差分は reg-cli レポートで確認します。

### テスト構成の棲み分け

| プロジェクト       | 役割                                                                 | ツール                               | CI での判定                 |
| ------------------ | -------------------------------------------------------------------- | ------------------------------------ | --------------------------- |
| storybook-test     | play 関数 + a11y チェック（light + dark）                            | @storybook/addon-vitest + addon-a11y | pass/fail                   |
| storybook-snapshot | コンポーネントのスクリーンショット撮影（vitest browser mode）        | storybook-addon-vis                  | pass/fail（機能テストのみ） |
| Playwright E2E     | ページ遷移・レスポンシブ表示のスクリーンショット撮影 + 機能テスト    | Playwright                           | pass/fail（機能テストのみ） |
| reg-cli            | リッチな差分レポート生成（スライド / オーバーレイ / 2up / ブレンド） | reg-cli                              | レポートのみ（fail しない） |

- `storybook-snapshot` も内部で `storybookTest` プラグインを使うため、play 関数・a11y チェックは light で重複実行される。`storybook-test` は dark モードの a11y チェックを担うため残している
- ベースライン画像はリポジトリにコミットせず、ベースブランチから動的生成する
- reg-cli はテスト実行時に `.reg/actual/` に保存されたスクリーンショットと、ベースブランチから生成した `.reg/expected/` を比較してレポートを生成する

#### Storybook テスト並列実行

`storybook-test` と `storybook-snapshot` は同じ `storybookTest` プラグインを使うため、キャッシュを共有すると並列実行時に「Failed to fetch dynamically imported module」が発生する。以下の2種類の独立したキャッシュをそれぞれ個別に分離することで並列実行を実現している。

| キャッシュ種類                            | 参照元    | 分離方法              | 設定場所         |
| ----------------------------------------- | --------- | --------------------- | ---------------- |
| Vite deps 事前バンドル                    | Vite      | `cacheDir` オプション | vitest.config.ts |
| storybookTest 内部キャッシュ（sb-vitest） | Storybook | `CACHE_DIR` 環境変数  | lefthook.yml     |

この2つは独立しており互いに上書きしない。片方だけの分離では並列実行時にエラーが発生するため、両方の分離が必要。

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

## インフラ管理

### Cloudflare Access（`infra/cloudflare-access/`）

Cloudflare Pages にホスティングした Storybook へのアクセスを [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/)（Zero Trust）で制限しています。

| 項目               | 内容                                                              |
| ------------------ | ----------------------------------------------------------------- |
| 認証方法           | GitHub OAuth / Google OAuth / メール OTP（One-time PIN）          |
| アクセス制御       | `allowed_emails` に登録されたメールアドレスのみ許可               |
| 保護対象           | プロダクション（`pages.dev`）+ プレビュー（`*.pages.dev`）        |
| セッション有効期限 | 30日間（期限切れ後に再認証）                                      |
| IaC                | Terraform（Cloudflare provider v5）                               |
| State 管理         | HCP Terraform（Organization: `sugurutakahashi-org`、Project: `storybook-vrt-sample`、Workspace: `cloudflare-access`） |
| Execution Mode     | `local`（plan/apply はローカルや CI で実行し、state のみ Terraform Cloud に保存） |
| シークレット管理   | [dotenvx](https://dotenvx.com/) による .env 暗号化（AES-256-GCM） |

#### 操作手順

```bash
cd infra/cloudflare-access

# 初回のみ: provider をダウンロード
terraform init

# 変更内容をプレビュー（実際には適用しない）
dotenvx run -- terraform plan

# Cloudflare に変更を適用（メールアドレスの追加・削除など）
dotenvx run -- terraform apply
```

#### シークレット管理（dotenvx）

環境変数は `infra/cloudflare-access/.env` に dotenvx で暗号化して保存しています。
復号には `.env.keys` ファイルが必要です（パスワードマネージャー等で共有）。

```bash
cd infra/cloudflare-access

# 復号された全変数を確認
dotenvx get | jq .

# 新しい変数を追加する場合
# 1. .env に平文で追加
# 2. dotenvx encrypt で暗号化
```

#### 初回セットアップ

プロジェクトを一から構築する際に必要な手順です（通常の新メンバーは「オンボーディング」セクションを参照）。

<details>
<summary>Terraform Cloud の Organization・Project・Workspace 作成</summary>

1. [Terraform Cloud](https://app.terraform.io/) でアカウントを作成
2. Organization を作成（例: `sugurutakahashi-org`）
3. Organization 内に Project を作成（例: `storybook-vrt-sample`）
4. Project 内に Workspace を作成（例: `cloudflare-access`）
   - **Execution Mode**: `Local` に設定（plan/apply はローカルや CI で実行し、state のみ Terraform Cloud に保存）
5. Organization Settings > Teams > Team Token で API トークンを生成し、GitHub Secrets に `TF_API_TOKEN` として登録

</details>

GitHub OAuth App と Google OAuth クライアントは Terraform 未対応のため手動で作成が必要です。

<details>
<summary>GitHub OAuth App の作成手順</summary>

1. https://github.com/settings/developers > OAuth Apps > New OAuth App
2. 設定値:
   - **Application name**: `Cloudflare Access - Storybook`（任意）
   - **Homepage URL**: `https://storybook-vrt-sample.pages.dev`
   - **Authorization callback URL**: `https://suguru-takahashi.cloudflareaccess.com/cdn-cgi/access/callback`
     - `suguru-takahashi` = Cloudflare Zero Trust のチーム名（Zero Trust > Settings で確認）
3. Client ID と Client Secret を `.env` に設定（`dotenvx encrypt` で暗号化）

</details>

<details>
<summary>Google OAuth クライアントの作成手順</summary>

1. https://console.cloud.google.com/ でプロジェクトを作成（例: `storybook-vrt-sample`）
2. Google Auth Platform > 概要 > 「開始」でセットアップ
   - **ブランディング > アプリ名**: `Cloudflare Access - Storybook`（任意）
   - **対象 > ユーザーの種類**: 外部
   - **デベロッパー連絡先**: 自分のメールアドレス
3. Google Auth Platform > クライアント > OAuth クライアント ID を作成
   - **アプリケーションの種類**: ウェブ アプリケーション
   - **名前**: `Cloudflare Access`（任意）
   - **承認済みの JavaScript 生成元**: `https://suguru-takahashi.cloudflareaccess.com`
   - **承認済みのリダイレクト URI**: `https://suguru-takahashi.cloudflareaccess.com/cdn-cgi/access/callback`
4. Client ID と Client Secret を `.env` に設定（`dotenvx encrypt` で暗号化）

</details>

## シークレット・環境変数一覧

シークレットは用途に応じて複数の場所で管理しています。

### GitHub Secrets（Settings > Secrets and variables > Actions）

| Secret                     | 用途                      | 使用ワークフロー                  | 取得先                                                        |
| -------------------------- | ------------------------- | --------------------------------- | ------------------------------------------------------------- |
| `CHROMATIC_PROJECT_TOKEN`  | Chromatic デプロイ        | `storybook-chromatic-deploy.yml`  | [Chromatic](https://www.chromatic.com/) > Project > Configure |
| `CLOUDFLARE_API_TOKEN`     | Cloudflare Pages デプロイ | `storybook-cloudflare-deploy.yml` | Cloudflare > My Profile > API Tokens（権限: Pages Edit）      |
| `DOTENV_PRIVATE_KEY_INFRA` | Terraform 用 .env 復号    | `infra-ci.yml`                    | `infra/cloudflare-access/.env.keys` の `DOTENV_PRIVATE_KEY`   |
| `TF_API_TOKEN`             | Terraform Cloud API トークン | `infra-ci.yml`                 | Terraform Cloud > Organization Settings > Teams > Team Token  |

### GitHub Variables（Settings > Secrets and variables > Actions）

| Variable                | 用途                            | 使用ワークフロー                  |
| ----------------------- | ------------------------------- | --------------------------------- |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare アカウント識別       | `storybook-cloudflare-deploy.yml` |
| `CF_PAGES_PROJECT_NAME` | Cloudflare Pages プロジェクト名 | `storybook-cloudflare-deploy.yml` |

### dotenvx 暗号化（`infra/cloudflare-access/.env`）

Terraform で使用する環境変数を dotenvx で暗号化して管理しています。
復号には `.env.keys` が必要です（パスワードマネージャー等で共有）。

| 変数                                | 用途                   | 取得先                                                     |
| ----------------------------------- | ---------------------- | ---------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`              | Cloudflare Access 管理 | Cloudflare > My Profile > API Tokens（権限: Access Edit）  |
| `TF_VAR_github_oauth_client_id`     | GitHub OAuth IdP       | GitHub > Developer Settings > OAuth Apps                   |
| `TF_VAR_github_oauth_client_secret` | GitHub OAuth IdP       | 同上                                                       |
| `TF_VAR_google_oauth_client_id`     | Google OAuth IdP       | Google Cloud Console > Google Auth Platform > クライアント |
| `TF_VAR_google_oauth_client_secret` | Google OAuth IdP       | 同上                                                       |

各ワークフローのヘッダーコメントにも必要な Secrets/Variables の説明があります。
