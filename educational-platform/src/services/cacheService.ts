import NodeCache from "node-cache"

// Cache com TTL padrão de 5 minutos
const cache = new NodeCache({ stdTTL: 300 })

export const cacheService = {
  // Obter valor do cache
  get: <T>(key: string): T | undefined => {
    return cache.get<T>(key);
  },

  // Definir valor no cache
  set: <T>(key: string, value: T, ttl?: number): boolean => {
    return cache.set(key, value, ttl);
  },

  // Remover valor do cache
  del: (key: string): number => {
    return cache.del(key);
  },

  // Limpar cache
  flush: (): void => {
    cache.flushAll();
  },
};

