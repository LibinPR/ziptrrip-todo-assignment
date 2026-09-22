import {
  ArrowUpRight,
  CalendarClock,
  Check,
  Trash2,
} from "lucide-react";
import type { Todo } from "../types/todo";

import "./TodoItem.css";

interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

function formatDueDate(date: string | null, completed: boolean) {
  if (!date) {
    return null;
  }

  const dueDate = new Date(date);

  // The backend stores the selected date at noon UTC.
  // Using UTC components prevents the displayed date from
  // shifting because of the user's local timezone.
  const year = dueDate.getUTCFullYear();
  const month = dueDate.getUTCMonth();
  const day = dueDate.getUTCDate();

  const dueDay = new Date(year, month, day);

  if (completed) {
    return {
      label: `Completed ${dueDay.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`,
      status: "completed",
    };
  }

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
    return {
      label: `Overdue · ${dueDay.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`,
      status: "overdue",
    };
  }

  if (differenceInDays === 0) {
    return {
      label: "Due today",
      status: "today",
    };
  }

  if (differenceInDays === 1) {
    return {
      label: "Due tomorrow",
      status: "tomorrow",
    };
  }

  return {
    label: `Due ${dueDay.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`,
    status: "upcoming",
  };
}

function TodoItem({
  todo,
  onToggle,
  onDelete,
}: TodoItemProps) {
  const openDetails = () => {
    window.location.href = `/todo.html?id=${todo.id}`;
  };

  const dueDate = formatDueDate(todo.dueDate, todo.completed);

  return (
    <article
      className={`todo-item ${
        todo.completed ? "todo-item--completed" : ""
      }`}
    >
      <div className="todo-item__top">
        <button
          type="button"
          className={`todo-check ${
            todo.completed ? "todo-check--completed" : ""
          }`}
          onClick={() => onToggle(todo)}
          aria-label={
            todo.completed
              ? "Mark todo as incomplete"
              : "Mark todo as complete"
          }
        >
          <Check size={15} />
        </button>

        <div className="todo-item__body">
          <div className="todo-item__title-row">
            <h3>{todo.title}</h3>

            <span
              className={`priority priority--${todo.priority.toLowerCase()}`}
            >
              {todo.priority}
            </span>
          </div>

          {todo.description && (
            <p className="todo-item__description">
              {todo.description}
            </p>
          )}

          {dueDate && (
            <div
              className={`todo-item__meta todo-item__meta--${dueDate.status}`}
            >
              <CalendarClock size={14} />

              <span>{dueDate.label}</span>
            </div>
          )}
        </div>
      </div>

      <div className="todo-item__footer">
        <button
          type="button"
          className="todo-action"
          onClick={openDetails}
        >
          View details
          <ArrowUpRight size={15} />
        </button>

        <button
          type="button"
          className="todo-action todo-action--danger"
          onClick={() => onDelete(todo.id)}
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </article>
  );
}

export default TodoItem;