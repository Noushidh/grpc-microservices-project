import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getUser } from "./service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load user.proto
const PROTO_PATH = path.join(__dirname, "user.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false,
  defaults: true,
});

const userProto = grpc.loadPackageDefinition(packageDefinition).userService;

const orderProtoPath = path.join(__dirname, "order.proto");

const orderPackageDefinition = protoLoader.loadSync(orderProtoPath, {
  keepCase: false,
  defaults: true,
});

const orderProto = grpc.loadPackageDefinition(
  orderPackageDefinition,
).orderService;

const orderClient = new orderProto.OrderService(
  "order-service:50052",
  grpc.credentials.createInsecure(),
);

// Create gRPC server
const server = new grpc.Server();

// Register GetUser RPC
server.addService(userProto.UserService.service, {
  getUser: (call, callback) => getUser(call, callback, orderClient),
});

// Start server
server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error("Server failed:", error.message);
      return;
    }

    console.log(`UserService running on port ${port}`);
  },
);
