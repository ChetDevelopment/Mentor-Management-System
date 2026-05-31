import { extname, join } from 'path';
import { diskStorage } from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';

const imageTypes = /\.(jpg|jpeg|png|gif|webp)$/;
const pdfTypes = /\.(pdf)$/;

export const avatarStorage = diskStorage({
  destination: join(process.cwd(), 'uploads/avatars'),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + extname(file.originalname));
  },
});

export const cvStorage = diskStorage({
  destination: join(process.cwd(), 'uploads/cvs'),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + extname(file.originalname));
  },
});

export const resourceStorage = diskStorage({
  destination: join(process.cwd(), 'uploads/resources'),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + extname(file.originalname));
  },
});

export const imageFileFilter = (_req: any, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
  if (!file.originalname.match(imageTypes)) {
    cb(new HttpException('Only image files (jpg, jpeg, png, gif, webp) are allowed', HttpStatus.BAD_REQUEST), false);
    return;
  }
  cb(null, true);
};

export const pdfFileFilter = (_req: any, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
  if (!file.originalname.match(pdfTypes)) {
    cb(new HttpException('Only PDF files are allowed', HttpStatus.BAD_REQUEST), false);
    return;
  }
  cb(null, true);
};

export const avatarUploadOptions = {
  storage: avatarStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
};

export const cvUploadOptions = {
  storage: cvStorage,
  fileFilter: pdfFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
};

export const resourceUploadOptions = {
  storage: resourceStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
};
