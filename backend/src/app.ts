import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorMiddleware } from "./middleware/error.middleware";
import { requestLogger } from "./middleware/logger.middleware"
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import userRoutes from "./routes/user.routes";

dotenv.config();

const app = express();

const allowedOrigins = [
  "team-workflow-app-newnop-kr7yitblw-anusaras-projects-fe99f6cc.vercel.app", 
  "http://localhost:5173"                       // Local development
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
}));

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

app.use(errorMiddleware);

export default app;