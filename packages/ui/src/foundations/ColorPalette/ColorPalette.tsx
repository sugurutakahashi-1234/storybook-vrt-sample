/** カラートークンの定義 */
interface ColorToken {
  /** 用途の説明 */
  description: string;
  /** Tailwind ユーティリティ名（例: primary） */
  name: string;
  /** CSS 変数名（例: --color-primary） */
  variable: string;
}

/** カラートークングループ */
interface ColorGroup {
  /** グループ名 */
  title: string;
  /** グループに属するトークン */
  tokens: ColorToken[];
}

/** セマンティックカラートークン一覧 */
const colorGroups: ColorGroup[] = [
  {
    title: "Surface",
    tokens: [
      {
        variable: "--color-background",
        name: "background",
        description: "ページ背景",
      },
      {
        variable: "--color-surface",
        name: "surface",
        description: "カード・入力欄の背景",
      },
      {
        variable: "--color-on-background",
        name: "on-background",
        description: "ページ上テキスト",
      },
      {
        variable: "--color-on-surface",
        name: "on-surface",
        description: "カード内テキスト、ラベル",
      },
      {
        variable: "--color-on-surface-muted",
        name: "on-surface-muted",
        description: "補助テキスト",
      },
    ],
  },
  {
    title: "Border",
    tokens: [
      {
        variable: "--color-border",
        name: "border",
        description: "標準ボーダー",
      },
      {
        variable: "--color-border-subtle",
        name: "border-subtle",
        description: "Card header 等の薄いボーダー",
      },
      {
        variable: "--color-border-input",
        name: "border-input",
        description: "入力欄ボーダー",
      },
      {
        variable: "--color-border-input-strong",
        name: "border-input-strong",
        description: "outlined 入力欄ボーダー",
      },
    ],
  },
  {
    title: "Primary",
    tokens: [
      {
        variable: "--color-primary",
        name: "primary",
        description: "Primary ボタン",
      },
      {
        variable: "--color-primary-hover",
        name: "primary-hover",
        description: "Primary ホバー",
      },
      {
        variable: "--color-on-primary",
        name: "on-primary",
        description: "Primary 上テキスト",
      },
    ],
  },
  {
    title: "Secondary",
    tokens: [
      {
        variable: "--color-secondary",
        name: "secondary",
        description: "Secondary ボタン",
      },
      {
        variable: "--color-secondary-hover",
        name: "secondary-hover",
        description: "Secondary ホバー",
      },
      {
        variable: "--color-on-secondary",
        name: "on-secondary",
        description: "Secondary 上テキスト",
      },
    ],
  },
  {
    title: "Danger",
    tokens: [
      {
        variable: "--color-danger",
        name: "danger",
        description: "Danger ボタン",
      },
      {
        variable: "--color-danger-hover",
        name: "danger-hover",
        description: "Danger ホバー",
      },
      {
        variable: "--color-on-danger",
        name: "on-danger",
        description: "Danger 上テキスト",
      },
    ],
  },
  {
    title: "Error",
    tokens: [
      {
        variable: "--color-error",
        name: "error",
        description: "エラーボーダー",
      },
      {
        variable: "--color-error-text",
        name: "error-text",
        description: "エラーメッセージ",
      },
    ],
  },
  {
    title: "Ring",
    tokens: [
      {
        variable: "--color-ring",
        name: "ring",
        description: "フォーカスリング",
      },
      {
        variable: "--color-ring-offset",
        name: "ring-offset",
        description: "リングオフセット背景",
      },
    ],
  },
  {
    title: "Badge",
    tokens: [
      {
        variable: "--color-badge-info-bg",
        name: "badge-info-bg",
        description: "Info 背景",
      },
      {
        variable: "--color-badge-info-text",
        name: "badge-info-text",
        description: "Info テキスト",
      },
      {
        variable: "--color-badge-success-bg",
        name: "badge-success-bg",
        description: "Success 背景",
      },
      {
        variable: "--color-badge-success-text",
        name: "badge-success-text",
        description: "Success テキスト",
      },
      {
        variable: "--color-badge-warning-bg",
        name: "badge-warning-bg",
        description: "Warning 背景",
      },
      {
        variable: "--color-badge-warning-text",
        name: "badge-warning-text",
        description: "Warning テキスト",
      },
      {
        variable: "--color-badge-error-bg",
        name: "badge-error-bg",
        description: "Error 背景",
      },
      {
        variable: "--color-badge-error-text",
        name: "badge-error-text",
        description: "Error テキスト",
      },
    ],
  },
  {
    title: "Interactive",
    tokens: [
      {
        variable: "--color-interactive-muted",
        name: "interactive-muted",
        description: "アイコン色",
      },
      {
        variable: "--color-interactive-hover",
        name: "interactive-hover",
        description: "ホバー背景",
      },
    ],
  },
];

/** 単一カラースウォッチ */
function ColorSwatch({ token }: { token: ColorToken }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-10 w-10 shrink-0 rounded-md border border-border"
        style={{ backgroundColor: `var(${token.variable})` }}
      />
      <div className="min-w-0">
        <p className="font-mono text-on-background text-sm">{token.variable}</p>
        <p className="text-on-surface-muted text-xs">{token.description}</p>
      </div>
    </div>
  );
}

/**
 * カラーパレットコンポーネント
 *
 * セマンティックカラートークンの一覧をグループごとに表示する。
 * Storybook の addon-themes でテーマを切り替えると dark 値がリアルタイムで反映される。
 */
export function ColorPalette() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="font-bold text-2xl text-on-background">Color Palette</h1>
        <p className="mt-1 text-on-surface-muted">
          セマンティックカラートークンの一覧です。テーマを切り替えると値が変化します。
        </p>
      </div>

      {colorGroups.map((group) => (
        <section key={group.title}>
          <h2 className="mb-3 border-border-subtle border-b pb-2 font-semibold text-lg text-on-background">
            {group.title}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.tokens.map((token) => (
              <ColorSwatch key={token.variable} token={token} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
