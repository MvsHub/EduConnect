import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"
import User, { type IUser } from "../models/User"
import Token from "../models/Token"
import { AppError } from "../utils/appError"

// Tipos para as requisições
interface RegisterRequest extends Request {
  body: {
    name: string
    email: string
    password: string
    role: "teacher" | "student"
    education?: string
    bio?: string
  }
}

interface LoginRequest extends Request {
  body: {
    email: string
    password: string
  }
}

interface RefreshTokenRequest extends Request {
  body: {
    refreshToken: string
  }
}

// Gerar tokens JWT
const generateTokens = async (user: IUser) => {
  // Token de acesso - curta duração (15 minutos)
  const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, {
    expiresIn: "15m",
  })

  // Token de atualização - longa duração (7 dias)
  const refreshToken = uuidv4()

  // Salvar refresh token no banco
  await Token.create({
    user: user._id,
    token: refreshToken,
    type: "refresh",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
  })

  return { accessToken, refreshToken }
}

// Registrar novo usuário
export const register = async (req: RegisterRequest, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role, education, bio } = req.body

    // Verificar se o email já está em uso
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new AppError("Email já está em uso", 400)
    }

    // Validar campos específicos para professores
    if (role === "teacher" && !education) {
      throw new AppError("Formação é obrigatória para professores", 400)
    }

    // Criar novo usuário
    const user = await User.create({
      name,
      email,
      password,
      role,
      education,
      bio,
    })

    // Gerar tokens
    const { accessToken, refreshToken } = await generateTokens(user)

    // Retornar resposta
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          education: user.education,
          bio: user.bio,
          profilePicture: user.profilePicture,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// Login de usuário
export const login = async (req: LoginRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    // Verificar se o usuário existe
    const user = await User.findOne({ email })
    if (!user) {
      throw new AppError("Credenciais inválidas", 401)
    }

    // Verificar senha
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      throw new AppError("Credenciais inválidas", 401)
    }

    // Gerar tokens
    const { accessToken, refreshToken } = await generateTokens(user)

    // Retornar resposta
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          education: user.education,
          bio: user.bio,
          profilePicture: user.profilePicture,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// Atualizar token de acesso
export const refreshToken = async (req: RefreshTokenRequest, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body

    // Verificar se o token existe
    const tokenDoc = await Token.findOne({ token: refreshToken, type: "refresh" })
    if (!tokenDoc) {
      throw new AppError("Token inválido", 401)
    }

    // Verificar se o token não expirou
    if (tokenDoc.expiresAt < new Date()) {
      await Token.deleteOne({ _id: tokenDoc._id })
      throw new AppError("Token expirado", 401)
    }

    // Buscar usuário
    const user = await User.findById(tokenDoc.user)
    if (!user) {
      throw new AppError("Usuário não encontrado", 404)
    }

    // Gerar novos tokens
    const tokens = await generateTokens(user)

    // Remover token antigo
    await Token.deleteOne({ _id: tokenDoc._id })

    // Retornar resposta
    res.status(200).json({
      success: true,
      data: {
        tokens,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Logout
export const logout = async (req: RefreshTokenRequest, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body

    // Remover token do banco
    await Token.deleteOne({ token: refreshToken })

    res.status(200).json({
      success: true,
      message: "Logout realizado com sucesso",
    })
  } catch (error) {
    next(error)
  }
}

