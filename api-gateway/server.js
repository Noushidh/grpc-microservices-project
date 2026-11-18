import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import { authMiddleware } from "./src/middleware/authMiddleware.js";
import errorMiddleware from "./src/middleware/errorMiddleware.js";
import { authProxy, userProxy, orderProxy } from "./src/routes/proxyRoutes.js";
dotenv.config();

const app = express();

app.use(cors());

app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use(limiter);

app.use("/api", authMiddleware);

app.use("/api/auth", authProxy);
app.use("/api/users", userProxy);
app.use("/api/orders", orderProxy);

app.use(errorMiddleware);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Gateway is running",
  });
});

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
