import express from "express"
import { getCommentsByPost, createComment, deleteComment } from "../controllers/commentController"
import { authenticate } from "../middlewares/auth"

const router = express.Router()

// Rotas públicas
router.get("/post/:postId", getCommentsByPost)

// Rotas protegidas
router.use(authenticate)
router.post("/post/:postId", createComment)
router.delete("/:id", deleteComment)

export default router

