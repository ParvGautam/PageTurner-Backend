import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
  addBookmark, 
  removeBookmark, 
  checkBookmark, 
  getUserBookmarks 
} from "../controllers/bookmark.controller.js";

const router = express.Router();

// Add bookmark
router.post("/add", protectRoute, addBookmark);

// Remove bookmark
router.post("/remove", protectRoute, removeBookmark);

// Check if chapter is bookmarked
router.get("/check/:novelId/:chapterId", protectRoute, checkBookmark);

// Get all user bookmarks
router.get("/user", protectRoute, getUserBookmarks);

export default router; 