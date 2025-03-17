import express from "express"
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  getPostsByUser,
} from "../controllers/postController"
import { authenticate, isTeacher } from "../middlewares/auth"

const router = express.Router()

// Rotas públicas
router.get("/", getAllPosts)
router.get("/:id", getPostById)
router.get("/user/:userId", getPostsByUser)

// Rotas protegidas
router.use(authenticate)
router.post("/", isTeacher, createPost)
router.put("/:id", updatePost)
router.delete("/:id", deletePost)
router.post("/:id/like", toggleLike)

export default router

