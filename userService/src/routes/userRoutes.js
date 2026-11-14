import express from "express";
import { getMe, getUserById } from "../controllers/userController.js";
import {
  authMiddleware,
  authorizeAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getMe);
router.get("/:id", authMiddleware, authorizeAdmin, getUserById);

export default router;
