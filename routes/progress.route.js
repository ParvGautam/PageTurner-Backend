import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
  updateProgress, 
  getNovelProgress,
  getAllProgress
} from "../controllers/progress.controller.js";

const router = express.Router();

// Update reading progress
router.post("/update", protectRoute, updateProgress);

// Get progress for a specific novel
router.get("/novel/:novelId", protectRoute, getNovelProgress);

// Get all reading progress for the user
router.get("/all", protectRoute, getAllProgress);

export default router;
