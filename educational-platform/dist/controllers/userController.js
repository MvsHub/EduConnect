"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.updateUserProfile = exports.getUserProfile = void 0;
const User_1 = __importDefault(require("../models/User"));
const appError_1 = require("../utils/appError");
// Obter perfil do usuário
const getUserProfile = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User_1.default.findById(userId).select("-password");
        if (!user) {
            throw new appError_1.AppError("Usuário não encontrado", 404);
        }
        res.status(200).json({
            success: true,
            data: {
                user,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserProfile = getUserProfile;
// Atualizar perfil do usuário
const updateUserProfile = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { name, bio, education, profilePicture } = req.body;
        // Verificar se o usuário existe
        const user = await User_1.default.findById(userId);
        if (!user) {
            throw new appError_1.AppError("Usuário não encontrado", 404);
        }
        // Atualizar campos
        if (name)
            user.name = name;
        if (bio !== undefined)
            user.bio = bio;
        if (education !== undefined && user.role === "teacher")
            user.education = education;
        if (profilePicture)
            user.profilePicture = profilePicture;
        await user.save();
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
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateUserProfile = updateUserProfile;
// Obter todos os usuários (apenas para admin em um sistema real)
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User_1.default.find().select("-password");
        res.status(200).json({
            success: true,
            count: users.length,
            data: {
                users,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllUsers = getAllUsers;
