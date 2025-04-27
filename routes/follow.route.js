import express from "express";
import { followUser, unfollowUser, getFollowingNovels, getUserProfile } from "../controllers/follow.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/follow/:id", protectRoute, followUser);
router.post("/unfollow/:id", protectRoute, unfollowUser);
router.get("/following/novels", protectRoute, getFollowingNovels);
router.get("/profile/:userId", getUserProfile);

export default router;
