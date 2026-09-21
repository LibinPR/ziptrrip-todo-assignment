import cors from "cors";
import express from "express";
import todoRoutes from "./routes/todo.routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Ziptrrip Todo API is running",
  });
});

app.use("/api/v1/todos", todoRoutes);

app.use(errorMiddleware);

export default app;