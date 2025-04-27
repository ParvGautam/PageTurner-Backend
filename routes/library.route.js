import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
  addToLibrary, 
  removeFromLibrary, 
  checkInLibrary, 
  getUserLibrary 
} from "../controllers/library.controller.js";

const router = express.Router();

// Add book to library
router.post("/add", protectRoute, addToLibrary);

// Remove book from library
router.post("/remove", protectRoute, removeFromLibrary);

// Check if book is in library
router.get("/check/:novelId", protectRoute, checkInLibrary);

// Get all books in user's library
router.get("/user", protectRoute, getUserLibrary);

export default router; 