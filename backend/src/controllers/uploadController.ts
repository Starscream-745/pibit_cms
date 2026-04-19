import { Request, Response } from 'express';
import mongoFileService from '../services/mongoFileService';

// Extend Express Request type to include file from multer
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

class UploadController {
  /**
   * Upload file to MongoDB GridFS and return download URL
   */
  async uploadFile(req: MulterRequest, res: Response): Promise<void> {
    try {
      // Check if file exists
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const file = req.file;

      // Upload to MongoDB GridFS
      const result = await mongoFileService.uploadFile(
        file.buffer,
        file.originalname,
        file.mimetype
      );

      res.status(200).json({
        success: true,
        uploadMethod: 'mongodb',
        fileId: result.fileId,
        fileName: result.fileName,
        downloadUrl: result.downloadUrl,
        contentType: result.contentType,
        size: file.size,
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        error: 'Upload failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Download file from MongoDB GridFS
   */
  async downloadFile(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;
      const forceDownload = req.query.download === 'true';

      const { stream, fileName, contentType } = await mongoFileService.downloadFile(fileId);

      // Set headers
      res.setHeader('Content-Type', contentType);
      
      // Use 'attachment' to force download, 'inline' to display in browser
      const disposition = forceDownload ? 'attachment' : 'inline';
      
      // Properly encode filename to prevent header parsing errors in browsers
      const encodedFileName = encodeURIComponent(fileName);
      res.setHeader(
        'Content-Disposition', 
        `${disposition}; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`
      );

      // Pipe the stream to response
      stream.pipe(res);
    } catch (error) {
      console.error('Download error:', error);
      res.status(404).json({
        error: 'File not found',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Check if upload service is available
   */
  async checkStatus(_req: Request, res: Response): Promise<void> {
    const mongoAvailable = await mongoFileService.isAvailable();

    res.status(200).json({
      available: mongoAvailable,
      storage: 'mongodb',
      message: mongoAvailable
        ? 'MongoDB file storage is active'
        : 'MongoDB file storage not available',
    });
  }
}

export default new UploadController();
