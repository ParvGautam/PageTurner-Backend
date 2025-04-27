import express from "express";
import { createComment, getComments, getAverageRating } from "../controllers/comment.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:novelId", protectRoute, createComment);         // Post a comment
router.get("/:novelId", getComments);                          // Get all comments of a novel
router.get("/:novelId/average", getAverageRating);             // Get average rating

export default router;
