import mongoose, { type Document, Schema } from "mongoose"
import type { IUser } from "./User"

export interface IToken extends Document {
  user: IUser["_id"]
  token: string
  type: "refresh"
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

const TokenSchema = new Schema<IToken>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["refresh"],
      default: "refresh",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Índice para expiração automática
TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.model<IToken>("Token", TokenSchema)

