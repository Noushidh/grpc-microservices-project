import prisma from "../config/database.js";
import userClient from "../grpc/userGrpcClient.js";

export const createOrder = async (req, res) => {
  try {
    const { item, quantity, price } = req.body;

    if (!item || !quantity || !price) {
      return res.status(400).json({
        success: false,
        message: "Item, quantity and price are required",
      });
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user.userId,
        item,
        quantity,
        price,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id is:", id);

    const order = await prisma.order.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this order",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["pending", "processing", "shipped", "delivered"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.userId !== req.user.userId) {
      userClient.getUser({ userId: req.user.userId }, async (error, user) => {
        if (error) {
          console.error("gRPC error:", error.message);

          return res.status(403).json({
            success: false,
            message: "Unable to verify user authorization",
          });
        }

        if (user.role !== "admin") {
          return res.status(403).json({
            success: false,
            message: "You are not authorized to update this order",
          });
        }

        await updateOrderStatus(order.id, status, res);
      });

      return;
    }

    await updateOrderStatus(order.id, status, res);
  } catch (error) {
    console.error("Update order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update order",
    });
  }
};

const updateOrderStatus = async (orderId, status, res) => {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Order update error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update order",
    });
  }
};
