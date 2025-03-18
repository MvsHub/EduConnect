import type { Request, Response, NextFunction } from "express"
import { cacheService } from "../services/cacheService"

// Middleware para cache de resposta
export const cacheMiddleware = (ttl = 300) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Não aplicar cache para métodos que modificam dados
    if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
      return next()
    }

    // Criar chave de cache baseada na URL e query params
    const key = `${req.originalUrl || req.url}`
    const cachedResponse = cacheService.get<any>(key)

    if (cachedResponse) {
      return res.status(200).json(cachedResponse)
    }

    // Armazenar a resposta original
    const originalSend = res.json

    // Sobrescrever o método json para interceptar a resposta
    res.json = function (body: any): Response {
      // Armazenar no cache apenas respostas bem-sucedidas
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheService.set(key, body, ttl)
      }
      return originalSend.call(this, body)
    }

    next()
  }
}

// Middleware para limpar cache
export const clearCache = (pattern: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Implementação simplificada - em um sistema real, usaríamos Redis com pattern matching
    cacheService.flush()
    next()
  }
}

