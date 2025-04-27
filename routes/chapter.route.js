import express from "express";
import { 
  createChapter, 
  getChaptersByNovel, 
  getChapterById,
  deleteChapter,
  updateChapter
} from "../controllers/chapter.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:novelId", protectRoute, createChapter);        // Create chapter
router.get("/:novelId", getChaptersByNovel);                   // Get all chapters of a novel
router.get("/chapter/:id", getChapterById);                    // Get single chapter by ID
router.delete("/chapter/:id", protectRoute, deleteChapter);
router.put("/chapter/:id", protectRoute, updateChapter);

export default router;
