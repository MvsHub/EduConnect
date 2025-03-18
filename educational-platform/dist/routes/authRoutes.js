"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
// Rotas de autenticação
router.post("/register", authController_1.register);
router.post("/login", authController_1.login);
router.post("/refresh-token", authController_1.refreshToken);
router.post("/logout", authController_1.logout);
exports.default = router;
