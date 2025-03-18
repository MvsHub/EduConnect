"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = require("../controllers/postController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Rotas públicas
router.get("/", postController_1.getAllPosts);
router.get("/:id", postController_1.getPostById);
router.get("/user/:userId", postController_1.getPostsByUser);
// Rotas protegidas
router.use(auth_1.authenticate);
router.post("/", auth_1.isTeacher, postController_1.createPost);
router.put("/:id", postController_1.updatePost);
router.delete("/:id", postController_1.deletePost);
router.post("/:id/like", postController_1.toggleLike);
exports.default = router;
