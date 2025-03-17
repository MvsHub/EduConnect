import type { Request, Response, NextFunction } from "express"
import Post from "../models/Post"
import Comment from "../models/Comment"
import { AppError } from "../utils/appError"
import type { AuthRequest } from "../middlewares/auth"

// Obter todos os posts
export const getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number.parseInt(req.query.page as string) || 1
    const limit = Number.parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name email role profilePicture")

    const total = await Post.countDocuments()

    res.status(200).json({
      success: true,
      count: posts.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: {
        posts,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Obter um post específico
export const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.id

    const post = await Post.findById(postId).populate("author", "name email role profilePicture")
    if (!post) {
      throw new AppError("Post não encontrado", 404)
    }

    // Buscar comentários do post
    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate("author", "name email role profilePicture")

    res.status(200).json({
      success: true,
      data: {
        post,
        comments,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Criar um novo post
export const createPost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, content, imageUrl } = req.body
    const userId = req.user?.id

    // Verificar se o usuário é um professor
    if (req.user?.role !== "teacher") {
      throw new AppError("Apenas professores podem criar posts", 403)
    }

    const post = await Post.create({
      title,
      content,
      imageUrl,
      author: userId,
    })

    await post.populate("author", "name email role profilePicture")

    res.status(201).json({
      success: true,
      data: {
        post,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Atualizar um post
export const updatePost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.id
    const { title, content, imageUrl } = req.body
    const userId = req.user?.id

    // Verificar se o post existe
    const post = await Post.findById(postId)
    if (!post) {
      throw new AppError("Post não encontrado", 404)
    }

    // Verificar se o usuário é o autor do post
    if (post.author.toString() !== userId) {
      throw new AppError("Você não tem permissão para editar este post", 403)
    }

    // Atualizar campos
    if (title) post.title = title
    if (content) post.content = content
    if (imageUrl !== undefined) post.imageUrl = imageUrl

    await post.save()
    await post.populate("author", "name email role profilePicture")

    res.status(200).json({
      success: true,
      data: {
        post,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Excluir um post
export const deletePost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.id
    const userId = req.user?.id

    // Verificar se o post existe
    const post = await Post.findById(postId)
    if (!post) {
      throw new AppError("Post não encontrado", 404)
    }

    // Verificar se o usuário é o autor do post
    if (post.author.toString() !== userId) {
      throw new AppError("Você não tem permissão para excluir este post", 403)
    }

    // Excluir comentários relacionados ao post
    await Comment.deleteMany({ post: postId })

    // Excluir o post
    await Post.deleteOne({ _id: postId })

    res.status(200).json({
      success: true,
      message: "Post excluído com sucesso",
    })
  } catch (error) {
    next(error)
  }
}

// Curtir/descurtir um post
export const toggleLike = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.id
    const userId = req.user?.id

    // Verificar se o post existe
    const post = await Post.findById(postId)
    if (!post) {
      throw new AppError("Post não encontrado", 404)
    }

    // Verificar se o usuário já curtiu o post
    const isLiked = post.likes.includes(userId as any)

    if (isLiked) {
      // Remover curtida
      post.likes = post.likes.filter((id) => id.toString() !== userId)
    } else {
      // Adicionar curtida
      post.likes.push(userId as any)
    }

    await post.save()
    await post.populate("author", "name email role profilePicture")

    res.status(200).json({
      success: true,
      data: {
        post,
        liked: !isLiked,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Obter posts de um usuário específico
export const getPostsByUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId
    const page = Number.parseInt(req.query.page as string) || 1
    const limit = Number.parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name email role profilePicture")

    const total = await Post.countDocuments({ author: userId })

    res.status(200).json({
      success: true,
      count: posts.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: {
        posts,
      },
    })
  } catch (error) {
    next(error)
  }
}

