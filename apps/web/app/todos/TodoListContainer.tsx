"use client";

/**
 * TodoList Container コンポーネント
 *
 * oRPC クライアント経由で API サーバーと通信する TODO 管理コンポーネント。
 * apiBaseUrl を props で受け取ることで、環境ごとに接続先を切り替えられる。
 */
import type { Todo } from "@storybook-vrt-sample/api-contract";
import { TodoList } from "@storybook-vrt-sample/ui";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { ApiClient } from "@/lib/api-client";
import { createApiClient } from "@/lib/api-client";

/** TODO の CRUD 操作をまとめたカスタムフック */
const useTodos = (client: ApiClient) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await client.todo.list();
      setTodos(data);
      setError(null);
    } catch {
      setError("Failed to load todos.");
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    const load = async () => {
      await fetchTodos();
    };
    // eslint-disable-next-line no-void -- useEffect does not support async return
    void load();
  }, [fetchTodos]);

  const toggle = useCallback(
    async (id: string) => {
      // 楽観的更新: API 応答を待たずに即座に UI を反映し、カクつきを防ぐ
      const previousTodos = todos;
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
      try {
        await client.todo.toggle({ id });
      } catch {
        // 失敗時はロールバック
        setTodos(previousTodos);
        setError("Failed to toggle todo.");
      }
    },
    [client, todos]
  );

  const create = useCallback(
    async (title: string) => {
      try {
        await client.todo.create({ title });
        await fetchTodos();
      } catch {
        setError("Failed to create todo.");
      }
    },
    [client, fetchTodos]
  );

  return { todos, loading, error, toggle, create, retry: fetchTodos };
};

export const TodoListContainer = ({ apiBaseUrl }: { apiBaseUrl?: string }) => {
  const client = useMemo(() => createApiClient(apiBaseUrl), [apiBaseUrl]);
  const { todos, loading, error, toggle, create, retry } = useTodos(client);

  const handleToggle = useCallback(
    (id: string) => {
      // eslint-disable-next-line no-void -- fire-and-forget toggle
      void toggle(id);
    },
    [toggle]
  );

  const handleCreate = useCallback(
    (title: string) => {
      // eslint-disable-next-line no-void -- fire-and-forget create
      void create(title);
    },
    [create]
  );

  return (
    <TodoList
      todos={todos}
      loading={loading}
      error={error}
      onToggle={handleToggle}
      onCreate={handleCreate}
      onRetry={retry}
    />
  );
};
