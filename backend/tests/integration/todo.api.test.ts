import request from "supertest";
import app from "../../src/app";
import prisma from "../../src/lib/prisma";

describe("Todo API", () => {
  let todoId: number;

  beforeEach(async () => {
    await prisma.todo.deleteMany();
  });

  afterAll(async () => {
    await prisma.todo.deleteMany();
    await prisma.$disconnect();
  });

  describe("GET /health", () => {
    it("should return API health status", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: "ok",
        message: "Ziptrrip Todo API is running",
      });
    });
  });

  describe("POST /api/v1/todos", () => {
    it("should create a todo", async () => {
      const response = await request(app)
        .post("/api/v1/todos")
        .send({
          title: "Complete assignment",
          description: "Finish Ziptrrip backend assignment",
          priority: "HIGH",
          dueDate: "2026-09-23T12:00:00.000Z",
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe("Complete assignment");
      expect(response.body.data.priority).toBe("HIGH");

      todoId = response.body.data.id;
    });

    it("should reject invalid todo data", async () => {
      const response = await request(app)
        .post("/api/v1/todos")
        .send({
          title: "",
          priority: "URGENT",
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation failed");
    });
  });

  describe("GET /api/v1/todos", () => {
    it("should return all todos", async () => {
      await prisma.todo.create({
        data: {
          title: "First todo",
        },
      });

      await prisma.todo.create({
        data: {
          title: "Second todo",
        },
      });

      const response = await request(app).get("/api/v1/todos");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });
  });

  describe("GET /api/v1/todos/:id", () => {
    it("should return a todo by id", async () => {
      const todo = await prisma.todo.create({
        data: {
          title: "Find me",
        },
      });

      const response = await request(app).get(
        `/api/v1/todos/${todo.id}`,
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(todo.id);
    });

    it("should reject an invalid todo id", async () => {
      const response = await request(app).get(
        "/api/v1/todos/abc",
      );

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid todo ID");
    });

    it("should return 404 when todo does not exist", async () => {
      const response = await request(app).get(
        "/api/v1/todos/999999",
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Todo not found");
    });
  });

  describe("PATCH /api/v1/todos/:id", () => {
    it("should partially update a todo", async () => {
      const todo = await prisma.todo.create({
        data: {
          title: "Original title",
          completed: false,
        },
      });

      const response = await request(app)
        .patch(`/api/v1/todos/${todo.id}`)
        .send({
          completed: true,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.completed).toBe(true);
      expect(response.body.data.title).toBe("Original title");
    });

    it("should allow clearing the due date", async () => {
      const todo = await prisma.todo.create({
        data: {
          title: "Due date test",
          dueDate: new Date("2026-09-30T12:00:00.000Z"),
        },
      });

      const response = await request(app)
        .patch(`/api/v1/todos/${todo.id}`)
        .send({
          dueDate: null,
        });

      expect(response.status).toBe(200);
      expect(response.body.data.dueDate).toBeNull();
    });

    it("should reject an empty update", async () => {
      const todo = await prisma.todo.create({
        data: {
          title: "Empty update test",
        },
      });

      const response = await request(app)
        .patch(`/api/v1/todos/${todo.id}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
    });
  });

  describe("DELETE /api/v1/todos/:id", () => {
    it("should delete a todo", async () => {
      const todo = await prisma.todo.create({
        data: {
          title: "Delete me",
        },
      });

      const response = await request(app).delete(
        `/api/v1/todos/${todo.id}`,
      );

      expect(response.status).toBe(204);

      const deletedTodo = await prisma.todo.findUnique({
        where: {
          id: todo.id,
        },
      });

      expect(deletedTodo).toBeNull();
    });
  });
});