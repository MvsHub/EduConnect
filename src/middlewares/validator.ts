import { validationSchemas, validate } from "../utils/validation"

// Middlewares de validação para cada tipo de requisição
export const validators = {
  register: validate(validationSchemas.register),
  login: validate(validationSchemas.login),
  updateProfile: validate(validationSchemas.updateProfile),
  createPost: validate(validationSchemas.createPost),
  updatePost: validate(validationSchemas.updatePost),
  createComment: validate(validationSchemas.createComment),
}

