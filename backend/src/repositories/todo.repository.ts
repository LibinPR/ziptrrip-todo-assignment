import prisma from "../lib/prisma";
import { Prisma, Todo } from "@prisma/client";

export class TodoRepository {
  async findAll(): Promise<Todo[]> {
    return prisma.todo.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: number): Promise<Todo | null> {
    return prisma.todo.findUnique({
      where: {
        id,
      },
    });
  }

  async create(data: Prisma.TodoCreateInput): Promise<Todo> {
    return prisma.todo.create({
      data,
    });
  }

  async update(
    id: number,
    data: Prisma.TodoUpdateInput,
  ): Promise<Todo> {
    return prisma.todo.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: number): Promise<Todo> {
    return prisma.todo.delete({
      where: {
        id,
      },
    });
  }
}