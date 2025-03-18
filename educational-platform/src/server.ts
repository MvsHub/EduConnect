// src/server.ts
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import { logger } from "./utils/logger";

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar o app Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Logging de requisições
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Conectar ao MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error("MONGODB_URI não está definido nas variáveis de ambiente");
    }
    
    await mongoose.connect(mongoURI);
    logger.info("Conectado ao MongoDB");
  } catch (error) {
    logger.error("Erro ao conectar ao MongoDB:", error);
    process.exit(1);
  }
};

// Chamar a função de conexão
connectDB();

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/upload", uploadRoutes);

// Rota de teste
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "API funcionando corretamente" });
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Iniciar o servidor
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    logger.info(`Servidor rodando na porta ${PORT}`);
  });
}

export default app;