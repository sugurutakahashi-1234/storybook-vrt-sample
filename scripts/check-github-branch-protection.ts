/**
 * Required Status Checks 整合性チェック
 *
 * GitHub の Branch Protection に登録された required status checks が、
 * 実際のワークフローファイルのジョブ名と一致しているか検証する。
 * ワークフローのジョブ名を変更した際に、required checks との不整合を検出する。
 *
 * 使い方:
 *   bun run required-checks
 *
 * 必要な権限:
 *   gh CLI でリポジトリの Branch Protection を読み取れること
 */

import { readdirSync } from "node:fs";
import { join } from "node:path";

const startTime = performance.now();
const rootDir = join(import.meta.dirname, "..");
const workflowDir = join(rootDir, ".github", "workflows");

// ── ワークフローファイルからジョブ名を抽出 ──

const jobNames = new Set<string>();

for (const file of readdirSync(workflowDir).filter((f) => f.endsWith(".yml"))) {
  const content = await Bun.file(join(workflowDir, file)).text();
  const workflow = Bun.YAML.parse(content) as {
    jobs?: Record<string, { name?: string }>;
  };

  if (workflow?.jobs) {
    for (const job of Object.values(workflow.jobs)) {
      if (job?.name) {
        jobNames.add(job.name);
      }
    }
  }
}

// ── GitHub API から required status checks を取得 ──

const proc = Bun.spawn(
  [
    "gh",
    "api",
    "repos/{owner}/{repo}/branches/main/protection/required_status_checks",
    "--jq",
    ".checks[].context",
  ],
  { stdout: "pipe", stderr: "pipe" }
);

const stdout = await new Response(proc.stdout).text();
const stderr = await new Response(proc.stderr).text();
const exitCode = await proc.exited;

if (exitCode !== 0) {
  console.error("ERROR: GitHub API からの取得に失敗しました");
  console.error(stderr);
  console.error("\ngh CLI が認証されているか確認してください: gh auth status");
  process.exit(1);
}

const requiredChecks = stdout
  .trim()
  .split("\n")
  .filter((s) => s.length > 0);

// ── 突合チェック ──

const missing = requiredChecks.filter((check) => !jobNames.has(check));

if (missing.length > 0) {
  console.error(
    "MISMATCH: 以下の required status checks に一致するジョブ名がワークフローに存在しません:\n"
  );
  for (const m of missing) {
    console.error(`  ❌ ${m}`);
  }
  console.error(
    "\nワークフローのジョブ名を変更した場合は、GitHub の Branch Protection も更新してください。"
  );
  console.error(
    "Settings → Branches → Branch protection rules → Require status checks"
  );
  process.exit(1);
}

const elapsed = (performance.now() - startTime).toFixed(2);

console.log(
  `OK: Required Status Checks 整合性チェック (${requiredChecks.length} checks) [${elapsed}ms]`
);
