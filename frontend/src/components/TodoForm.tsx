import { Calendar, Plus } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import type { Priority } from "../types/todo";
import "./TodoForm.css";

interface TodoFormProps {
  onCreate: (data: {
    title: string;
    description?: string;
    priority?: Priority;
    dueDate?: string;
  }) => Promise<void>;
}

function TodoForm({ onCreate }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || submitting) {
      return;
    }

    try {
      setSubmitting(true);

      await onCreate({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate
          ? `${dueDate}T12:00:00.000Z`
          : undefined,
      });

      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setDueDate("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="todo-form__main">
        <input
          className="todo-form__title"
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={200}
        />

        <textarea
          className="todo-form__description"
          placeholder="Add a description..."
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={1000}
          rows={2}
        />
      </div>

      <div className="todo-form__footer">
        <div className="todo-form__options">
          <label className="todo-form__field">
            <span>Priority</span>

            <select
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as Priority)
              }
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </label>

          <label className="todo-form__field">
            <span>
              <Calendar size={13} />
              Due date
            </span>

            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </label>
        </div>

        <button
          className="todo-form__submit"
          type="submit"
          disabled={submitting || !title.trim()}
        >
          <Plus size={17} />

          {submitting ? "Adding..." : "Add task"}
        </button>
      </div>
    </form>
  );
}

export default TodoForm;