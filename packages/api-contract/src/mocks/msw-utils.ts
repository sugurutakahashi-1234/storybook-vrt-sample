/**
 * 汎用 MSW ユーティリティ（エラー・ローディング）
 *
 * コントラクトのルート定義からエンドポイントを解決し、
 * エラーやローディング状態のハンドラーを生成する。
 * リソースに依存しないため、どのエンドポイントにもそのまま使える。
 */
import type { HttpHandler } from "msw";
import { delay, http, HttpResponse } from "msw";

interface ContractProcedureLike {
  "~orpc": { route: { method?: string; path?: string } };
}

type HttpMethod =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "head"
  | "options";

/** contract route から MSW パスに変換: {id} → :id */
const toMswPath = (baseUrl: string, path: string): string =>
  `${baseUrl}${path.replaceAll(/\{(\w+)\}/g, ":$1")}`;

/**
 * コントラクトのルート定義から HTTP メソッドとパスを取得する。
 * 例: contract.todo の "list" → { method: "get", path: "/todos" }
 */
const resolveHandler = <T extends Record<string, ContractProcedureLike>>(
  router: T,
  endpoint: keyof T & string
): { method: HttpMethod; path: string } => {
  const procedure = router[endpoint] as ContractProcedureLike;
  const { route } = procedure["~orpc"];
  if (!route.method || !route.path) {
    throw new Error(
      `Contract route for "${endpoint}" is missing method or path`
    );
  }
  return {
    method: route.method.toLowerCase() as HttpMethod,
    path: route.path,
  };
};

/** 指定エンドポイントの 500 エラーハンドラーを生成 */
export const createContractErrorHandlers = <
  T extends Record<string, ContractProcedureLike>,
>(
  baseUrl: string,
  router: T,
  endpoints: (keyof T & string)[]
): HttpHandler[] =>
  endpoints.map((endpoint) => {
    const { method, path } = resolveHandler(router, endpoint);
    return http[method](toMswPath(baseUrl, path), () =>
      HttpResponse.json({ message: "Internal Server Error" }, { status: 500 })
    );
  });

/** 指定エンドポイントのローディングハンドラーを生成（レスポンスを返さない） */
export const createContractLoadingHandlers = <
  T extends Record<string, ContractProcedureLike>,
>(
  baseUrl: string,
  router: T,
  endpoints: (keyof T & string)[]
): HttpHandler[] =>
  endpoints.map((endpoint) => {
    const { method, path } = resolveHandler(router, endpoint);
    return http[method](toMswPath(baseUrl, path), async () => {
      await delay("infinite");
    });
  });
