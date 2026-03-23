"use client";

import type { Todo } from "@storybook-vrt-sample/api-contract";
import { Button } from "@ui/components/Button";
import { Card } from "@ui/components/Card";
import { Checkbox } from "@ui/components/Checkbox";
import { ErrorBanner } from "@ui/components/ErrorBanner";
import { TextField } from "@ui/components/TextField";
import { useCallback, useState } from "react";

export interface TodoListProps {
  /** タスク一覧 */
  todos: Todo[];
  /** 初回取得中のローディング状態 */
  loading: boolean;
  /** API エラーメッセージ。一覧なしならエラー画面、一覧ありならインラインバナーで表示 */
  error: string | null;
  /** タスクの完了/未完了をトグルする */
  onToggle: (id: string) => void;
  /** 新しいタスクを作成する */
  onCreate: (title: string) => void;
  /** 一覧取得失敗時の再試行。未指定の場合 Retry ボタンは表示されない */
  onRetry?: () => void;
}

const TodoItem = ({
  todo,
  onToggle,
}: {
  todo: Todo;
  onToggle: (id: string) => void;
}) => {
  const handleChange = useCallback(() => {
    onToggle(todo.id);
  }, [onToggle, todo.id]);

  return (
    <li>
      <Checkbox
        checked={todo.completed}
        onChange={handleChange}
        label={todo.title || "Empty"}
        className={
          todo.completed
            ? "text-on-surface-muted line-through"
            : "text-on-surface"
        }
      />
    </li>
  );
};

const TodoForm = ({ onCreate }: { onCreate: (title: string) => void }) => {
  const [newTitle, setNewTitle] = useState("");

  const handleCreate = useCallback(() => {
    if (!newTitle.trim()) {
      return;
    }
    onCreate(newTitle);
    setNewTitle("");
  }, [newTitle, onCreate]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewTitle(e.target.value);
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleCreate();
      }
    },
    [handleCreate]
  );

  return (
    <div className="mb-4 flex gap-2">
      <TextField
        value={newTitle}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="New todo..."
        aria-label="New todo title"
        className="flex-1"
      />
      <Button size="sm" onClick={handleCreate}>
        Add
      </Button>
    </div>
  );
};

export const TodoList = ({
  todos,
  loading,
  error,
  onToggle,
  onCreate,
  onRetry,
}: TodoListProps) => {
  if (loading) {
    return <p className="text-on-surface-muted">Loading...</p>;
  }

  // 一覧取得失敗: エラーメッセージ + Retry ボタンのみ表示
  if (error && todos.length === 0 && onRetry) {
    return (
      <Card variant="outlined" header="Todo List" className="w-96">
        <ErrorBanner message={error} onRetry={onRetry} />
      </Card>
    );
  }

  return (
    <Card variant="outlined" header="Todo List" className="w-96">
      {/* 操作失敗: 既存 UI の上にインラインバナーで表示 */}
      {error && (
        <div className="mb-4">
          <ErrorBanner message={error} />
        </div>
      )}
      <TodoForm onCreate={onCreate} />
      {todos.length === 0 ? (
        <p className="text-on-surface-muted">No todos yet</p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onToggle={onToggle} />
          ))}
        </ul>
      )}
    </Card>
  );
};
