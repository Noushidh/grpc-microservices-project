import { connectDB } from "./database.js";
import grpc from "@grpc/grpc-js";

export async function getUser(call, callback, orderClient) {
  try {
    console.log("Full request:", call.request);
    console.log("Full request:", call.request.userId);

    const userId = Number(call.request.userId);

    console.log("Parsed userId:", userId);

    const db = await connectDB();

    const user = await db.collection("users").findOne({ userId });

    if (!user) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: "User not found",
      });
    }

    // Call OrderService to fetch this user's orders
    orderClient.GetOrdersByUser({ userId: userId }, (error, orderResponse) => {
      if (error) {
        return callback(error);
      }

    console.log("OrderService response:", orderResponse);

      return callback(null, {
        user: {
          userId: user.userId,
          name: user.name,
          email: user.email,
        },
        orders: orderResponse.orders,
      });
    });
  } catch (error) {
    return callback(error);
  }
}
