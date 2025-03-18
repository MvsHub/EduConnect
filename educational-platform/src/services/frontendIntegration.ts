import type { Request, Response, NextFunction } from "express"
import User from "../models/User"
import Post from "../models/Post"
import Comment from "../models/Comment"
import { integrationService } from "./integrationService"
import { logger } from "../utils/logger"

// Serviço para integração com o frontend existente
export const frontendIntegration = {
  // Adaptar dados do usuário para o formato do frontend
  adaptUserData: async (userId: string) => {
    try {
      const user = await User.findById(userId).select("-password")
      if (!user) return null

      return integrationService.transformUser(user)
    } catch (error) {
      logger.error("Erro ao adaptar dados do usuário:", error)
      return null
    }
  },

  // Adaptar dados do post para o formato do frontend
  adaptPostData: async (postId: string) => {
    try {
      const post = await Post.findById(postId).populate("author", "name email role profilePicture")
      if (!post) return null

      const comments = await Comment.find({ post: postId })
        .sort({ createdAt: -1 })
        .populate("author", "name email role profilePicture")

      return integrationService.transformPost(post, comments)
    } catch (error) {
      logger.error("Erro ao adaptar dados do post:", error)
      return null
    }
  },

  // Middleware para adaptar resposta ao formato do frontend
  adaptResponse: (dataType: "user" | "post" | "comment") => {
    return (req: Request, res: Response, next: NextFunction) => {
      const originalSend = res.json

      res.json = function (body: any): Response {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          let adaptedBody

          switch (dataType) {
            case "user":
              adaptedBody = {
                ...body,
                data: {
                  ...body.data,
                  user: body.data.user ? integrationService.transformUser(body.data.user) : null,
                },
              }
              break
            case "post":
              adaptedBody = {
                ...body,
                data: {
                  ...body.data,
                  post: body.data.post ? integrationService.transformPost(body.data.post) : null,
                },
              }
              break
            case "comment":
              adaptedBody = {
                ...body,
                data: {
                  ...body.data,
                  comment: body.data.comment ? integrationService.transformComment(body.data.comment) : null,
                },
              }
              break
            default:
              adaptedBody = body
          }

          return originalSend.call(this, adaptedBody)
        }

        return originalSend.call(this, body)
      }

      next()
    }
  },
}

