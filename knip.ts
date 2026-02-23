import type { KnipConfig } from "knip";

const config: KnipConfig = {
  // *:baseline:local スクリプトで git archive | tar -x として使用するシステムコマンド
  ignoreBinaries: ["tar"],
  workspaces: {
    ".": {},
    "apps/web": {
      // bun test のテストファイルをエントリーポイントとして認識させる
      entry: ["app/**/*.test.ts!"],
    },
    "packages/ui": {
      entry: ["src/**/*.test.ts!"],
      // vitest --coverage 実行時に動的ロードされるため knip では検出不可
      ignoreDependencies: ["@vitest/coverage-v8"],
    },
  },
};

export default config;
