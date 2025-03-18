"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.integrationService = void 0;
const logger_1 = require("../utils/logger");
// Serviço para integração com o frontend
exports.integrationService = {
    // Transformar modelo de usuário para o formato do frontend
    transformUser: (user) => {
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            education: user.education,
            bio: user.bio,
            profilePicture: user.profilePicture,
        };
    },
    // Transformar modelo de post para o formato do frontend
    transformPost: (post, comments = []) => {
        return {
            id: post._id,
            title: post.title,
            content: post.content,
            imageUrl: post.imageUrl,
            author: post.author,
            createdAt: post.createdAt,
            likes: post.likes,
            comments: comments.map((comment) => ({
                id: comment._id,
                content: comment.content,
                author: comment.author,
                createdAt: comment.createdAt,
            })),
        };
    },
    // Transformar modelo de comentário para o formato do frontend
    transformComment: (comment) => {
        return {
            id: comment._id,
            content: comment.content,
            author: comment.author,
            createdAt: comment.createdAt,
        };
    },
    // Registrar evento de integração (para análise e depuração)
    logIntegrationEvent: (event, data) => {
        logger_1.logger.info(`Integration Event: ${event}`, { data });
    },
};
