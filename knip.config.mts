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
      entry: ["app/**/*.test.ts!"],
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
