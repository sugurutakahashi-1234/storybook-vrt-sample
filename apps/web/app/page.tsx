import { Badge, Button, Card, TextField } from "@storybook-vrt-sample/ui";
import Link from "next/link";

/**
 * ホームページ
 *
 * `@storybook-vrt-sample/ui` パッケージの共有コンポーネントを一覧表示するデモページ。
 * 各コンポーネントのバリアントやサイズをブラウザ上で確認できる。
 *
 * ## 掲載コンポーネント
 *
 * | コンポーネント | デモ内容 |
 * |-------------|---------|
 * | **Button** | バリアント（Primary / Secondary / Danger）、サイズ（S / M / L） |
 * | **Card** | Default（シャドウ）、Outlined（ボーダー） |
 * | **Badge** | Info / Success / Warning / Error の 4 バリアント |
 * | **TextField** | デフォルト、ラベル付き、エラー表示、無効状態 |
 *
 * ## ページ構成
 *
 * - **ナビゲーション**: `/todos` への遷移リンク
 * - **セクション**: コンポーネントごとにセクション分けし、代表的なバリエーションを表示
 * - **レスポンシブ**: Card / TextField は `md:grid-cols-2` で 2 カラムレイアウト
 *
 * ## 技術詳細
 *
 * - **データ取得**: なし（静的ページ）
 * - **認証**: 不要
 * - **外部依存**: `next/link`（ページ遷移）、`@storybook-vrt-sample/ui`（UI コンポーネント）
 */
export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 font-bold text-4xl text-on-surface">
        Storybook VRT Sample
      </h1>
      <p className="mb-8 text-lg text-on-surface-muted">
        Playwrightを使ったビジュアルリグレッションテスト（VRT）とE2Eテストのサンプルプロジェクトです。
      </p>

      <nav className="mb-12">
        <Link
          href="/todos"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-on-surface hover:bg-interactive-hover"
        >
          Todo List →
        </Link>
      </nav>

      {/* Button コンポーネントのデモ: バリアント（Primary/Secondary/Danger）とサイズ（S/M/L） */}
      <section className="mb-12">
        <h2 className="mb-4 font-semibold text-2xl text-on-surface">Button</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* Card コンポーネントのデモ: Default（シャドウ）と Outlined（ボーダー） */}
      <section className="mb-12">
        <h2 className="mb-4 font-semibold text-2xl text-on-surface">Card</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card header="Default Card">
            シャドウ付きのデフォルトカードです。様々なコンテンツを格納できます。
          </Card>
          <Card header="Outlined Card" variant="outlined">
            ボーダー付きのアウトラインカードです。軽い印象を与えます。
          </Card>
        </div>
      </section>

      {/* Badge コンポーネントのデモ: Info/Success/Warning/Error の4バリアント */}
      <section className="mb-12">
        <h2 className="mb-4 font-semibold text-2xl text-on-surface">Badge</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="info">Info</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
        </div>
      </section>

      {/* TextField コンポーネントのデモ: Default / WithLabel / WithError / Disabled */}
      <section className="mb-12">
        <h2 className="mb-4 font-semibold text-2xl text-on-surface">
          TextField
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <TextField placeholder="Default text field" />
          <TextField label="Username" placeholder="Enter username..." />
          <TextField
            defaultValue="invalid-email"
            error="Invalid email address"
            label="Email"
          />
          <TextField disabled label="Disabled" placeholder="Cannot type here" />
        </div>
      </section>
    </main>
  );
}
