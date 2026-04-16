import express from 'express';
import multer from 'multer';
import uploadController from '../controllers/uploadController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    // Accept images, videos, documents, and common file types
    const allowedMimes = [
      // Images
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/bmp',
      // Videos
      'video/mp4',
      'video/mpeg',
      'video/quicktime',
      'video/x-msvideo',
      'video/x-ms-wmv',
      'video/webm',
      // Audio
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      // Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      // Archives
      'application/zip',
      'application/x-rar-compressed',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed. Supported: images, videos, documents`));
    }
  },
});

// Upload file endpoint (protected)
router.post('/upload', authenticate, upload.single('file'), uploadController.uploadFile);

// Download file endpoint (public)
router.get('/files/:fileId', uploadController.downloadFile);

// Check upload service status (public)
router.get('/status', uploadController.checkStatus);

export default router;
