import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { 
  createNovel, 
  getAllNovels, 
  getNovelById, 
  getNovelsByUser,
  deleteNovel,
  updateNovel,
  searchNovels
} from "../controllers/novel.controller.js"

const router= express.Router()

router.post("/",protectRoute, createNovel)
router.get("/", getAllNovels)
router.get("/search", searchNovels)
router.get("/user", protectRoute, (req, res) => getNovelsByUser(req, res, true))
router.get("/user/:userId", protectRoute, (req, res) => getNovelsByUser(req, res))
router.get("/:id", getNovelById)
router.delete("/:id", protectRoute, deleteNovel)
router.put("/:id", protectRoute, updateNovel)

export default router