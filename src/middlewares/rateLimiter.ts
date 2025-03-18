import rateLimit from "express-rate-limit"

// Limitar requisições para evitar ataques de força bruta
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 tentativas
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Muitas tentativas de login. Tente novamente mais tarde.",
  },
})

// Limitar requisições gerais para evitar sobrecarga
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100, // 100 requisições por minuto
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Muitas requisições. Tente novamente mais tarde.",
  },
})

