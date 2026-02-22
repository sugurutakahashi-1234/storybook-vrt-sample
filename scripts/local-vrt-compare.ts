/**
 * ローカルでベースブランチとのスクリーンショット比較を行うスクリプト
 *
 * git worktree を使ってベースブランチからベースラインを動的生成し、
 * 現在のブランチのスクリーンショットと reg-cli で比較する。
 *
 * 使い方:
 *   bun run storybook:local-vrt-compare                    # Storybook VRT: current vs main
 *   bun run storybook:local-vrt-compare --base develop     # Storybook VRT: current vs develop
 *   bun run e2e:local-vrt-compare                          # E2E: current vs main
 *   bun run all:local-vrt-compare                          # 両方
 */

import { join } from "node:path";

const rootDir = join(import.meta.dirname, "..");

// --- 引数パース ---
const args = process.argv.slice(2);

let target = "all";
let baseBranch = "main";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--base" && args[i + 1]) {
    baseBranch = args[i + 1];
    i++;
  } else if (["storybook", "e2e", "all"].includes(args[i])) {
    target = args[i];
  }
}

const startTime = performance.now();

console.log(`Target: ${target}`);
console.log(`Base branch: ${baseBranch}`);

// --- ヘルパー関数 ---
const run = (cmd: string[], cwd: string) => {
  console.log(`  > ${cmd.join(" ")} (in ${cwd})`);
  const proc = Bun.spawnSync(cmd, {
    cwd,
    stdout: "inherit",
    stderr: "inherit",
  });
  return proc.exitCode;
};

const runOrFail = (cmd: string[], cwd: string) => {
  const code = run(cmd, cwd);
  if (code !== 0) {
    console.error(`ERROR: コマンドが失敗しました (exit code ${code})`);
    process.exit(code);
  }
};

const baselineDir = "/tmp/baseline";

// --- Step 1: ベースラインを動的生成 ---
console.log("\n--- Step 1: ベースブランチからベースラインを生成 ---");

// 既存の worktree があれば削除
run(["git", "worktree", "remove", baselineDir, "--force"], rootDir);

runOrFail(
  ["git", "worktree", "add", baselineDir, `origin/${baseBranch}`, "--detach"],
  rootDir
);

runOrFail(["bun", "install", "--frozen-lockfile"], baselineDir);

if (target === "storybook" || target === "all") {
  console.log("\n--- Generating Storybook VRT baseline ---");
  const vrtDir = join(baselineDir, "packages/ui");
  runOrFail(["bun", "run", "build-storybook"], vrtDir);
  run(["bunx", "playwright", "test"], vrtDir); // テスト失敗は無視

  // ベースラインをコピー
  runOrFail(
    [
      "bash",
      "-c",
      `mkdir -p ${rootDir}/packages/ui/.reg/expected && cp -r ${vrtDir}/.reg/actual/* ${rootDir}/packages/ui/.reg/expected/`,
    ],
    rootDir
  );
}

if (target === "e2e" || target === "all") {
  console.log("\n--- Generating E2E baseline ---");
  const e2eDir = join(baselineDir, "apps/web");
  runOrFail(["bun", "run", "build"], e2eDir);
  run(["bunx", "playwright", "test"], e2eDir); // テスト失敗は無視

  // ベースラインをコピー
  runOrFail(
    [
      "bash",
      "-c",
      `mkdir -p ${rootDir}/apps/web/.reg/expected && cp -r ${e2eDir}/.reg/actual/* ${rootDir}/apps/web/.reg/expected/`,
    ],
    rootDir
  );
}

// worktree 削除
run(["git", "worktree", "remove", baselineDir, "--force"], rootDir);

// --- Step 2: 現在のブランチでスクリーンショット生成 ---
console.log("\n--- Step 2: 現在のブランチでスクリーンショットを生成 ---");

if (target === "storybook" || target === "all") {
  console.log("\n--- Running Storybook VRT ---");
  const vrtDir = join(rootDir, "packages/ui");
  runOrFail(["bun", "run", "build-storybook"], vrtDir);
  run(["bunx", "playwright", "test"], vrtDir);
}

if (target === "e2e" || target === "all") {
  console.log("\n--- Running E2E ---");
  const e2eDir = join(rootDir, "apps/web");
  runOrFail(["bun", "run", "build"], e2eDir);
  run(["bunx", "playwright", "test"], e2eDir);
}

// --- Step 3: reg-cli で比較 ---
console.log("\n--- Step 3: reg-cli で比較レポートを生成 ---");

if (target === "storybook" || target === "all") {
  console.log("\n--- Storybook VRT reg-cli ---");
  run(["bun", "run", "vrt:report:reg"], join(rootDir, "packages/ui"));
}

if (target === "e2e" || target === "all") {
  console.log("\n--- E2E reg-cli ---");
  run(["bun", "run", "e2e:report:reg"], join(rootDir, "apps/web"));
}

const elapsedSec = ((performance.now() - startTime) / 1000).toFixed(1);
console.log(`\nDone! [${elapsedSec}s]`);
