import Joi from "joi"

// Esquemas de validação para as requisições
export const validationSchemas = {
  // Autenticação
  register: Joi.object({
    name: Joi.string().required().min(3).max(50),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    role: Joi.string().valid("teacher", "student").required(),
    education: Joi.string().when("role", {
      is: "teacher",
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    bio: Joi.string().max(500).optional(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  // Perfil
  updateProfile: Joi.object({
    name: Joi.string().min(3).max(50).optional(),
    bio: Joi.string().max(500).optional().allow(""),
    education: Joi.string().optional().allow(""),
    profilePicture: Joi.string().uri().optional().allow(""),
  }),

  // Posts
  createPost: Joi.object({
    title: Joi.string().required().min(3).max(100),
    content: Joi.string().required(),
    imageUrl: Joi.string().uri().optional().allow(""),
  }),

  updatePost: Joi.object({
    title: Joi.string().min(3).max(100).optional(),
    content: Joi.string().optional(),
    imageUrl: Joi.string().uri().optional().allow(""),
  }),

  // Comentários
  createComment: Joi.object({
    content: Joi.string().required().max(1000),
  }),
}

// Middleware de validação
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.body)
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      })
    }
    next()
  }
}

