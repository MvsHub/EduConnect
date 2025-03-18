"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.validationSchemas = void 0;
const joi_1 = __importDefault(require("joi"));
// Esquemas de validação para as requisições
exports.validationSchemas = {
    // Autenticação
    register: joi_1.default.object({
        name: joi_1.default.string().required().min(3).max(50),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required().min(6),
        role: joi_1.default.string().valid("teacher", "student").required(),
        education: joi_1.default.string().when("role", {
            is: "teacher",
            then: joi_1.default.required(),
            otherwise: joi_1.default.optional(),
        }),
        bio: joi_1.default.string().max(500).optional(),
    }),
    login: joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required(),
    }),
    // Perfil
    updateProfile: joi_1.default.object({
        name: joi_1.default.string().min(3).max(50).optional(),
        bio: joi_1.default.string().max(500).optional().allow(""),
        education: joi_1.default.string().optional().allow(""),
        profilePicture: joi_1.default.string().uri().optional().allow(""),
    }),
    // Posts
    createPost: joi_1.default.object({
        title: joi_1.default.string().required().min(3).max(100),
        content: joi_1.default.string().required(),
        imageUrl: joi_1.default.string().uri().optional().allow(""),
    }),
    updatePost: joi_1.default.object({
        title: joi_1.default.string().min(3).max(100).optional(),
        content: joi_1.default.string().optional(),
        imageUrl: joi_1.default.string().uri().optional().allow(""),
    }),
    // Comentários
    createComment: joi_1.default.object({
        content: joi_1.default.string().required().max(1000),
    }),
};
// Middleware de validação
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                error: error.details[0].message,
            });
        }
        next();
    };
};
exports.validate = validate;
