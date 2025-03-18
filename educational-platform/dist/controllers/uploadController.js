"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const blob_1 = require("@vercel/blob");
const uuid_1 = require("uuid");
const appError_1 = require("../utils/appError");
// Upload de imagem
const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new appError_1.AppError("Nenhum arquivo enviado", 400);
        }
        const file = req.file;
        const fileExtension = file.originalname.split(".").pop();
        const fileName = `${(0, uuid_1.v4)()}.${fileExtension}`;
        // Upload para o Vercel Blob Storage
        const blob = await (0, blob_1.put)(fileName, file.buffer, {
            access: "public",
            contentType: file.mimetype,
        });
        res.status(200).json({
            success: true,
            data: {
                url: blob.url,
                size: blob.size,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.uploadImage = uploadImage;
