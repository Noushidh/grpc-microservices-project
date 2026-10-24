import prisma from "./database.js";

const getOrdersByUser = async (call, callback) => {
  try {
    const userId = call.request.user_id;

    console.log("OrderService received userId:", userId);

    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
    });

    console.log("Orders from PostgreSQL:", orders);

    const formattedOrders = orders.map((order) => ({
      order_id: order.id,
      user_id: order.userId,
      product_name: order.product,
      quantity: order.quantity,
      total_amount: order.total,
    }));

    console.log("Formatted orders:", formattedOrders);

    callback(null, {
      orders: formattedOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    callback({
      code: 13,
      message: "Failed to fetch orders",
    });
  }
};

export default {
  GetOrdersByUser: getOrdersByUser,
};
