import type { KnipConfig } from "knip";

const config: KnipConfig = {
  workspaces: {
    ".": {},
    "apps/web": {
      // bun test のテストファイルをエントリーポイントとして認識させる
      entry: ["app/**/*.test.ts!"],
    },
    "packages/ui": {
      entry: ["src/**/*.test.ts!"],
    },
  },
};

export default config;
