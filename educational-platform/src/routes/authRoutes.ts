import express from "express"
import { register, login, refreshToken, logout } from "../controllers/authController"

const router = express.Router()

// Rotas de autenticação
router.post("/register", register)
router.post("/login", login)
router.post("/refresh-token", refreshToken)
router.post("/logout", logout)

export default router

