# Storybook VRT + E2E Sample

[![CI](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/ci.yml)
[![Storybook VRT](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/storybook-vrt.yml/badge.svg?branch=main)](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/storybook-vrt.yml)
[![E2E Tests](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/web-e2e.yml/badge.svg?branch=main)](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/web-e2e.yml)
[![Storybook Chromatic Deploy](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/storybook-chromatic-deploy.yml/badge.svg?branch=main)](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/storybook-chromatic-deploy.yml)
[![Infra CI](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/infra-ci.yml/badge.svg?branch=main)](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/infra-ci.yml)
[![Cleanup GitHub Pages](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/github-pages-cleanup.yml/badge.svg?branch=main)](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/github-pages-cleanup.yml)
[![Storybook Cloudflare Deploy](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/storybook-cloudflare-deploy.yml/badge.svg?branch=main)](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/storybook-cloudflare-deploy.yml)
[![API Cloudflare Workers Deploy](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/api-cloudflare-workers-deploy.yml/badge.svg?branch=main)](https://github.com/sugurutakahashi-1234/storybook-vrt-sample/actions/workflows/api-cloudflare-workers-deploy.yml)
[![Storybook](https://img.shields.io/badge/Storybook-Chromatic-ff4785)](https://main--69a67d8928ff3a182e0b5dfa.chromatic.com)

Storybook コンポーネントのビジュアルリグレッションテスト（VRT）と E2E テストのサンプルプロジェクトです。

## 技術スタック

| 技術                | 用途                                                                     |
| ------------------- | ------------------------------------------------------------------------ |
| Next.js 16          | Web アプリケーション                                                     |
| oRPC + Hono         | API サーバー（コントラクトファースト + OpenAPI）                         |
| Cloudflare Workers  | API サーバーのホスティング（staging / production）                       |
| Storybook 10        | コンポーネントカタログ                                                   |
| storybook-addon-vis | VRT スクリーンショット撮影（vitest browser mode）                        |
| Playwright          | E2E テスト                                                               |
| reg-cli             | VRT / E2E 差分 HTML レポート（スライド / オーバーレイ / 2up / ブレンド） |
| Tailwind CSS v4     | スタイリング                                                             |
| Oxlint + Oxfmt      | リンター + フォーマッター                                                |
| bun                 | パッケージマネージャー + モノレポ管理                                    |
| TypeScript          | 型安全性（tsgo による高速型チェック）                                    |

## アーキテクチャ設計方針（Dα + Better Auth 構成）

このプロジェクトは検証用リポジトリとして、本番を見据えたフルスタック構成を段階的に構築しています。
以下は各技術選定の比較・検討プロセスと最終的な判断をまとめたものです。

### 最終構成（Target Architecture）

```
ユーザー → CF Pages (Next.js / OpenNext)
              ├→ Server Actions
              ↓ HTTP (oRPC クライアント)
           CF Workers (Hono + oRPC + Better Auth)
              ↓ バインディング（ネットワーク通信なし）
           D1 (SQLite)  +  R2 (ストレージ)
```

| レイヤー   | 技術                                  | 理由                                                         |
| ---------- | ------------------------------------- | ------------------------------------------------------------ |
| Web        | Cloudflare Pages (Next.js / OpenNext) | Vercel の帯域課金を回避。CF 内でインフラ統一                 |
| API        | Cloudflare Workers (Hono + oRPC)      | Hono ミドルウェアエコシステム。API 先行開発が可能            |
| DB         | Cloudflare D1 (SQLite)                | Workers とバインディング直結（レイテンシ ~0ms）。無料枠大    |
| ORM        | Drizzle                               | 12KB バンドル。Workers ネイティブ対応。DB 切り替えが容易     |
| 認証       | Better Auth                           | OSS 無料。D1 + Drizzle + Hono にネイティブ対応。MAU 制限なし |
| ストレージ | Cloudflare R2                         | S3 互換。エグレス課金なし                                    |
| IaC        | Terraform (Cloudflare provider)       | 1 provider で全リソース管理                                  |

### 検討 1: Web ホスティング — Vercel vs Cloudflare Pages

#### 比較

| 観点                | Vercel                                              | Cloudflare Pages (OpenNext)                          |
| ------------------- | --------------------------------------------------- | ---------------------------------------------------- |
| Next.js 互換性      | ◎ 公式。全機能動作                                  | ○ OpenNext 経由。基本機能は動作。エッジケースあり    |
| Server Actions      | ◎ ネイティブ                                        | ○ 動作するが動的ルート + CF バインディングで一部バグ |
| コスト（帯域）      | ✕ 従量課金。スケール時に爆発（月200万円の事例あり） | ◎ エグレス無料                                       |
| エッジ配信          | ○ リージョン指定                                    | ◎ 世界 300 箇所以上                                  |
| CF Workers との統合 | △ 別プラットフォーム                                | ◎ 同一プラットフォーム。Service Bindings 対応        |
| Terraform           | ○ Vercel provider                                   | ◎ Cloudflare provider（API と統一管理）              |

#### 判断

**Cloudflare Pages を採用。** Vercel は Next.js との互換性で最強だが、帯域課金がスケール時に深刻。
[AutoReserve の事例](https://tech.hello.ai/entry/vercel-cloudflare-migration)では Vercel 月額約200万円 → Cloudflare 移行で 90% 削減を実現している。
OpenNext は Cloudflare 公式推奨のデプロイ方法で、1-3日ごとにリリースされる活発なプロジェクト。
Server Actions も基本的な CRUD は安定動作する。Vinext（Cloudflare が開発中の Vite ベース代替）も将来の選択肢として期待できる。

### 検討 2: API フレームワーク — Next.js 統合 vs Hono 分離

#### 比較

| 観点                  | Next.js に統合 (API Routes)                    | Hono 分離 (CF Workers)                               |
| --------------------- | ---------------------------------------------- | ---------------------------------------------------- |
| 構成のシンプルさ      | ◎ 1 サービス                                   | ○ 2 サービス                                         |
| Hono ミドルウェア     | △ API Routes 内のみ。Server Actions は通らない | ◎ 全リクエストが通過（ログ、認証、OpenTelemetry 等） |
| API 先行開発          | △ Next.js 全体のデプロイが必要                 | ◎ API だけデプロイして curl で動作確認               |
| モバイル対応          | △ API Routes を整備する必要あり                | ◎ Workers の URL を公開するだけ                      |
| 別言語への置き換え    | ✕ Next.js 内で大改修                           | ◎ Workers を差し替えるだけ                           |
| WebSocket             | ✕ Vercel 非対応                                | ◎ Durable Objects で対応可能                         |
| oRPC コントラクト共有 | ○ 活用できる                                   | ◎ API 境界が明確で最も自然に活きる                   |

#### 判断

**Hono を CF Workers に分離する構成を採用。** ミドルウェアエコシステム（ログ、CORS、認証、OpenTelemetry 等）をフル活用でき、API 先行開発・モバイル対応・将来の言語変更にも対応できる。
Server Actions から API への HTTP 通信は Vercel(東京) → Workers(東京エッジ) で 1-5ms 程度であり、体感上の問題はない。

### 検討 3: データベース — PostgreSQL vs SQLite (D1)

#### 比較

| 観点                 | PostgreSQL (Neon / Supabase)                   | SQLite (Cloudflare D1)                          |
| -------------------- | ---------------------------------------------- | ----------------------------------------------- |
| Workers からの接続   | △ Hyperdrive or WebSocket ドライバー。設定必要 | ◎ バインディング直結。設定不要。レイテンシ ~0ms |
| 東京リージョン       | Supabase: ◎ あり / Neon: △ シンガポール最寄り  | ◎ エッジで動作                                  |
| 同時書き込み         | ◎ 行ロック。大量同時書き込み対応               | △ ファイルロック。書き込みは直列化              |
| 型の厳密さ (ENUM 等) | ◎ DB レベルで制約                              | ○ CHECK 制約 + Drizzle の型推論で補完可能       |
| DB ブランチング      | ◎ Neon の目玉機能                              | ✕ なし（別 DB 作成で代替）                      |
| 分析ツール連携       | ◎ Metabase 等から直接接続                      | △ API 経由 or BigQuery 連携                     |
| コスト               | △ Neon/Supabase の無料枠あるが有料化しやすい   | ◎ 無料枠大（5GB, 読取500万行/日）               |
| 容量                 | ◎ 上限なし（プランによる）                     | ○ 10GB 上限。MAU 数千人で数年持つ               |

#### D1 (SQLite) の容量目安

| MAU    | 月間データ増分 | 10GB 到達 |
| ------ | -------------- | --------- |
| 1,000  | 50 MB          | 約 17 年  |
| 5,000  | 250 MB         | 約 3.5 年 |
| 10,000 | 500 MB         | 約 1.7 年 |
| 30,000 | 1.5 GB         | 約 7 ヶ月 |

#### SQLite の復権

2023 年以降、エッジコンピューティングの台頭により SQLite がサーバーサイドで復権している。
Cloudflare D1、Turso (libSQL)、Rails 8 の SQLite 本番サポート等、「本番でも SQLite で十分」という流れが加速している。
PostgreSQL は大規模・高並行・複雑なクエリで依然として最強だが、CRUD 中心の Web アプリでは SQLite で十分なケースが多い。

#### 判断

**D1 (SQLite) を採用。** Workers とのバインディング直結が決定的な利点。
接続プーリング不要、接続文字列管理不要、レイテンシ ~0ms。
Drizzle を ORM として使うことで、将来 PostgreSQL に移行する場合もスキーマファイルとドライバー設定の変更のみで対応可能。

#### PostgreSQL に移行すべきタイミング

| シグナル                            | 説明                                 |
| ----------------------------------- | ------------------------------------ |
| DB サイズが 5GB 超                  | 10GB 上限に近づく前に計画開始        |
| 同時書き込みが数百 req/sec 以上     | D1 の書き込みロックが詰まり始める    |
| 複雑なクエリが必要                  | ウィンドウ関数、再帰 CTE、JSONB 検索 |
| Workers 以外から DB 接続            | D1 は Workers 専用。外部アクセス不可 |
| 分析ツール (Metabase 等) で直接接続 | BigQuery 連携で代替しない場合        |

### 検討 4: ORM — Drizzle vs Prisma

| 観点           | Drizzle                  | Prisma                           |
| -------------- | ------------------------ | -------------------------------- |
| バンドルサイズ | ◎ 12KB                   | ✕ 1.6MB                          |
| Workers 対応   | ◎ ネイティブ             | △ Edge 対応あるが制約多い        |
| D1 対応        | ◎ `drizzle-orm/d1`       | △ Prisma Accelerate 経由         |
| 型安全性       | ◎ SQL に近い API         | ◎ 独自 API                       |
| DB 切り替え    | ◎ ドライバー差し替えのみ | ○ スキーマは共通だが設定変更多い |

**Drizzle を採用。** Workers 環境では Prisma の 1.6MB バンドルが致命的（Worker サイズ制限 3-10MB）。
Drizzle は SQL に近い API で学習コストが低く、D1 ネイティブ対応。

### 検討 5: 認証 — 各サービス比較

#### 候補一覧

| サービス          |     Workers + D1 対応     | 無料 MAU | 月額コスト |     OSS      |     Hono 統合     |
| ----------------- | :-----------------------: | -------- | ---------- | :----------: | :---------------: |
| **Better Auth**   |       ◎ ネイティブ        | 無制限   | 無料       | ◎ Apache 2.0 |    ◎ 公式対応     |
| **Clerk**         |    ○ (middleware 注意)    | 50,000   | $20/月〜   |      ✕       | ○ hono-clerk-auth |
| **Supabase Auth** |    ○ (Auth 単体利用可)    | 50,000   | $25/月〜   |      △       |  △ JWT 検証のみ   |
| **Auth.js v5**    | △ (D1 バインディング問題) | 無制限   | 無料       |      ◎       |    △ 自前実装     |
| **Firebase Auth** |     △ (JWT 検証のみ)      | 無制限   | 無料       |      ✕       |  △ JWT 検証のみ   |

#### 判断

**Better Auth を採用。** D1 + Drizzle + Hono にネイティブ対応した唯一の認証ライブラリ。
OSS (Apache 2.0) で MAU 制限なし。ユーザー・セッションを D1 に直接保存でき、外部認証サービスへの依存がゼロ。
2025-2026 年の OSS 認証ライブラリで最も勢いがあり、TypeScript ファーストの設計。

懸念点としてまだ若いプロジェクトであること、セッションリフレッシュの既知バグ（Issue #4203）があるが、
検証用リポジトリで試行し、問題があれば Clerk（5万 MAU 無料）にフォールバック可能。

### 検討 6: コスト比較

検討した主要 3 構成のコスト推移:

```
月額 ($)

$10,000 |                                          A2 ↗↗
        |                                        ↗
 $8,000 |                                      ↗
        |                                    ↗
 $6,000 |                                  ↗
        |                                ↗
 $4,000 |                              ↗
        |                            ↗
 $2,000 |                         ↗            Dα+Clerk
        |                      ↗          ┌─────────
 $1,000 |                   ↗        ┌────┘
        |                ↗      ┌────┘
   $500 |             ↗    ┌────┘
        |          ↗  ┌────┘
   $100 |       ↗ ┌───┘
        |   ┌──┘
    $30 |───┘─────────────────────────── Dα+Better Auth
    $10 |─────────────────
     $0 |────────
        └──────────────────────────────────────────────
        0    1万   3万    5万    10万   15万   20万   30万  MAU
```

| MAU      | A2 (Vercel + Supabase) | Dα + Clerk (CF + Clerk) | Dα + Better Auth (CF + OSS) |
| -------- | ---------------------- | ----------------------- | --------------------------- |
| 〜10,000 | $0                     | $0                      | $0                          |
| 30,000   | $120-320               | $0                      | ~$10                        |
| 50,000   | $500-1,000             | $0                      | ~$10                        |
| 100,000  | $1,200-2,500           | $120                    | ~$10                        |
| 300,000  | $5,000-10,000          | $5,020                  | ~$10                        |

- **A2**: Vercel の帯域課金 + Compute 課金がスケール時に爆発
- **Dα + Clerk**: 5 万 MAU 超で Clerk の従量課金が増加
- **Dα + Better Auth**: CF のエグレス無料 + OSS 認証で MAU に関係なくほぼ固定

#### 構成比較サマリ

| 評価軸              | A2 (Vercel + Supabase) |     Dα + Better Auth (CF 全部 + OSS)      |
| ------------------- | :--------------------: | :---------------------------------------: |
| コスト (小規模)     |           ◎            |                     ◎                     |
| コスト (スケール時) |   ✕ Vercel 帯域爆発    |                ◎ ほぼ固定                 |
| Next.js 安定性      |     ◎ Vercel 公式      | △ OpenNext (活発だがバージョン追従コスト) |
| Hono 活用           |   ○ API Routes のみ    |            ◎ 全リクエスト通過             |
| 認証 DB 連携        |     ◎ Supabase RLS     |         ◎ D1 に直接保存 (Drizzle)         |
| API 先行開発        |           △            |                     ◎                     |
| インフラ統一        |  △ Vercel + Supabase   |      ◎ Cloudflare 1 プラットフォーム      |
| Terraform           |      △ 2 provider      |               ◎ 1 provider                |
| 分析                |    ○ BigQuery 連携     |              ○ BigQuery 連携              |

### 検討 7: データ分析

OLTP（本番 DB）と OLAP（分析）は分離するのが正しいアーキテクチャ。
本番 DB で重い分析クエリを走らせるとユーザーに影響が出るため、大規模サービスほどこの分離を行う。

```
D1 (本番 DB) → Workers バッチ（日次） → BigQuery → Looker Studio（無料）
```

BigQuery のコスト: 保存 1TB で月 $20（最初 10GB 無料）、クエリ 1TB スキャンで $5（毎月 1TB 無料）。
TODO アプリ規模のデータ量なら実質無料。分析基盤は必要になったタイミングで追加する。

### 技術選定の連鎖

各技術選定は独立した判断ではなく、前の選定が次の選定の前提条件となる連鎖構造になっている。

```
CF Workers 採用（API ホスティング）
  │ エッジで API を動かしたい
  ↓
Hono 採用（API フレームワーク）
  │ Workers 上でミドルウェアエコシステム（ログ、CORS、認証、OpenTelemetry）を活用
  ↓
D1 採用（データベース）
  │ Workers とバインディング直結（レイテンシ ~0ms、接続設定不要）
  ↓
Drizzle 採用（ORM）
  │ D1 ネイティブ対応、12KB バンドル（Workers サイズ制限に収まる）
  ↓
Better Auth 採用（認証）
  │ Hono + D1 + Drizzle にネイティブ対応。OSS 無料、MAU 制限なし
  │ ※ Hono なしだと Better Auth のメリットが活きず、Clerk ($20/月〜) や Supabase Auth ($25/月〜) になる
  ↓
CF Pages 採用（Web ホスティング）
  │ API・DB・認証・ストレージが全て CF 内。インフラ統一 + エグレス無料
  ↓
Terraform (Cloudflare provider 1つ) で全リソース管理
```

**Hono が起点。** Hono を採用したことで Workers エコシステムに自然に乗り、
D1 → Drizzle → Better Auth と連鎖的に最適な選択肢が決まった。
仮に Hono を外して Next.js に API を統合すると、この連鎖が崩れ、
認証は Clerk/Supabase Auth（有料）、DB は Neon（外部接続）、ホスティングは Vercel（帯域課金）となり、
構成の複雑さとコストの両方が増加する。

### リスクと対策

| リスク                             | 影響                                | 対策                                                      |
| ---------------------------------- | ----------------------------------- | --------------------------------------------------------- |
| OpenNext の Next.js バージョン追従 | 新バージョンで一時的に壊れる可能性  | Next.js のアップデートは OpenNext の対応を確認してから    |
| Better Auth の成熟度               | セッション管理等のエッジケースバグ  | Clerk (5万MAU無料) へのフォールバック                     |
| D1 の 10GB 上限                    | データ量増加時に移行が必要          | Drizzle でドライバー差し替えのみ。Neon or Supabase に移行 |
| Vinext の登場                      | OpenNext が将来的に置き換わる可能性 | Vinext GA 後に評価・移行を検討                            |

## プロジェクト構成

```
storybook-vrt-sample/
├── apps/
│   ├── api/                  # oRPC + Hono API サーバー（Cloudflare Workers にデプロイ）
│   └── web/                  # Next.js アプリ + E2E テスト
├── packages/
│   ├── api-contract/         # API コントラクト定義（oRPC）— サーバー・クライアント・MSW モックで共有
│   └── ui/                   # 共有 UI コンポーネント + Storybook + VRT
├── mcp/                      # MCP サーバーのシークレット管理
├── infra/
│   ├── cloudflare-access/    # Cloudflare Access (Zero Trust) の Terraform 管理
│   └── sentry/               # Sentry エラー監視の Terraform 管理
└── .github/workflows/        # CI (VRT + E2E + デプロイ)
```

## セットアップ

### 前提条件

[mise](https://mise.jdx.dev/) でランタイムと CLI ツールを管理しています。
`mise activate` 設定済みであればプロジェクトディレクトリに移動するだけでツールが自動インストールされます。

| ツール    | 用途                                           |
| --------- | ---------------------------------------------- |
| node      | ランタイム                                     |
| bun       | パッケージマネージャー + モノレポ管理          |
| gh        | GitHub CLI                                     |
| terraform | インフラ IaC 管理（Cloudflare Access, Sentry） |
| dotenvx   | .env 暗号化管理                                |
| gcloud    | Google Cloud CLI（OAuth 設定等）               |

```bash
# mise 未インストールの場合
curl https://mise.run | sh
```

### プロジェクトセットアップ

```bash
# ツールインストール
mise install

# パッケージインストール（lefthook + Playwright ブラウザも自動セットアップ）
bun install

# クリーンインストール + 全チェック実行（リント・型チェック・テスト・ビルド・VRT・E2E）
bun run clean:setup
```

> **Note:** `bun install` 時に `prepare` スクリプトで lefthook の Git hooks 登録と Playwright ブラウザのインストールが自動実行されます。CI 環境（`CI=true`）ではこれらをスキップし、必要なワークフローで個別にインストールしています。

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
   - ルートの `.env.keys` を管理者から取得して配置する（中身は `DOTENV_PRIVATE_KEY=xxx` の1行のみ）
5. **動作確認**

   ```bash
   # MCP サーバーの環境変数が復号できることを確認
   cd mcp && dotenvx get | jq .

   # Next.js アプリの環境変数が復号できることを確認
   cd apps/web && dotenvx get | jq .

   # Terraform の環境変数が復号できることを確認
   cd infra/cloudflare-access
   terraform init
   dotenvx run -- terraform plan

   cd infra/sentry
   terraform init
   dotenvx run -- terraform plan
   ```

   MCP・Next.js 側は変数が表示されれば OK。Terraform 側は `No changes.` と表示されれば正常にセットアップ完了。

## 開発ワークフロー

### Storybook 開発

```bash
# Storybook 起動 (http://localhost:6006)
bun run storybook
```

### API サーバー開発

```bash
# API dev サーバー起動 (http://localhost:3001)
cd apps/api && bun run dev
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

| 項目                    | Playwright                                  | storybook-addon-vis                                                  |
| ----------------------- | ------------------------------------------- | -------------------------------------------------------------------- |
| 事前ビルド              | `storybook build` 必須                      | 不要                                                                 |
| HTTP サーバー           | `http-server` 必須                          | 不要                                                                 |
| スクリーンショット範囲  | 要素セレクタを手動指定 (`#storybook-root`)  | body の `display: inline-block` でコンポーネントサイズに自動フィット |
| テーマ別撮影            | ストーリー URL のクエリパラメータで手動制御 | `vis.setup({ auto: { light, dark } })` で宣言的に設定                |
| ストーリー列挙          | `index.json` をパースして動的生成           | `@storybook/addon-vitest` が自動列挙                                 |
| VRT 除外制御            | 独自タグ `skip-vrt`                         | Storybook 標準の `!snapshot` タグ                                    |
| 依存パッケージ          | `@playwright/test` + `http-server`          | `storybook-addon-vis` のみ（追加）                                   |
| 実行速度 (24ストーリー) | ~10s（ビルド含む）                          | ~3s（約70%短縮）                                                     |

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

## CI/CD

PR 作成時（Ready for review）に GitHub Actions が自動実行されます。Draft PR では CI は実行されず、Ready に変更された時点でトリガーされます。

- ✅ **CI** (`ci.yml`): 全 PR で Lint / Typecheck / Knip / Test / Build を実行
- 🏗️ **Infra CI** (`infra-ci.yml`): 全 PR で起動し、`infra/` の変更時のみ Terraform Format / Validate / tflint を実行（変更なしの場合はジョブ skip = pass）
- 📸 **Storybook VRT** (`storybook-vrt.yml`): 全 PR で起動し、`packages/ui/` の変更時のみ実行（変更なしの場合はジョブ skip = pass）
- 🧪 **E2E テスト** (`web-e2e.yml`): 全 PR で起動し、`apps/web/` または `packages/ui/` の変更時のみ実行（変更なしの場合はジョブ skip = pass）
- 🎨 **Storybook Chromatic Deploy** (`storybook-chromatic-deploy.yml`): main マージ時・PR 時に Storybook を Chromatic へデプロイ（PR 時は `packages/ui/` 変更時のみ）
- ☁️ **Storybook Cloudflare Deploy** (`storybook-cloudflare-deploy.yml`): main マージ時・PR 時に Storybook を Cloudflare Pages へデプロイ（PR 時は `packages/ui/` 変更時のみ、Cloudflare Access による認証付き）
- ⚡ **API Cloudflare Workers Deploy** (`api-cloudflare-workers-deploy.yml`): main マージ時は production、PR 時は staging に API をデプロイ（`apps/api/` または `packages/api-contract/` 変更時のみ）
- 🧹 **Cleanup GitHub Pages** (`github-pages-cleanup.yml`): PR クローズ時に gh-pages の容量をチェックし、800MB 超過時に古いレポートを削除

> **Note:** paths フィルタ付きワークフロー（VRT, E2E, Chromatic, Cloudflare, Infra CI）は全 PR で起動し、[AurorNZ/paths-filter](https://github.com/AurorNZ/paths-filter) でジョブレベル skip する設計です。ワークフローレベルの `paths:` だとチェックが「存在しない」状態になり required status checks でマージがブロックされますが、ジョブレベル skip は GitHub 上で pass 扱いになるためこの問題を回避できます。
>
> **Draft PR:** 全ワークフローは `types: [opened, synchronize, reopened, ready_for_review]` で Draft PR をスキップします。Draft から Ready に変更すると `ready_for_review` イベントで CI が起動します。

### Storybook ホスティング

Storybook は 2 つのプラットフォームでホスティングされています。
このリポジトリは検証用のパブリックリポジトリのため、Chromatic は公開状態でデプロイしています。
実際のプロダクトでは Cloudflare Pages + Cloudflare Access のように認証付きでホスティングし、チーム外からのアクセスを制限する構成を想定しています。

| プラットフォーム | アクセス制御                    | 用途                                             |
| ---------------- | ------------------------------- | ------------------------------------------------ |
| Chromatic        | 公開                            | セットアップが簡単なため採用。公開状態でデプロイ |
| Cloudflare Pages | Cloudflare Access（Zero Trust） | 認証付きホスティングの検証用。チーム内限定共有   |

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

### API アーキテクチャ（oRPC + Hono + Cloudflare Workers）

oRPC のコントラクトファーストアプローチにより、API スキーマを1箇所で定義し、サーバー・クライアント・MSW モックの3箇所で共有しています。

```
packages/api-contract     ← コントラクト定義（単一の真実の源）
    │
    ├──→ apps/api          ← サーバー実装（implement() でハンドラーを紐づけ）
    │
    └──→ packages/ui
         ├── src/api/      ← oRPC クライアント（createORPCClient + OpenAPILink）
         └── src/mocks/    ← MSW モック（orpc-msw で型安全なハンドラー自動生成）
```

| 環境         | API 接続先                      | 仕組み                                               |
| ------------ | ------------------------------- | ---------------------------------------------------- |
| Storybook    | なし                            | MSW がリクエストをインターセプト（API サーバー不要） |
| ローカル開発 | `localhost:3001`                | Bun dev サーバー（`bun run --hot`）                  |
| Staging      | Cloudflare Workers (staging)    | PR 時に自動デプロイ                                  |
| Production   | Cloudflare Workers (production) | main マージ時に自動デプロイ                          |

Storybook では MSW がブラウザの Service Worker でリクエストを横取りするため、API サーバーの起動は不要です。
ストーリーごとに `parameters.msw.handlers` でモックデータを差し替えることで、空リスト・全完了済み等のバリエーションを表現できます。
VRT もこの MSW モックを使うため、外部依存なしで安定したスクリーンショットが撮れます。

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

| 項目               | 内容                                                                                                                  |
| ------------------ | --------------------------------------------------------------------------------------------------------------------- |
| 認証方法           | GitHub OAuth / Google OAuth / メール OTP（One-time PIN）                                                              |
| アクセス制御       | `allowed_emails` に登録されたメールアドレスのみ許可                                                                   |
| 保護対象           | プロダクション（`pages.dev`）+ プレビュー（`*.pages.dev`）                                                            |
| セッション有効期限 | 30日間（期限切れ後に再認証）                                                                                          |
| IaC                | Terraform（Cloudflare provider v5）                                                                                   |
| State 管理         | HCP Terraform（Organization: `sugurutakahashi-org`、Project: `storybook-vrt-sample`、Workspace: `cloudflare-access`） |
| Execution Mode     | `local`（plan/apply はローカルや CI で実行し、state のみ Terraform Cloud に保存）                                     |
| シークレット管理   | [dotenvx](https://dotenvx.com/) による .env 暗号化（AES-256-GCM）                                                     |

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
復号にはルートの `.env.keys` が必要です（管理者から安全な方法で共有）。

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
4. Project 内に Workspace を作成（例: `cloudflare-access`, `sentry`）
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

### Sentry エラー監視（`infra/sentry/`）

Sentry のプロジェクト・クライアントキー（DSN）・アラートルールを Terraform で管理しています。

| 項目             | 内容                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| 監視対象         | Next.js Web アプリ（クライアント・サーバー・Edge Runtime）                                                    |
| アラート通知先   | Slack（`#sentry-alerts`）+ GitHub Issue 自動作成                                                              |
| アラート条件     | 新しいエラーを検知したとき（既知エラーの再発は通知しない）                                                    |
| 再通知間隔       | 24時間（同じアラートの連続通知を抑制）                                                                        |
| レート制限       | 1時間あたり 1000 イベント（無料枠 5,000 イベント/月 の保護）                                                  |
| 自動 Resolved    | 72時間（3日間）再発しなかったエラーを自動で Resolved にする                                                   |
| IaC              | Terraform（[jianyuan/sentry](https://registry.terraform.io/providers/jianyuan/sentry/latest) provider v0.14） |
| State 管理       | HCP Terraform（Organization: `sugurutakahashi-org`、Workspace: `sentry`）                                     |
| Execution Mode   | `local`（plan/apply はローカルや CI で実行し、state のみ Terraform Cloud に保存）                             |
| シークレット管理 | [dotenvx](https://dotenvx.com/) による .env 暗号化（AES-256-GCM）                                             |

> **Note:** Slack・GitHub のインテグレーションは Terraform では管理できず、Sentry ダッシュボードで手動設定が必要です。
> 設定手順は `infra/sentry/main.tf` のヘッダーコメントを参照してください。

#### 操作手順

```bash
cd infra/sentry

# 初回のみ: provider をダウンロード
terraform init

# 変更内容をプレビュー（実際には適用しない）
dotenvx run -- terraform plan

# Sentry に変更を適用（アラートルール追加・設定変更など）
dotenvx run -- terraform apply
```

## シークレット・環境変数一覧

シークレットは用途に応じて複数の場所で管理しています。

### GitHub Secrets（Settings > Secrets and variables > Actions）

| Secret                    | 用途                                | 使用ワークフロー                                                       | 取得先                                                                         |
| ------------------------- | ----------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `CHROMATIC_PROJECT_TOKEN` | Chromatic デプロイ                  | `storybook-chromatic-deploy.yml`                                       | [Chromatic](https://www.chromatic.com/) > Project > Configure                  |
| `CLOUDFLARE_API_TOKEN`    | Cloudflare Pages / Workers デプロイ | `storybook-cloudflare-deploy.yml`, `api-cloudflare-workers-deploy.yml` | Cloudflare > My Profile > API Tokens（権限: Pages Edit, Workers Scripts Edit） |
| `DOTENV_PRIVATE_KEY`      | 全 .env ファイル共通の復号キー      | `ci.yml`, `web-e2e.yml`, `infra-ci.yml`                                | ルートの `.env.keys` の `DOTENV_PRIVATE_KEY`                                   |
| `TF_API_TOKEN`            | Terraform Cloud API トークン        | `infra-ci.yml`                                                         | Terraform Cloud > Organization Settings > Teams > Team Token                   |

### dotenvx 暗号化

環境変数を dotenvx で暗号化してリポジトリにコミットしています。
復号にはルートの `.env.keys` が必要です（管理者から安全な方法で共有）。
`mise.toml` の `[env] _.file` で `.env.keys` を自動読み込みし、`DOTENV_PRIVATE_KEY` 環境変数をセットします。
これにより dotenvx コマンドは追加オプションなしで復号できます。

**新しい暗号化環境を追加する手順:**

1. 新ディレクトリで `.env` を作成
2. `dotenvx encrypt -fk ../../.env.keys` で暗号化（ルートの `.env.keys` にキーが追加される）
3. `.gitignore` に `!<dir>/.env` を追加（暗号化済みファイルをコミットするため）

#### `apps/web/.env`（Next.js アプリ）

| 変数                     | 用途              | 取得先                                                                                                   |
| ------------------------ | ----------------- | -------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry エラー監視 | [Sentry](https://suguru-takahashi.sentry.io/) > Settings > Projects > storybook-vrt-sample > Client Keys |

> **Note:** `NEXT_PUBLIC_SENTRY_DSN` の値は `infra/sentry/` の Terraform が管理する `sentry_key.web` リソースと同一の DSN です。
> DSN はプロジェクト作成時に決まり基本的に変わらないため、Terraform output から自動取得する仕組みは設けず、初回に手動で設定しています。
> 現在の DSN を確認したい場合: `cd infra/sentry && dotenvx run -- terraform output dsn_public`

```bash
cd apps/web

# 復号された全変数を確認
dotenvx get | jq .

# 新しい変数を追加する場合
# 1. .env に平文で追加
# 2. dotenvx encrypt で暗号化
```

#### `infra/cloudflare-access/.env`（Terraform）

| 変数                                | 用途                   | 取得先                                                     |
| ----------------------------------- | ---------------------- | ---------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`              | Cloudflare Access 管理 | Cloudflare > My Profile > API Tokens（権限: Access Edit）  |
| `TF_VAR_github_oauth_client_id`     | GitHub OAuth IdP       | GitHub > Developer Settings > OAuth Apps                   |
| `TF_VAR_github_oauth_client_secret` | GitHub OAuth IdP       | 同上                                                       |
| `TF_VAR_google_oauth_client_id`     | Google OAuth IdP       | Google Cloud Console > Google Auth Platform > クライアント |
| `TF_VAR_google_oauth_client_secret` | Google OAuth IdP       | 同上                                                       |

#### `infra/sentry/.env`（Terraform）

| 変数                | 用途                      | 取得先                                                                                                                                 |
| ------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `SENTRY_AUTH_TOKEN` | Sentry Terraform Provider | [Sentry Auth Tokens](https://suguru-takahashi.sentry.io/settings/auth-tokens/)（権限: project:write, organization:read, alerts:write） |

#### `mcp/.env`（MCP サーバー）

| 変数              | 用途                  | 取得先                                                                                                                                           |
| ----------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `SLACK_BOT_TOKEN` | Slack MCP Server 認証 | [Slack API](https://api.slack.com/apps) > Bot User OAuth Token（権限: channels:history, channels:read, chat:write, reactions:write, users:read） |

`.mcp.json` の Slack MCP サーバーは `dotenvx run -f mcp/.env --` でラップされており、起動時に `mcp/.env` を自動復号してトークンを注入します。

```bash
cd mcp

# 復号された全変数を確認
dotenvx get | jq .

# 新しい変数を追加する場合
# 1. .env に平文で追加
# 2. dotenvx encrypt で暗号化
```

各ワークフローのヘッダーコメントにも必要な Secrets/Variables の説明があります。
