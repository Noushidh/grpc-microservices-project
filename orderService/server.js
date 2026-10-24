import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import orderService from "./service.js";

const PROTO_PATH = "./order.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const orderProto = grpc.loadPackageDefinition(packageDefinition).orderService;

const server = new grpc.Server();

server.addService(orderProto.OrderService.service, orderService);

const PORT = "0.0.0.0:50052";

server.bindAsync(
  PORT,
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error("Failed to start OrderService:", error);
      return;
    }

    console.log(`OrderService gRPC server running on port ${port}`);
  },
);
