import type { Todo, Priority } from "../types/todo";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://localhost:5000/api/v1";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
}

interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: Priority;
  dueDate?: string;
}

export async function getTodos(): Promise<Todo[]> {
  const response = await fetch(`${API_BASE_URL}/todos`);

  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }

  const result: ApiResponse<Todo[]> = await response.json();

  return result.data;
}

export async function getTodoById(id: number): Promise<Todo> {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch todo");
  }

  const result: ApiResponse<Todo> = await response.json();

  return result.data;
}

export async function createTodo(
  data: CreateTodoInput,
): Promise<Todo> {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create todo");
  }

  const result: ApiResponse<Todo> = await response.json();

  return result.data;
}

export async function updateTodo(
  id: number,
  data: UpdateTodoInput,
): Promise<Todo> {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update todo");
  }

  const result: ApiResponse<Todo> = await response.json();

  return result.data;
}

export async function deleteTodo(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete todo");
  }
}