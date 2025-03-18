import express from "express"
import multer from "multer"
import { uploadImage } from "../controllers/uploadController"
import { authenticate } from "../middlewares/auth"

const router = express.Router()

// Configuração do multer para upload de arquivos
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Apenas imagens são permitidas") as any, false)
    }
  },
})

// Rota protegida para upload de imagens
router.use(authenticate)
router.post("/", upload.single("image"), uploadImage)

export default router

