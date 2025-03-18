"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const uploadController_1 = require("../controllers/uploadController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Configuração do multer para upload de arquivos
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        }
        else {
            cb(new Error("Apenas imagens são permitidas"), false);
        }
    },
});
// Rota protegida para upload de imagens
router.use(auth_1.authenticate);
router.post("/", upload.single("image"), uploadController_1.uploadImage);
exports.default = router;
