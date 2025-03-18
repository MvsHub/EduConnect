"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const appError_1 = require("../utils/appError");
const logger_1 = require("../utils/logger");
// Middleware de tratamento de erros
const errorHandler = (err, req, res, next) => {
    logger_1.logger.error(err);
    // Erro personalizado
    if (err instanceof appError_1.AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message,
        });
    }
    // Erro de validação do Mongoose
    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            error: "Erro de validação",
            details: err.message,
        });
    }
    // Erro de ID inválido do Mongoose
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            error: "ID inválido",
        });
    }
    // Erro de duplicação (unique constraint)
    if (err.name === "MongoError" && err.code === 11000) {
        return res.status(400).json({
            success: false,
            error: "Valor duplicado",
        });
    }
    // Erro interno do servidor
    return res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
    });
};
exports.errorHandler = errorHandler;
