import { describe, expect, test } from "bun:test";

import { cn } from "./cn";

describe("cn", () => {
  test("複数のクラス名を結合する", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  test("競合する Tailwind クラスは後勝ちでマージする", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  test("ファルシーな値は除去する", () => {
    expect(cn("px-2", false, undefined, null, "mt-4")).toBe("px-2 mt-4");
  });

  test("条件付きオブジェクト構文をサポートする", () => {
    expect(cn("base", { active: true, disabled: false })).toBe("base active");
  });

  test("空の入力は空文字を返す", () => {
    expect(cn()).toBe("");
  });
});
