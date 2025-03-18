"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.createComment = exports.getCommentsByPost = void 0;
const Comment_1 = __importDefault(require("../models/Comment"));
const Post_1 = __importDefault(require("../models/Post"));
const appError_1 = require("../utils/appError");
// Obter comentários de um post
const getCommentsByPost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const page = Number.parseInt(req.query.page) || 1;
        const limit = Number.parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        // Verificar se o post existe
        const postExists = await Post_1.default.exists({ _id: postId });
        if (!postExists) {
            throw new appError_1.AppError("Post não encontrado", 404);
        }
        const comments = await Comment_1.default.find({ post: postId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("author", "name email role profilePicture");
        const total = await Comment_1.default.countDocuments({ post: postId });
        res.status(200).json({
            success: true,
            count: comments.length,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: {
                comments,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCommentsByPost = getCommentsByPost;
// Criar um comentário
const createComment = async (req, res, next) => {
    try {
        const { content } = req.body;
        const postId = req.params.postId;
        const userId = req.user?.id;
        // Verificar se o post existe
        const postExists = await Post_1.default.exists({ _id: postId });
        if (!postExists) {
            throw new appError_1.AppError("Post não encontrado", 404);
        }
        const comment = await Comment_1.default.create({
            content,
            author: userId,
            post: postId,
        });
        await comment.populate("author", "name email role profilePicture");
        res.status(201).json({
            success: true,
            data: {
                comment,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createComment = createComment;
// Excluir um comentário
const deleteComment = async (req, res, next) => {
    try {
        const commentId = req.params.id;
        const userId = req.user?.id;
        // Verificar se o comentário existe
        const comment = await Comment_1.default.findById(commentId);
        if (!comment) {
            throw new appError_1.AppError("Comentário não encontrado", 404);
        }
        // Verificar se o usuário é o autor do comentário
        if (comment.author.toString() !== userId) {
            throw new appError_1.AppError("Você não tem permissão para excluir este comentário", 403);
        }
        await Comment_1.default.deleteOne({ _id: commentId });
        res.status(200).json({
            success: true,
            message: "Comentário excluído com sucesso",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteComment = deleteComment;
