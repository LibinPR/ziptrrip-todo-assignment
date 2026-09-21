import { useEffect, useMemo, useState } from "react";

import TodoForm from "../components/TodoForm";
import TodoItem from "../components/TodoItem";
import TodoSkeleton from "../components/TodoSkeleton";
import ConfirmDialog from "../components/ConfirmDialog";

import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../services/todoApi";

import type { Todo } from "../types/todo";

import "../components/TodoItem.css";
import "./TodoList.css";

type Filter = "all" | "active" | "completed";

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    async function loadTodos() {
      try {
        setLoading(true);
        setError(null);

        const data = await getTodos();

        setTodos(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load todos.");
      } finally {
        setLoading(false);
      }
    }

    loadTodos();
  }, []);

  const handleCreate = async (data: {
    title: string;
    description?: string;
    priority?: "LOW" | "MEDIUM" | "HIGH";
    dueDate?: string;
  }) => {
    try {
      setError(null);

      const createdTodo = await createTodo(data);

      setTodos((currentTodos) => [
        createdTodo,
        ...currentTodos,
      ]);
    } catch (error) {
      console.error(error);

      setError("Unable to create todo.");

      throw error;
    }
  };

  const handleToggle = async (todo: Todo) => {
    try {
      setError(null);

      const updatedTodo = await updateTodo(todo.id, {
        completed: !todo.completed,
      });

      setTodos((currentTodos) =>
        currentTodos.map((currentTodo) =>
          currentTodo.id === updatedTodo.id
            ? updatedTodo
            : currentTodo,
        ),
      );
    } catch (error) {
      console.error(error);

      setError("Unable to update todo.");
    }
  };

  /**
   * Open the custom confirmation dialog.
   *
   * We intentionally don't delete here.
   */
  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  /**
   * Actually delete the todo after the user confirms.
   */
  const confirmDelete = async () => {
    if (deleteId === null) {
      return;
    }

    try {
      setError(null);

      await deleteTodo(deleteId);

      setTodos((currentTodos) =>
        currentTodos.filter(
          (todo) => todo.id !== deleteId,
        ),
      );
    } catch (error) {
      console.error(error);

      setError("Unable to delete todo.");
    } finally {
      setDeleteId(null);
    }
  };

  const activeCount = todos.filter(
    (todo) => !todo.completed,
  ).length;

  const completedCount = todos.filter(
    (todo) => todo.completed,
  ).length;

  const filteredTodos = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return todos.filter((todo) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && !todo.completed) ||
        (filter === "completed" && todo.completed);

      const matchesSearch =
        normalizedSearch.length === 0 ||
        todo.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        (todo.description ?? "")
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [todos, filter, search]);

  if (loading) {
    return (
      <div className="app-shell">
        <main className="todo-page">
          <header className="todo-page__header">
            <div>
              <p className="todo-page__eyebrow">
                YOUR TASKS
              </p>

              <h1>TodoFlow</h1>

              <p className="todo-page__subtitle">
                Stay on top of what matters.
              </p>
            </div>
          </header>

          <div className="todo-list">
            <TodoSkeleton />
            <TodoSkeleton />
            <TodoSkeleton />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <main className="todo-page">
        <header className="todo-page__header">
          <div>
            <p className="todo-page__eyebrow">
              YOUR TASKS
            </p>

            <h1>TodoFlow</h1>

            <p className="todo-page__subtitle">
              Stay on top of what matters.
            </p>
          </div>

          <div className="todo-page__stats">
            <strong>{activeCount}</strong>

            <span>
              active{" "}
              {activeCount === 1 ? "task" : "tasks"}
            </span>
          </div>
        </header>

        <TodoForm onCreate={handleCreate} />

        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}

        <section className="todo-toolbar">
          <div
            className="filter-group"
            aria-label="Todo filters"
          >
            <button
              type="button"
              className={
                filter === "all"
                  ? "filter-button active"
                  : "filter-button"
              }
              onClick={() => setFilter("all")}
            >
              All
              <span>{todos.length}</span>
            </button>

            <button
              type="button"
              className={
                filter === "active"
                  ? "filter-button active"
                  : "filter-button"
              }
              onClick={() => setFilter("active")}
            >
              Active
              <span>{activeCount}</span>
            </button>

            <button
              type="button"
              className={
                filter === "completed"
                  ? "filter-button active"
                  : "filter-button"
              }
              onClick={() => setFilter("completed")}
            >
              Completed
              <span>{completedCount}</span>
            </button>
          </div>

          <div className="search-wrapper">
            <input
              type="search"
              aria-label="Search todos"
              placeholder="Search tasks..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>
        </section>

        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <h2>
              {search
                ? "No matching tasks"
                : filter === "completed"
                  ? "Nothing completed yet"
                  : filter === "active"
                    ? "You're all caught up"
                    : "No tasks yet"}
            </h2>

            <p>
              {search
                ? "Try a different search term."
                : "Create your first task to get started."}
            </p>
          </div>
        ) : (
          <div className="todo-list">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <ConfirmDialog
          open={deleteId !== null}
          title="Delete this task?"
          message="This action cannot be undone. The task will be permanently removed."
          confirmLabel="Delete task"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      </main>
    </div>
  );
}

export default TodoList;