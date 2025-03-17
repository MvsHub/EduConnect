import mongoose, { type Document, Schema } from "mongoose"
import type { IUser } from "./User"
import type { IPost } from "./Post"

export interface IComment extends Document {
  content: string
  author: IUser["_id"]
  post: IPost["_id"]
  createdAt: Date
  updatedAt: Date
}

const CommentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: [true, "Conteúdo é obrigatório"],
      trim: true,
      maxlength: [1000, "O comentário não pode ter mais de 1000 caracteres"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Autor é obrigatório"],
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post é obrigatório"],
    },
  },
  {
    timestamps: true,
  },
)

// Índices para melhorar a performance das consultas
CommentSchema.index({ post: 1 })
CommentSchema.index({ author: 1 })
CommentSchema.index({ createdAt: -1 })

export default mongoose.model<IComment>("Comment", CommentSchema)

