"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiLimiter = exports.authLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Limitar requisições para evitar ataques de força bruta
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // 10 tentativas
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: "Muitas tentativas de login. Tente novamente mais tarde.",
    },
});
// Limitar requisições gerais para evitar sobrecarga
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minuto
    max: 100, // 100 requisições por minuto
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: "Muitas requisições. Tente novamente mais tarde.",
    },
});
