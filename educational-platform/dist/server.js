"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = require("./middlewares/errorHandler");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const logger_1 = require("./utils/logger");
// Carregar variáveis de ambiente
dotenv_1.default.config();
// Inicializar o app Express
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Logging de requisições
app.use((req, res, next) => {
    logger_1.logger.info(`${req.method} ${req.url}`);
    next();
});
// Conectar ao MongoDB
mongoose_1.default
    .connect(process.env.MONGODB_URI)
    .then(() => {
    logger_1.logger.info("Conectado ao MongoDB");
})
    .catch((error) => {
    logger_1.logger.error("Erro ao conectar ao MongoDB:", error);
    process.exit(1);
});
// Rotas
app.use("/api/auth", authRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/posts", postRoutes_1.default);
app.use("/api/comments", commentRoutes_1.default);
app.use("/api/upload", uploadRoutes_1.default);
// Rota de teste
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "API funcionando corretamente" });
});
// Middleware de tratamento de erros
app.use(errorHandler_1.errorHandler);
// Iniciar o servidor
if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        logger_1.logger.info(`Servidor rodando na porta ${PORT}`);
    });
}
exports.default = app;
