"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const User_1 = __importDefault(require("../models/User"));
const Token_1 = __importDefault(require("../models/Token"));
const appError_1 = require("../utils/appError");
// Gerar tokens JWT
const generateTokens = async (user) => {
    // Token de acesso - curta duração (15 minutos)
    const accessToken = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "15m",
    });
    // Token de atualização - longa duração (7 dias)
    const refreshToken = (0, uuid_1.v4)();
    // Salvar refresh token no banco
    await Token_1.default.create({
        user: user._id,
        token: refreshToken,
        type: "refresh",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
    });
    return { accessToken, refreshToken };
};
// Registrar novo usuário
const register = async (req, res, next) => {
    try {
        const { name, email, password, role, education, bio } = req.body;
        // Verificar se o email já está em uso
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            throw new appError_1.AppError("Email já está em uso", 400);
        }
        // Validar campos específicos para professores
        if (role === "teacher" && !education) {
            throw new appError_1.AppError("Formação é obrigatória para professores", 400);
        }
        // Criar novo usuário
        const user = await User_1.default.create({
            name,
            email,
            password,
            role,
            education,
            bio,
        });
        // Gerar tokens
        const { accessToken, refreshToken } = await generateTokens(user);
        // Retornar resposta
        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    education: user.education,
                    bio: user.bio,
                    profilePicture: user.profilePicture,
                },
                tokens: {
                    accessToken,
                    refreshToken,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
// Login de usuário
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Verificar se o usuário existe
        const user = await User_1.default.findOne({ email });
        if (!user) {
            throw new appError_1.AppError("Credenciais inválidas", 401);
        }
        // Verificar senha
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new appError_1.AppError("Credenciais inválidas", 401);
        }
        // Gerar tokens
        const { accessToken, refreshToken } = await generateTokens(user);
        // Retornar resposta
        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    education: user.education,
                    bio: user.bio,
                    profilePicture: user.profilePicture,
                },
                tokens: {
                    accessToken,
                    refreshToken,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
// Atualizar token de acesso
const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        // Verificar se o token existe
        const tokenDoc = await Token_1.default.findOne({ token: refreshToken, type: "refresh" });
        if (!tokenDoc) {
            throw new appError_1.AppError("Token inválido", 401);
        }
        // Verificar se o token não expirou
        if (tokenDoc.expiresAt < new Date()) {
            await Token_1.default.deleteOne({ _id: tokenDoc._id });
            throw new appError_1.AppError("Token expirado", 401);
        }
        // Buscar usuário
        const user = await User_1.default.findById(tokenDoc.user);
        if (!user) {
            throw new appError_1.AppError("Usuário não encontrado", 404);
        }
        // Gerar novos tokens
        const tokens = await generateTokens(user);
        // Remover token antigo
        await Token_1.default.deleteOne({ _id: tokenDoc._id });
        // Retornar resposta
        res.status(200).json({
            success: true,
            data: {
                tokens,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.refreshToken = refreshToken;
// Logout
const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        // Remover token do banco
        await Token_1.default.deleteOne({ token: refreshToken });
        res.status(200).json({
            success: true,
            message: "Logout realizado com sucesso",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
