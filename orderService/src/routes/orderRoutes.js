import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
} from "../controllers/orderController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getOrders);
router.get("/:id", authMiddleware, getOrderById);
router.patch("/:id", authMiddleware, updateOrder);

export default router;
