import express from "express";
import {
  getMe,
  getUserById,
  updateProfile,
} from "../controllers/userController.js";
import {
  authMiddleware,
  authorizeAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getMe);
router.get("/:id", authMiddleware, authorizeAdmin, getUserById);
router.patch("/me", authMiddleware, updateProfile);

export default router;
