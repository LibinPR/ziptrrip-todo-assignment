import { NextFunction, Request, Response } from "express";
import { TodoService } from "../services/todo.service";

export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  getAllTodos = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const todos = await this.todoService.getAllTodos();

      res.status(200).json({
        success: true,
        data: todos,
      });
    } catch (error) {
      next(error);
    }
  };

  getTodoById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = Number(req.params.id);

      const todo = await this.todoService.getTodoById(id);

      res.status(200).json({
        success: true,
        data: todo,
      });
    } catch (error) {
      next(error);
    }
  };

  createTodo = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const todo = await this.todoService.createTodo(req.body);

      res.status(201).json({
        success: true,
        data: todo,
      });
    } catch (error) {
      next(error);
    }
  };

  updateTodo = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = Number(req.params.id);

      const todo = await this.todoService.updateTodo(
        id,
        req.body,
      );

      res.status(200).json({
        success: true,
        data: todo,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteTodo = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = Number(req.params.id);

      await this.todoService.deleteTodo(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}