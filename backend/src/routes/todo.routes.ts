import { Router } from "express";
import { TodoController } from "../controllers/todo.controller";
import { TodoService } from "../services/todo.service";
import { TodoRepository } from "../repositories/todo.repository";
import {
  createTodoSchema,
  updateTodoSchema,
} from "../validators/todo.validator";
import { 
  validateBody,
  validateTodoId } from "../middleware/validation.middleware";

const router = Router();

const todoRepository = new TodoRepository();
const todoService = new TodoService(todoRepository);
const todoController = new TodoController(todoService);

router.get("/", todoController.getAllTodos);

router.get(
  "/:id",
  validateTodoId(),
  todoController.getTodoById,
);

router.post(
  "/",
  validateBody(createTodoSchema),
  todoController.createTodo,
);

router.patch(
  "/:id",
  validateTodoId(),
  validateBody(updateTodoSchema),
  todoController.updateTodo,
);

router.delete(
  "/:id",
  validateTodoId(),
  todoController.deleteTodo,
);

export default router;