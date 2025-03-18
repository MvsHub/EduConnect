import type { Response, NextFunction } from "express";
import { put } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../utils/appError";
import type { AuthRequest } from "../middlewares/auth";

// Upload de imagem
export const uploadImage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new AppError("Nenhum arquivo enviado", 400);
    }

    const file = req.file;
    const fileExtension = file.originalname.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;

    // Upload para o Vercel Blob Storage
    const blob = await put(fileName, file.buffer, {
      access: "public",
      contentType: file.mimetype,
    });

    res.status(200).json({
      success: true,
      data: {
        url: blob.url,
        size: file.size, // Use o tamanho do arquivo original
      },
    });
  } catch (error) {
    next(error);
  }
};