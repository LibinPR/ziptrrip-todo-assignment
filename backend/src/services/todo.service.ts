import { Prisma, Todo } from "@prisma/client";
import { TodoRepository } from "../repositories/todo.repository";
import { AppError } from "../utils/app-error";

export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async getAllTodos(): Promise<Todo[]> {
    return this.todoRepository.findAll();
  }

  async getTodoById(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findById(id);

    if (!todo) {
      throw new AppError(404, "Todo not found");
    }

    return todo;
  }

  async createTodo(data: Prisma.TodoCreateInput): Promise<Todo> {
    return this.todoRepository.create(data);
  }

  async updateTodo(
    id: number,
    data: Prisma.TodoUpdateInput,
  ): Promise<Todo> {
    await this.getTodoById(id);

    return this.todoRepository.update(id, data);
  }

  async deleteTodo(id: number): Promise<Todo> {
    await this.getTodoById(id);

    return this.todoRepository.delete(id);
  }
}