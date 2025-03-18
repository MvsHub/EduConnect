import mongoose, { type Document, Schema } from "mongoose"
import bcrypt from "bcryptjs"

export type UserRole = "teacher" | "student"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: UserRole
  education?: string
  bio?: string
  profilePicture?: string
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Nome é obrigatório"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email é obrigatório"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Por favor, forneça um email válido"],
    },
    password: {
      type: String,
      required: [true, "Senha é obrigatória"],
      minlength: [6, "A senha deve ter pelo menos 6 caracteres"],
    },
    role: {
      type: String,
      enum: ["teacher", "student"],
      default: "student",
    },
    education: {
      type: String,
      required: function (this: IUser) {
        return this.role === "teacher"
      },
    },
    bio: {
      type: String,
      maxlength: [500, "A bio não pode ter mais de 500 caracteres"],
    },
    profilePicture: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

// Hash da senha antes de salvar
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Método para comparar senhas
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model<IUser>("User", UserSchema)

