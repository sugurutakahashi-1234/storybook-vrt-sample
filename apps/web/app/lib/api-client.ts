/**
 * API クライアント
 *
 * コントラクトから型安全な oRPC クライアントを生成する。
 * OpenAPILink を使用するため、サーバー側が OpenAPI 形式（@orpc/openapi）で
 * ルーティングしていることが前提。
 */
import { createORPCClient } from "@orpc/client";
import type { ContractRouterClient } from "@orpc/contract";
import { OpenAPILink } from "@orpc/openapi-client/fetch";
import { contract } from "@storybook-vrt-sample/api-contract";

import { DEFAULT_API_BASE_URL } from "@/lib/constants";

/** コントラクトから推論された型安全なクライアント型 */
export type ApiClient = ContractRouterClient<typeof contract>;

/** 指定した baseUrl で oRPC クライアントを生成する */
export const createApiClient = (
  baseUrl: string = DEFAULT_API_BASE_URL
): ApiClient => {
  const link = new OpenAPILink(contract, { url: baseUrl });
  return createORPCClient<ApiClient>(link);
};
