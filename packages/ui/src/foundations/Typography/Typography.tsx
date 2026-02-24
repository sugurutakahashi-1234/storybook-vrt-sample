/** タイポグラフィユーティリティの定義 */
interface TypographyItem {
  /** Tailwind ユーティリティ名 */
  className: string;
  /** 値の説明（"0.75rem (12px)" や "--font-sans"） */
  label: string;
  /** 推奨用途 */
  description: string;
}

/** タイポグラフィセクション */
interface TypographySection {
  /** セクション名 */
  title: string;
  /** セクションに属するアイテム */
  items: TypographyItem[];
  /** サンプルテキストに追加で適用するクラス */
  sizeClass?: string;
}

const sampleText =
  "Hello, World! The quick brown fox (123) jumps over the lazy dog.\n" +
  "こんにちは！お会計は ¥1,280（税込）です。お届け予定日: 2025/01/15";

const sections: TypographySection[] = [
  {
    title: "Font Family",
    items: [
      {
        className: "font-sans",
        label: "--font-sans",
        description: "本文・ボタン・ラベルなど UI テキスト全般（デフォルト）",
      },
      {
        className: "font-serif",
        label: "--font-serif",
        description: "装飾的な見出し・引用ブロック",
      },
      {
        className: "font-mono",
        label: "--font-mono",
        description: "コードスニペット・API レスポンス・技術的な数値の等幅表示",
      },
    ],
    sizeClass: "text-base",
  },
  {
    title: "Font Size",
    items: [
      {
        className: "text-xs",
        label: "0.75rem (12px)",
        description: "キャプション・タイムスタンプ・Badge 内テキスト",
      },
      {
        className: "text-sm",
        label: "0.875rem (14px)",
        description: "フォーム入力・テーブルセル・サイドバーメニュー",
      },
      {
        className: "text-base",
        label: "1rem (16px)",
        description: "本文テキスト・説明文（デフォルト）",
      },
      {
        className: "text-lg",
        label: "1.125rem (18px)",
        description: "カード内セクション見出し・サブタイトル",
      },
      {
        className: "text-xl",
        label: "1.25rem (20px)",
        description: "カードタイトル・モーダルヘッダー・サブヘッダー",
      },
      {
        className: "text-2xl",
        label: "1.5rem (24px)",
        description: "ページタイトル・ダイアログの主見出し",
      },
      {
        className: "text-3xl",
        label: "1.875rem (30px)",
        description: "ヒーローセクション見出し・ダッシュボード KPI",
      },
      {
        className: "text-4xl",
        label: "2.25rem (36px)",
        description: "LP の大見出し・フィーチャーセクションタイトル",
      },
      {
        className: "text-5xl",
        label: "3rem (48px)",
        description: "LP キャッチコピー・プロモーションバナーの数値",
      },
      {
        className: "text-6xl",
        label: "3.75rem (60px)",
        description: "ファーストビューの主要メッセージ・大型バナー",
      },
      {
        className: "text-7xl",
        label: "4.5rem (72px)",
        description: "スプラッシュ画面・全画面ヒーローの特大テキスト",
      },
      {
        className: "text-8xl",
        label: "6rem (96px)",
        description: "カウントダウン表示・イベントページの巨大数値",
      },
      {
        className: "text-9xl",
        label: "8rem (128px)",
        description: "フルスクリーンのロゴ・ブランドステートメント",
      },
    ],
  },
  {
    title: "Font Weight",
    items: [
      {
        className: "font-thin",
        label: "100",
        description: "装飾的なディスプレイ見出し・ヒーローテキスト",
      },
      {
        className: "font-extralight",
        label: "200",
        description: "LP サブタイトル・引用テキスト",
      },
      {
        className: "font-light",
        label: "300",
        description: "リード文・補足説明テキスト",
      },
      {
        className: "font-normal",
        label: "400",
        description: "本文テキスト・説明文・フォーム入力値（デフォルト）",
      },
      {
        className: "font-medium",
        label: "500",
        description: "フォームラベル・ナビゲーションリンク・テーブルヘッダー",
      },
      {
        className: "font-semibold",
        label: "600",
        description: "セクション見出し・ボタンラベル・強調テキスト",
      },
      {
        className: "font-bold",
        label: "700",
        description: "ページタイトル・モーダルヘッダー・重要な見出し",
      },
      {
        className: "font-extrabold",
        label: "800",
        description: "LP キャッチコピー・プロモーションバナー見出し",
      },
      {
        className: "font-black",
        label: "900",
        description: "ブランドロゴ・キャンペーン見出し・最大強調テキスト",
      },
    ],
    sizeClass: "text-base",
  },
  {
    title: "Letter Spacing",
    items: [
      {
        className: "tracking-tighter",
        label: "-0.05em",
        description: "ディスプレイ見出し・ヒーローテキスト",
      },
      {
        className: "tracking-tight",
        label: "-0.025em",
        description: "h1〜h3 見出し・カードタイトル",
      },
      {
        className: "tracking-normal",
        label: "0em",
        description: "本文テキスト・説明文（デフォルト）",
      },
      {
        className: "tracking-wide",
        label: "0.025em",
        description: "ALL CAPS ラベル・ナビゲーションリンク",
      },
      {
        className: "tracking-wider",
        label: "0.05em",
        description: "大文字セクションラベル・Badge テキスト",
      },
      {
        className: "tracking-widest",
        label: "0.1em",
        description: "装飾的な大文字テキスト・フッターリンク",
      },
    ],
    sizeClass: "text-base",
  },
  {
    title: "Line Height",
    items: [
      {
        className: "leading-tight",
        label: "1.25",
        description: "大見出し・ページタイトル・ヒーローテキスト",
      },
      {
        className: "leading-snug",
        label: "1.375",
        description: "カードタイトル・リスト項目の見出し・短い段落",
      },
      {
        className: "leading-normal",
        label: "1.5",
        description: "本文テキスト・説明文（デフォルト）",
      },
      {
        className: "leading-relaxed",
        label: "1.625",
        description: "ブログ記事・ヘルプテキスト・長文の本文",
      },
      {
        className: "leading-loose",
        label: "2",
        description: "注釈付きテキスト・法的文書・利用規約",
      },
    ],
    sizeClass: "text-base",
  },
];

