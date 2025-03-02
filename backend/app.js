import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import Routes
import commentRoutes from "./src/routes/comment.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import postRoutes from "./src/routes/post.routes.js";
import errorHandler from "./src/middlewares/error.middleware.js";

const app = express();

// Secure CORS Configuration
const allowedOrigins = [process.env.FRONTEND_URI || "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin"));
      }
    },
    credentials: true, // Allow cookies if needed
  })
);

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests

// Routes
app.use("/api/users", userRoutes); // User Authentication & Profile
app.use("/api/posts", postRoutes); // Post CRUD + Like + Search
app.use("/api/comments", commentRoutes); // Comment CRUD

// Test Route
app.get("/test", (req, res) => {
  res.send("API is running...");
});

// Global Error Handling
app.use(errorHandler);

// Instead of process.exit(1), consider logging the error without exiting
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // process.exit(1); - remove this in serverless environment
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  // process.exit(1); - remove this in serverless environment
});

export default app;

