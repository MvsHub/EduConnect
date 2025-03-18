"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.frontendIntegration = void 0;
const User_1 = __importDefault(require("../models/User"));
const Post_1 = __importDefault(require("../models/Post"));
const Comment_1 = __importDefault(require("../models/Comment"));
const integrationService_1 = require("./integrationService");
const logger_1 = require("../utils/logger");
// Serviço para integração com o frontend existente
exports.frontendIntegration = {
    // Adaptar dados do usuário para o formato do frontend
    adaptUserData: async (userId) => {
        try {
            const user = await User_1.default.findById(userId).select("-password");
            if (!user)
                return null;
            return integrationService_1.integrationService.transformUser(user);
        }
        catch (error) {
            logger_1.logger.error("Erro ao adaptar dados do usuário:", error);
            return null;
        }
    },
    // Adaptar dados do post para o formato do frontend
    adaptPostData: async (postId) => {
        try {
            const post = await Post_1.default.findById(postId).populate("author", "name email role profilePicture");
            if (!post)
                return null;
            const comments = await Comment_1.default.find({ post: postId })
                .sort({ createdAt: -1 })
                .populate("author", "name email role profilePicture");
            return integrationService_1.integrationService.transformPost(post, comments);
        }
        catch (error) {
            logger_1.logger.error("Erro ao adaptar dados do post:", error);
            return null;
        }
    },
    // Middleware para adaptar resposta ao formato do frontend
    adaptResponse: (dataType) => {
        return (req, res, next) => {
            const originalSend = res.json;
            res.json = function (body) {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    let adaptedBody;
                    switch (dataType) {
                        case "user":
                            adaptedBody = {
                                ...body,
                                data: {
                                    ...body.data,
                                    user: body.data.user ? integrationService_1.integrationService.transformUser(body.data.user) : null,
                                },
                            };
                            break;
                        case "post":
                            adaptedBody = {
                                ...body,
                                data: {
                                    ...body.data,
                                    post: body.data.post ? integrationService_1.integrationService.transformPost(body.data.post) : null,
                                },
                            };
                            break;
                        case "comment":
                            adaptedBody = {
                                ...body,
                                data: {
                                    ...body.data,
                                    comment: body.data.comment ? integrationService_1.integrationService.transformComment(body.data.comment) : null,
                                },
                            };
                            break;
                        default:
                            adaptedBody = body;
                    }
                    return originalSend.call(this, adaptedBody);
                }
                return originalSend.call(this, body);
            };
            next();
        };
    },
};