/** ユーティリティ行コンポーネント */
const TypographyRow = ({
  item,
  sizeClass,
}: {
  item: TypographyItem;
  sizeClass?: string | undefined;
}) => (
  <div className="border-border-subtle border-b pb-3 last:border-b-0">
    <div className="mb-1 flex items-baseline gap-3">
      <span className="font-mono text-on-background text-sm">
        {item.className}
      </span>
      <span className="text-on-surface-muted text-xs">{item.label}</span>
      <span className="text-on-surface-muted text-xs">
        — {item.description}
      </span>
    </div>
    <p
      className={`${item.className} ${sizeClass ?? ""} whitespace-pre-line text-on-background`.trim()}
    >
      {sampleText}
    </p>
  </div>
);

/**
 * タイポグラフィコンポーネント
 *
 * 利用可能なフォントファミリー・サイズ・ウェイト・字間・行間のユーティリティ一覧を表示する。
 * Storybook の addon-themes でテーマを切り替えると反映される。
 */
export const Typography = () => (
  <div className="space-y-8 p-6">
    <div>
      <h1 className="font-bold text-2xl text-on-background">Typography</h1>
      <p className="mt-1 text-on-surface-muted">
        利用可能なタイポグラフィユーティリティと推奨用途の一覧です。Tailwind CSS
        v4 デフォルトスケールを使用しています。
      </p>
    </div>

    {sections.map((section) => (
      <section key={section.title}>
        <h2 className="mb-3 border-border-subtle border-b pb-2 font-semibold text-lg text-on-background">
          {section.title}
        </h2>
        <div className="space-y-4">
          {section.items.map((item) => (
            <TypographyRow
              key={item.className}
              item={item}
              sizeClass={section.sizeClass}
            />
          ))}
        </div>
      </section>
    ))}
  </div>
);
