import type { Request, Response, NextFunction } from "express"
import Comment from "../models/Comment"
import Post from "../models/Post"
import { AppError } from "../utils/appError"
import type { AuthRequest } from "../middlewares/auth"

// Obter comentários de um post
export const getCommentsByPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.postId
    const page = Number.parseInt(req.query.page as string) || 1
    const limit = Number.parseInt(req.query.limit as string) || 20
    const skip = (page - 1) * limit

    // Verificar se o post existe
    const postExists = await Post.exists({ _id: postId })
    if (!postExists) {
      throw new AppError("Post não encontrado", 404)
    }

    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name email role profilePicture")

    const total = await Comment.countDocuments({ post: postId })

    res.status(200).json({
      success: true,
      count: comments.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: {
        comments,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Criar um comentário
export const createComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body
    const postId = req.params.postId
    const userId = req.user?.id

    // Verificar se o post existe
    const postExists = await Post.exists({ _id: postId })
    if (!postExists) {
      throw new AppError("Post não encontrado", 404)
    }

    const comment = await Comment.create({
      content,
      author: userId,
      post: postId,
    })

    await comment.populate("author", "name email role profilePicture")

    res.status(201).json({
      success: true,
      data: {
        comment,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Excluir um comentário
export const deleteComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const commentId = req.params.id
    const userId = req.user?.id

    // Verificar se o comentário existe
    const comment = await Comment.findById(commentId)
    if (!comment) {
      throw new AppError("Comentário não encontrado", 404)
    }

    // Verificar se o usuário é o autor do comentário
    if (comment.author.toString() !== userId) {
      throw new AppError("Você não tem permissão para excluir este comentário", 403)
    }

    await Comment.deleteOne({ _id: commentId })

    res.status(200).json({
      success: true,
      message: "Comentário excluído com sucesso",
    })
  } catch (error) {
    next(error)
  }
}

