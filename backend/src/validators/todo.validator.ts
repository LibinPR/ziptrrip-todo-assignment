import { z } from "zod";

const prioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

const dueDateSchema = z
  .string()
  .datetime()
  .nullable()
  .optional();

export const createTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must not exceed 200 characters"),

  description: z
    .string()
    .trim()
    .max(1000, "Description must not exceed 1000 characters")
    .optional(),

  completed: z.boolean().optional(),

  priority: prioritySchema.optional(),

  dueDate: dueDateSchema,
});

export const updateTodoSchema = createTodoSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message:
        "At least one field must be provided for update",
    },
  );