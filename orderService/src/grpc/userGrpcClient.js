import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, "user.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false,
  defaults: true,
});

const userProto = grpc.loadPackageDefinition(packageDefinition).userService;

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "user-service:50051";

const userClient = new userProto.UserService(
  USER_SERVICE_URL,
  grpc.credentials.createInsecure(),
);

export default userClient;
