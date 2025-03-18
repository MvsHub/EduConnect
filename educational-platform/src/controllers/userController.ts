import type { Request, Response, NextFunction } from "express"
import User from "../models/User"
import { AppError } from "../utils/appError"
import type { AuthRequest } from "../middlewares/auth"

// Obter perfil do usuário
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id

    const user = await User.findById(userId).select("-password")
    if (!user) {
      throw new AppError("Usuário não encontrado", 404)
    }

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Atualizar perfil do usuário
export const updateUserProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id
    const { name, bio, education, profilePicture } = req.body

    // Verificar se o usuário existe
    const user = await User.findById(userId)
    if (!user) {
      throw new AppError("Usuário não encontrado", 404)
    }

    // Atualizar campos
    if (name) user.name = name
    if (bio !== undefined) user.bio = bio
    if (education !== undefined && user.role === "teacher") user.education = education
    if (profilePicture) user.profilePicture = profilePicture

    await user.save()

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
      },
    })
  } catch (error) {
    next(error)
  }
}

// Obter todos os usuários (apenas para admin em um sistema real)
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().select("-password")

    res.status(200).json({
      success: true,
      count: users.length,
      data: {
        users,
      },
    })
  } catch (error) {
    next(error)
  }
}

