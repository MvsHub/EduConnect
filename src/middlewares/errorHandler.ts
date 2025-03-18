import type { Request, Response, NextFunction } from "express"
import { AppError } from "../utils/appError"
import { logger } from "../utils/logger"

// Middleware de tratamento de erros
export const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
  logger.error(err)

  // Erro personalizado
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    })
  }

  // Erro de validação do Mongoose
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: "Erro de validação",
      details: err.message,
    })
  }

  // Erro de ID inválido do Mongoose
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      error: "ID inválido",
    })
  }

  // Erro de duplicação (unique constraint)
  if (err.name === "MongoError" && (err as any).code === 11000) {
    return res.status(400).json({
      success: false,
      error: "Valor duplicado",
    })
  }

  // Erro interno do servidor
  return res.status(500).json({
    success: false,
    error: "Erro interno do servidor",
  })
}

