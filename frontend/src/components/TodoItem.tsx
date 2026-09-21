import {
  ArrowUpRight,
  CalendarClock,
  Check,
  Trash2,
} from "lucide-react";
import type { Todo } from "../types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

function formatDueDate(date: string | null) {
  if (!date) {
    return null;
  }

  const dueDate = new Date(date);

  return dueDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function TodoItem({
  todo,
  onToggle,
  onDelete,
}: TodoItemProps) {
  const openDetails = () => {
    window.location.href = `/todo.html?id=${todo.id}`;
  };

  const dueDate = formatDueDate(todo.dueDate);

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
            <div className="todo-item__meta">
              <CalendarClock size={14} />

              <span>
                {todo.completed ? "Completed" : "Due"} {dueDate}
              </span>
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