// src/routes/postRoutes.ts
import express from "express";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  getPostsByUser,
} from "../controllers/postController";
import { authenticate, isTeacher } from "../middlewares/auth";

const router = express.Router();

// Rotas públicas
router.get("/", getAllPosts);
router.get("/user/:userId", getPostsByUser); // Mova esta rota para antes de /:id para evitar conflitos
router.get("/:id", getPostById);

// Rotas protegidas
router.use(authenticate);
router.post("/", isTeacher, createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.post("/:id/like", toggleLike);

export default router;