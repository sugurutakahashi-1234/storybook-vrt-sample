/**
 * MSW ブラウザ統合
 *
 * Service Worker を使って fetch リクエストをインターセプトし、
 * api-contract のモックハンドラーでレスポンスを返す。
 * instrumentation-client.ts から NEXT_PUBLIC_MSW_ENABLED=true のときのみ動的 import される。
 *
 * public/mockServiceWorker.js は `npx msw init public/` で自動生成されたファイル。
 * MSW のバージョンと一致している必要があるため、git にコミットして管理する。
 * MSW アップデート時は再生成すること。
 */
import { createTodoHandlers } from "@storybook-vrt-sample/api-contract/mocks";
import { setupWorker } from "msw/browser";

import { DEFAULT_API_BASE_URL } from "@/lib/constants";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL;

export const worker = setupWorker(...createTodoHandlers(API_BASE_URL));
