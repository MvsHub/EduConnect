// src/models/Post.ts
import mongoose, { type Document, Schema } from "mongoose";
import type { IUser } from "./User";

export interface IPost extends Document {
  title: string;
  content: string;
  imageUrl?: string;
  author: mongoose.Types.ObjectId | IUser;
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, "Título é obrigatório"],
      trim: true,
      maxlength: [100, "O título não pode ter mais de 100 caracteres"],
    },
    content: {
      type: String,
      required: [true, "Conteúdo é obrigatório"],
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Autor é obrigatório"],
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Índice para melhorar a performance das consultas
PostSchema.index({ author: 1 });
PostSchema.index({ createdAt: -1 });

export default mongoose.model<IPost>("Post", PostSchema);