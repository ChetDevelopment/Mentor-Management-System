import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import { BadRequestException } from '@nestjs/common';

const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
const ALLOWED_CV_TYPES = ['application/pdf'];
const ALLOWED_AVATAR_EXTS = ['.jpg', '.jpeg', '.png'];
const ALLOWED_CV_EXTS = ['.pdf'];

const createUploadConfig = (
    destination: string,
    maxSize: number,
    allowedMimes: string[],
    allowedExts: string[],
) => ({
    storage: diskStorage({
        destination: (_req, _file, cb) => {
            const uploadPath = join(process.cwd(), destination);
            if (!existsSync(uploadPath)) {
                mkdirSync(uploadPath, { recursive: true, mode: 0o750 });
            }
            cb(null, uploadPath);
        },
        filename: (_req, file, cb) => {
            const ext = extname(file.originalname).toLowerCase();
            if (!allowedExts.includes(ext)) {
                return cb(
                    new BadRequestException(
                        `File extension ${ext} is not allowed. Allowed: ${allowedExts.join(', ')}`,
                    ),
                    '' as any,
                );
            }
            // UUID-based filename — no original name to prevent path traversal
            const safeName = `${randomUUID()}${ext}`;
            cb(null, safeName);
        },
    }),
    limits: {
        fileSize: maxSize,
        files: 1,
    },
    fileFilter: (_req, file, cb) => {
        if (!allowedMimes.includes(file.mimetype)) {
            return cb(
                new BadRequestException(
                    `File type ${file.mimetype} is not allowed. Allowed: ${allowedMimes.join(', ')}`,
                ),
                false,
            );
        }
        cb(null, true);
    },
});

export const avatarUploadConfig = createUploadConfig(
    'uploads/avatars',
    5 * 1024 * 1024,
    ALLOWED_AVATAR_TYPES,
    ALLOWED_AVATAR_EXTS,
);

export const cvUploadConfig = createUploadConfig(
    'uploads/cvs',
    10 * 1024 * 1024,
    ALLOWED_CV_TYPES,
    ALLOWED_CV_EXTS,
);
