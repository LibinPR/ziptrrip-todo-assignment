import { useEffect, useState } from "react";
import {
  ArrowLeft,
  // CalendarDays,
  Check,
  Edit3,
  Save,
  X,
} from "lucide-react";
import type { Priority, Todo } from "../types/todo";
import {
  getTodoById,
  updateTodo,
} from "../services/todoApi";
import "./TodoDetails.css";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getDueDateStatus(
  dueDate: string | null,
  completed: boolean,
) {
  if (!dueDate) {
    return "none";
  }

  if (completed) {
    return "completed";
  }

  const date = new Date(dueDate);

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  const dueDay = new Date(year, month, day);

  const today = new Date();
  const todayDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const differenceInDays = Math.round(
    (dueDay.getTime() - todayDay.getTime()) /
      (1000 * 60 * 60 * 24),
  );

  if (differenceInDays < 0) {
    return "overdue";
  }

  if (differenceInDays === 0) {
    return "today";
  }

  return "upcoming";
}


function TodoDetails() {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    async function loadTodo() {
      const params = new URLSearchParams(window.location.search);
      const id = Number(params.get("id"));

      if (!Number.isInteger(id) || id <= 0) {
        setError("Invalid todo ID.");
        setLoading(false);
        return;
      }

      try {
        const data = await getTodoById(id);

        setTodo(data);
        setTitle(data.title);
        setDescription(data.description ?? "");
        setPriority(data.priority);
        setDueDate(data.dueDate ? data.dueDate.slice(0, 10) : "");
      } catch (error) {
        console.error(error);
        setError("Unable to load this todo.");
      } finally {
        setLoading(false);
      }
    }

    loadTodo();
  }, []);

  const handleSave = async () => {
    if (!todo || !title.trim()) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const updatedTodo = await updateTodo(todo.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate
          ? `${dueDate}T12:00:00.000Z`
          : null,
      });

      setTodo(updatedTodo);
      setEditing(false);
    } catch (error) {
      console.error(error);
      setError("Unable to update todo.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async () => {
    if (!todo) {
      return;
    }

    try {
      setError(null);

      const updatedTodo = await updateTodo(todo.id, {
        completed: !todo.completed,
      });

      setTodo(updatedTodo);
    } catch (error) {
      console.error(error);
      setError("Unable to update todo.");
    }
  };

  if (loading) {
    return (
      <div className="todo-details-shell">
        <main className="todo-details">
          <p>Loading todo...</p>
        </main>
      </div>
    );
  }

  if (error && !todo) {
    return (
      <div className="todo-details-shell">
        <main className="todo-details">
          <button
            className="todo-details__back"
            onClick={() => (window.location.href = "/")}
          >
            <ArrowLeft size={16} />
            Back to tasks
          </button>

          <div className="empty-state">
            <h2>{error}</h2>
            <p>The requested todo could not be loaded.</p>
          </div>
        </main>
      </div>
    );
  }

  if (!todo) {
    return null;
  }

    const dueDateStatus = getDueDateStatus(
    todo.dueDate,
    todo.completed,
  );

  return (
    <div className="todo-details-shell">
      <main className="todo-details">
        <button
          className="todo-details__back"
          onClick={() => (window.location.href = "/")}
        >
          <ArrowLeft size={16} />
          Back to tasks
        </button>

        <section className="todo-details__card">
          {editing ? (
            <div className="todo-details__edit">
              <div className="todo-details__badges">
                <span className="todo-details__status">
                  Editing
                </span>
              </div>

              <div className="todo-details__edit-grid">
                <div className="todo-details__field">
                  <label htmlFor="todo-title">Title</label>

                  <input
                    id="todo-title"
                    value={title}
                    maxLength={200}
                    onChange={(event) =>
                      setTitle(event.target.value)
                    }
                  />
                </div>

                <div className="todo-details__field">
                  <label htmlFor="todo-description">
                    Description
                  </label>

                  <textarea
                    id="todo-description"
                    value={description}
                    maxLength={1000}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                  />
                </div>

                <div className="todo-details__field">
                  <label htmlFor="todo-priority">
                    Priority
                  </label>

                  <select
                    id="todo-priority"
                    value={priority}
                    onChange={(event) =>
                      setPriority(
                        event.target.value as Priority,
                      )
                    }
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div className="todo-details__field">
                  <label htmlFor="todo-due-date">
                    Due date
                  </label>

                  <input
                    id="todo-due-date"
                    type="date"
                    value={dueDate}
                    onChange={(event) =>
                      setDueDate(event.target.value)
                    }
                  />
                </div>

                {error && (
                  <div className="error-banner">
                    {error}
                  </div>
                )}

                <div className="todo-details__edit-actions">
                  <button
                    className="todo-details__button"
                    onClick={() => setEditing(false)}
                    disabled={saving}
                  >
                    <X size={15} />
                    Cancel
                  </button>

                  <button
                    className="todo-details__button todo-details__button--primary"
                    onClick={handleSave}
                    disabled={saving || !title.trim()}
                  >
                    <Save size={15} />
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="todo-details__header">
                <div className="todo-details__badges">
                  <span
                    className={`todo-details__status ${
                      todo.completed
                        ? "todo-details__status--completed"
                        : ""
                    }`}
                  >
                    {todo.completed ? "Completed" : "Active"}
                  </span>

                  <span
                    className={`todo-details__priority todo-details__priority--${todo.priority.toLowerCase()}`}
                  >
                    {todo.priority}
                  </span>
                </div>

                <h1 className="todo-details__title">
                  {todo.title}
                </h1>

                {todo.description && (
                  <p className="todo-details__description">
                    {todo.description}
                  </p>
                )}
              </div>

              <div className="todo-details__metadata">
                <div className="todo-details__metadata-item">
                  <span className="todo-details__label">
                    Due date
                  </span>

                  <span
                    className={`todo-details__value todo-details__value--due-${dueDateStatus}`}
                  >
                    {todo.dueDate
                      ? formatDate(todo.dueDate)
                      : "No due date"}
                  </span>
                </div>

                <div className="todo-details__metadata-item">
                  <span className="todo-details__label">
                    Status
                  </span>

                  <span className="todo-details__value">
                    {todo.completed
                      ? "Completed"
                      : "In progress"}
                  </span>
                </div>

                <div className="todo-details__metadata-item">
                  <span className="todo-details__label">
                    Created
                  </span>

                  <span className="todo-details__value">
                    {formatDateTime(todo.createdAt)}
                  </span>
                </div>

                <div className="todo-details__metadata-item">
                  <span className="todo-details__label">
                    Last updated
                  </span>

                  <span className="todo-details__value">
                    {formatDateTime(todo.updatedAt)}
                  </span>
                </div>
              </div>

              <div className="todo-details__actions">
                <button
                  className="todo-details__button"
                  onClick={handleToggle}
                >
                  <Check size={15} />
                  {todo.completed
                    ? "Mark incomplete"
                    : "Mark complete"}
                </button>

                {!todo.completed && (
                  <button
                    className="todo-details__button todo-details__button--primary"
                    onClick={() => setEditing(true)}
                  >
                    <Edit3 size={15} />
                    Edit task
                  </button>
                )}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default TodoDetails;