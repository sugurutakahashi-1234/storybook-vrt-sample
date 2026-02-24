import { describe, expect, test } from "bun:test";

import { formatPageTitle } from "./format";

describe("formatPageTitle", () => {
  test("引数なしの場合はサイト名のみ返す", () => {
    expect(formatPageTitle()).toBe("Storybook VRT Sample");
  });

  test("ページ名を指定するとサイト名と結合する", () => {
    expect(formatPageTitle("About")).toBe("About | Storybook VRT Sample");
  });

  test("空文字の場合はサイト名のみ返す", () => {
    expect(formatPageTitle("")).toBe("Storybook VRT Sample");
  });
});
