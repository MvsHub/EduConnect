"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controllers/commentController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Rotas públicas
router.get("/post/:postId", commentController_1.getCommentsByPost);
// Rotas protegidas
router.use(auth_1.authenticate);
router.post("/post/:postId", commentController_1.createComment);
router.delete("/:id", commentController_1.deleteComment);
exports.default = router;
