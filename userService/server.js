import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import { connectDB as connectMongooseDB } from "./src/config/database.js";

import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

import userGrpcService from "./src/grpc/userGrpcService.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, "src/grpc/user.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false,
  defaults: true,
});

const userProto = grpc.loadPackageDefinition(packageDefinition).userService;

const server = new grpc.Server();

server.addService(userProto.UserService.service, userGrpcService);

const startServer = async () => {
  try {
    await connectMongooseDB();

    const REST_PORT = process.env.PORT || 5001;

    app.listen(REST_PORT, "0.0.0.0", () => {
      console.log(`User REST API running on port ${REST_PORT}`);
    });

    server.bindAsync(
      "0.0.0.0:50051",
      grpc.ServerCredentials.createInsecure(),
      (error, port) => {
        if (error) {
          console.error("gRPC server failed:", error.message);
          return;
        }

        console.log(`UserService running on port ${port}`);
      },
    );
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
