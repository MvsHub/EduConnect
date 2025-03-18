"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Rotas públicas
router.get("/:id", userController_1.getUserProfile);
// Rotas protegidas
router.use(auth_1.authenticate);
router.put("/profile", userController_1.updateUserProfile);
// Rota para desenvolvimento/admin
if (process.env.NODE_ENV !== "production") {
    router.get("/", userController_1.getAllUsers);
}
exports.default = router;
