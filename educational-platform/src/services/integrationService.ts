import type { IUser } from "../models/User"
import type { IPost } from "../models/Post"
import type { IComment } from "../models/Comment"
import { logger } from "../utils/logger"

// Serviço para integração com o frontend
export const integrationService = {
  // Transformar modelo de usuário para o formato do frontend
  transformUser: (user: IUser) => {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      education: user.education,
      bio: user.bio,
      profilePicture: user.profilePicture,
    }
  },

  // Transformar modelo de post para o formato do frontend
  transformPost: (post: IPost, comments: IComment[] = []) => {
    return {
      id: post._id,
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      author: post.author,
      createdAt: post.createdAt,
      likes: post.likes,
      comments: comments.map((comment) => ({
        id: comment._id,
        content: comment.content,
        author: comment.author,
        createdAt: comment.createdAt,
      })),
    }
  },

  // Transformar modelo de comentário para o formato do frontend
  transformComment: (comment: IComment) => {
    return {
      id: comment._id,
      content: comment.content,
      author: comment.author,
      createdAt: comment.createdAt,
    }
  },

  // Registrar evento de integração (para análise e depuração)
  logIntegrationEvent: (event: string, data: any) => {
    logger.info(`Integration Event: ${event}`, { data })
  },
}

