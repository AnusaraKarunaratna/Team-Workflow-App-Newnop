import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorMiddleware } from "./middleware/error.middleware";
import { requestLogger } from "./middleware/logger.middleware";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import userRoutes from "./routes/user.routes";

dotenv.config();

const app = express();

// Define allowed origins with full protocol
const allowedOrigins = [
  "https://team-workflow-app-newnop-3hvjopwyx-anusaras-projects-fe99f6cc.vercel.app",
  "http://localhost:5173"
];

// Single, strict CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // !origin allows server-to-server requests (Postman, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS Blocked Origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
}));

app.use(express.json());
app.use(requestLogger);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// Error handling must be last
app.use(errorMiddleware);

export default app;
