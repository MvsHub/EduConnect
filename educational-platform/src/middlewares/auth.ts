import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { AppError } from "../utils/appError"

// Estender a interface Request para incluir o usuário autenticado
export interface AuthRequest extends Request {
  user?: {
    id: string
    role: string
  }
}

// Middleware de autenticação
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Obter token do cabeçalho
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Acesso não autorizado. Token não fornecido", 401)
    }

    const token = authHeader.split(" ")[1]

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string
      role: string
    }

    // Adicionar usuário à requisição
    req.user = {
      id: decoded.id,
      role: decoded.role,
    }

    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Token inválido ou expirado", 401))
    }
    next(error)
  }
}

// Middleware para verificar se o usuário é professor
export const isTeacher = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "teacher") {
    return next(new AppError("Acesso restrito a professores", 403))
  }
  next()
}

