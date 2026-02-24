/**
 * bun バージョン整合性チェック
 *
 * 1. 実際にインストールされている bun のバージョンと
 *    package.json の packageManager フィールドのバージョンが一致しているか検証する。
 * 2. インストール済みの bun が最新バージョンかどうかを確認する（警告のみ）。
 */

import { join } from "node:path";

const startTime = performance.now();
const rootDir = join(import.meta.dirname, "..");

// package.json から packageManager のバージョンを取得（bun@1.3.9 → 1.3.9）
const pkgJson = await Bun.file(join(rootDir, "package.json")).json();
const { packageManager } = pkgJson;

if (!packageManager) {
  console.error("ERROR: packageManager が package.json に見つかりません");
  process.exit(1);
}

const match = packageManager.match(/^bun@(.+)$/);
if (!match) {
  console.error(`ERROR: packageManager の形式が不正です: ${packageManager}`);
  process.exit(1);
}

const [, pkgVersion] = match;

// bun --version で実際のバージョンを取得
const proc = Bun.spawn(["bun", "--version"], { stdout: "pipe" });
const text = await new Response(proc.stdout).text();
const installedVersion = text.trim();

// package.json と インストール済みバージョンの整合性チェック（不一致はエラー）
if (pkgVersion !== installedVersion) {
  console.error(
    `MISMATCH: インストール済み bun v${installedVersion} != package.json の packageManager bun@${pkgVersion}`
  );
  console.error(
    "\npackage.json の packageManager フィールドを更新してください:"
  );
  console.error(`  "packageManager": "bun@${installedVersion}"`);
  process.exit(1);
}

// 最新バージョンのチェック
try {
  const res = await fetch(
    "https://api.github.com/repos/oven-sh/bun/releases/latest",
    { headers: { Accept: "application/vnd.github.v3+json" } }
  );
  if (res.ok) {
    const data = await res.json();
    const latestVersion = (data.tag_name as string).replace(/^bun-v/, "");
    if (installedVersion !== latestVersion) {
      console.error(
        `OUTDATED: bun v${installedVersion} は最新ではありません（最新: v${latestVersion}）`
      );
      console.error(
        "\nbun を最新に更新し、package.json も合わせて更新してください:"
      );
      console.error("  mise install bun@latest");
      console.error(`  "packageManager": "bun@${latestVersion}"`);
      process.exit(1);
    }
  }
} catch {
  // ネットワークエラー時はスキップ（オフライン環境でもブロックしない）
}

const elapsed = (performance.now() - startTime).toFixed(2);

console.log(`OK: bun バージョン整合性チェック (v${pkgVersion}) [${elapsed}ms]`);
