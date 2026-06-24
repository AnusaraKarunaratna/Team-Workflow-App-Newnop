import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorMiddleware } from "./middleware/error.middleware";
import { requestLogger } from "./middleware/logger.middleware"
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(errorMiddleware);
app.use(requestLogger);

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

export default app;