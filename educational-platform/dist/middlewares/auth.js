"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTeacher = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_1 = require("../utils/appError");
// Middleware de autenticação
const authenticate = (req, res, next) => {
    try {
        // Obter token do cabeçalho
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new appError_1.AppError("Acesso não autorizado. Token não fornecido", 401);
        }
        const token = authHeader.split(" ")[1];
        // Verificar token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Adicionar usuário à requisição
        req.user = {
            id: decoded.id,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return next(new appError_1.AppError("Token inválido ou expirado", 401));
        }
        next(error);
    }
};
exports.authenticate = authenticate;
// Middleware para verificar se o usuário é professor
const isTeacher = (req, res, next) => {
    if (req.user?.role !== "teacher") {
        return next(new appError_1.AppError("Acesso restrito a professores", 403));
    }
    next();
};
exports.isTeacher = isTeacher;
