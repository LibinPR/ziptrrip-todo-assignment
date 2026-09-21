import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

import { Todo } from "@prisma/client";
import { TodoService } from "../../src/services/todo.service";
import { TodoRepository } from "../../src/repositories/todo.repository";
// import { AppError } from "../../src/utils/app-error";

describe("TodoService", () => {
  let repository: jest.Mocked<TodoRepository>;
  let service: TodoService;

  const todo: Todo = {
    id: 1,
    title: "Learn Jest",
    description: "Write unit tests",
    completed: false,
    priority: "HIGH",
    dueDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TodoRepository>;

    service = new TodoService(repository);
  });

  describe("getAllTodos", () => {
    it("should return all todos", async () => {
      repository.findAll.mockResolvedValue([todo]);

      const result = await service.getAllTodos();

      expect(result).toEqual([todo]);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("getTodoById", () => {
    it("should return a todo when it exists", async () => {
      repository.findById.mockResolvedValue(todo);

      const result = await service.getTodoById(1);

      expect(result).toEqual(todo);
      expect(repository.findById).toHaveBeenCalledWith(1);
    });

    it("should throw AppError when todo does not exist", async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getTodoById(999)).rejects.toMatchObject({
        statusCode: 404,
        message: "Todo not found",
      });

      expect(repository.findById).toHaveBeenCalledWith(999);
    });
  });

  describe("createTodo", () => {
    it("should create and return a todo", async () => {
      const data = {
        title: "Learn Prisma",
        description: "Practice Prisma 6",
        priority: "MEDIUM" as const,
      };

      repository.create.mockResolvedValue(todo);

      const result = await service.createTodo(data);

      expect(result).toEqual(todo);
      expect(repository.create).toHaveBeenCalledWith(data);
    });
  });

  describe("updateTodo", () => {
    it("should update an existing todo", async () => {
      const updateData = {
        completed: true,
      };

      const updatedTodo = {
        ...todo,
        completed: true,
      };

      repository.findById.mockResolvedValue(todo);
      repository.update.mockResolvedValue(updatedTodo);

      const result = await service.updateTodo(1, updateData);

      expect(result).toEqual(updatedTodo);
      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(repository.update).toHaveBeenCalledWith(1, updateData);
    });

    it("should not update a todo that does not exist", async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.updateTodo(999, { completed: true }),
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "Todo not found",
      });

      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe("deleteTodo", () => {
    it("should delete an existing todo", async () => {
      repository.findById.mockResolvedValue(todo);
      repository.delete.mockResolvedValue(todo);

      const result = await service.deleteTodo(1);

      expect(result).toEqual(todo);
      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it("should not delete a todo that does not exist", async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.deleteTodo(999)).rejects.toMatchObject({
        statusCode: 404,
        message: "Todo not found",
      });

      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});