"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheService = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
// Cache com TTL padrão de 5 minutos
const cache = new node_cache_1.default({ stdTTL: 300 });
exports.cacheService = {
    // Obter valor do cache
    get: (key) => {
        return cache.get(key);
    },
    // Definir valor no cache
    set: (key, value, ttl) => {
        return cache.set(key, value, ttl);
    },
    // Remover valor do cache
    del: (key) => {
        return cache.del(key);
    },
    // Limpar cache
    flush: () => {
        cache.flushAll();
    },
};
