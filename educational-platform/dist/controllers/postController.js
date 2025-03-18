"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostsByUser = exports.toggleLike = exports.deletePost = exports.updatePost = exports.createPost = exports.getPostById = exports.getAllPosts = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Post_1 = __importDefault(require("../models/Post"));
const Comment_1 = __importDefault(require("../models/Comment"));
const appError_1 = require("../utils/appError");
// Obter todos os posts
const getAllPosts = async (req, res, next) => {
    try {
        const page = Number.parseInt(req.query.page) || 1;
        const limit = Number.parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const posts = await Post_1.default.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("author", "name email role profilePicture");
        const total = await Post_1.default.countDocuments();
        res.status(200).json({
            success: true,
            count: posts.length,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: {
                posts,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllPosts = getAllPosts;
// Obter um post específico
const getPostById = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await Post_1.default.findById(postId).populate("author", "name email role profilePicture");
        if (!post) {
            throw new appError_1.AppError("Post não encontrado", 404);
        }
        // Buscar comentários do post
        const comments = await Comment_1.default.find({ post: postId })
            .sort({ createdAt: -1 })
            .populate("author", "name email role profilePicture");
        res.status(200).json({
            success: true,
            data: {
                post,
                comments,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getPostById = getPostById;
// Criar um novo post
const createPost = async (req, res, next) => {
    try {
        const { title, content, imageUrl } = req.body;
        const userId = req.user?.id;
        // Verificar se o usuário é um professor
        if (req.user?.role !== "teacher") {
            throw new appError_1.AppError("Apenas professores podem criar posts", 403);
        }
        const post = await Post_1.default.create({
            title,
            content,
            imageUrl,
            author: userId,
        });
        await post.populate("author", "name email role profilePicture");
        res.status(201).json({
            success: true,
            data: {
                post,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createPost = createPost;
// Atualizar um post
const updatePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const { title, content, imageUrl } = req.body;
        const userId = req.user?.id;
        // Verificar se o post existe
        const post = await Post_1.default.findById(postId);
        if (!post) {
            throw new appError_1.AppError("Post não encontrado", 404);
        }
        // Verificar se o usuário é o autor do post
        if (post.author.toString() !== userId) {
            throw new appError_1.AppError("Você não tem permissão para editar este post", 403);
        }
        // Atualizar campos
        if (title)
            post.title = title;
        if (content)
            post.content = content;
        if (imageUrl !== undefined)
            post.imageUrl = imageUrl;
        await post.save();
        await post.populate("author", "name email role profilePicture");
        res.status(200).json({
            success: true,
            data: {
                post,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updatePost = updatePost;
// Excluir um post
const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const userId = req.user?.id;
        // Verificar se o post existe
        const post = await Post_1.default.findById(postId);
        if (!post) {
            throw new appError_1.AppError("Post não encontrado", 404);
        }
        // Verificar se o usuário é o autor do post
        if (post.author.toString() !== userId) {
            throw new appError_1.AppError("Você não tem permissão para excluir este post", 403);
        }
        // Excluir comentários relacionados ao post
        await Comment_1.default.deleteMany({ post: postId });
        // Excluir o post
        await Post_1.default.deleteOne({ _id: postId });
        res.status(200).json({
            success: true,
            message: "Post excluído com sucesso",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deletePost = deletePost;
// Curtir/descurtir um post
const toggleLike = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const userId = req.user?.id;
        // Verificar se o post existe
        const post = await Post_1.default.findById(postId);
        if (!post) {
            throw new appError_1.AppError("Post não encontrado", 404);
        }
        // Verificar se o usuário já curtiu o post
        const isLiked = post.likes.some((id) => id.toString() === userId);
        if (isLiked) {
            // Remover curtida
            post.likes = post.likes.filter((id) => id.toString() !== userId);
        }
        else {
            // Adicionar curtida
            post.likes.push(new mongoose_1.default.Types.ObjectId(userId));
        }
        await post.save();
        await post.populate("author", "name email role profilePicture");
        res.status(200).json({
            success: true,
            data: {
                post,
                liked: !isLiked,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.toggleLike = toggleLike;
// Obter posts de um usuário específico
const getPostsByUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const page = Number.parseInt(req.query.page) || 1;
        const limit = Number.parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const posts = await Post_1.default.find({ author: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("author", "name email role profilePicture");
        const total = await Post_1.default.countDocuments({ author: userId });
        res.status(200).json({
            success: true,
            count: posts.length,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: {
                posts,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getPostsByUser = getPostsByUser;
