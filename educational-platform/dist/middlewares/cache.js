"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCache = exports.cacheMiddleware = void 0;
const cacheService_1 = require("../services/cacheService");
// Middleware para cache de resposta
const cacheMiddleware = (ttl = 300) => {
    return (req, res, next) => {
        // Não aplicar cache para métodos que modificam dados
        if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
            return next();
        }
        // Criar chave de cache baseada na URL e query params
        const key = `${req.originalUrl || req.url}`;
        const cachedResponse = cacheService_1.cacheService.get(key);
        if (cachedResponse) {
            return res.status(200).json(cachedResponse);
        }
        // Armazenar a resposta original
        const originalSend = res.json;
        // Sobrescrever o método json para interceptar a resposta
        res.json = function (body) {
            // Armazenar no cache apenas respostas bem-sucedidas
            if (res.statusCode >= 200 && res.statusCode < 300) {
                cacheService_1.cacheService.set(key, body, ttl);
            }
            return originalSend.call(this, body);
        };
        next();
    };
};
exports.cacheMiddleware = cacheMiddleware;
// Middleware para limpar cache
const clearCache = (pattern) => {
    return (req, res, next) => {
        // Implementação simplificada - em um sistema real, usaríamos Redis com pattern matching
        cacheService_1.cacheService.flush();
        next();
    };
};
exports.clearCache = clearCache;
