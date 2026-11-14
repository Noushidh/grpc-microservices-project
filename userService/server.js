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

app.get("/api/users", async (req, res) => {
  try {
    const db = await connectDB();
    const users = await db
      .collection("users")
      .find({}, { projection: { userId: 1, name: 1, email: 1 } })
      .toArray();
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
});

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

    app.listen(5001, "0.0.0.0", () => {
      console.log("REST API running on port 5001");
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
