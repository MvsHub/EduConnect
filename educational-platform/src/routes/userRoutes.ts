import express from "express"
import { getUserProfile, updateUserProfile, getAllUsers } from "../controllers/userController"
import { authenticate } from "../middlewares/auth"

const router = express.Router()

// Rotas públicas
router.get("/:id", getUserProfile)

// Rotas protegidas
router.use(authenticate)
router.put("/profile", updateUserProfile)

// Rota para desenvolvimento/admin
if (process.env.NODE_ENV !== "production") {
  router.get("/", getAllUsers)
}

export default router

