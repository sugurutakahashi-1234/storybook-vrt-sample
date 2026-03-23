import type { KnipConfig } from "knip";

const config: KnipConfig = {
  // *:reg:local スクリプトで git archive | tar -x として使用するシステムコマンド
  ignoreBinaries: ["tar"],
  workspaces: {
    "apps/api": {
      // Bun.serve のエントリポイント（bun run --hot で直接実行される）
      entry: ["src/index.ts!"],
    },
    "apps/web": {
      // bun test のテストファイルをエントリーポイントとして認識させる
      // open-next.config.ts は opennextjs-cloudflare build 時に読み込まれる設定ファイル
      // app/mocks/noop.ts は next.config.ts の turbopack.resolveAlias で参照される
      entry: [
        "app/**/*.test.ts!",
        "open-next.config.ts!",
        "app/mocks/noop.ts!",
      ],
    },
    "packages/ui": {
      entry: ["src/**/*.test.ts!"],
      ignoreDependencies: [
        // vitest --coverage 実行時に動的ロードされるため knip では検出不可
        "@vitest/coverage-v8",
      ],
    },
  },
};

export default config;
