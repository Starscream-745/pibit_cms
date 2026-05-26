import { Request, Response } from 'express';
import mongoFileService from '../services/mongoFileService';
import thumbnailService from '../services/thumbnailService';

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

      // Check if file is a document that needs a thumbnail
      let thumbnailUrl: string | undefined;
      const isDocument = file.mimetype.includes('pdf') || 
                         file.mimetype.includes('word') || 
                         file.mimetype.includes('powerpoint') || 
                         file.mimetype.includes('presentation');

      if (isDocument && thumbnailService.isAvailable()) {
        const thumbUrl = await thumbnailService.generateThumbnail(
          file.buffer,
          file.originalname,
          file.mimetype
        );
        if (thumbUrl) thumbnailUrl = thumbUrl;
      }

      res.status(200).json({
        success: true,
        uploadMethod: 'mongodb',
        fileId: result.fileId,
        fileName: result.fileName,
        downloadUrl: result.downloadUrl,
        thumbnailUrl: thumbnailUrl,
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

      const range = req.headers.range;
      let start: number | undefined;
      let end: number | undefined;

      // First, get the file metadata to know its length
      // We will call downloadFile without options first to get the total length,
      // but mongoFileService.downloadFile actually opens the stream immediately.
      // Wait, let's just parse range, but we need the total length to calculate end.
      // Fortunately, mongoFileService.downloadFile returns `length`.
      // We can open the stream, get the length, and if it's a range request, we'll close that stream and open a new one with the range.
      // Alternatively, we can just pass the parsed start/end from the header and handle defaults.
      // Let's parse the range header basic values first.
      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        if (parts[0]) start = parseInt(parts[0], 10);
        if (parts[1]) end = parseInt(parts[1], 10);
      }

      // Fetch the file stream and metadata
      const { stream, fileName, contentType, length } = await mongoFileService.downloadFile(fileId, { start, end });

      // Fix missing 'end' if it wasn't provided in the Range header
      if (range && end === undefined) {
        end = length - 1;
      }
      
      // Calculate chunk size
      const startByte = start || 0;
      const endByte = end !== undefined ? end : length - 1;
      const chunkSize = endByte - startByte + 1;

      // Set basic headers
      res.setHeader('Content-Type', contentType);
      res.setHeader('Accept-Ranges', 'bytes');
      
      const disposition = forceDownload ? 'attachment' : 'inline';
      const encodedFileName = encodeURIComponent(fileName);
      
      // Use a safe ASCII-only filename for the legacy 'filename' parameter
      const safeFileName = fileName.replace(/[^\x20-\x7E]/g, '_');

      res.setHeader(
        'Content-Disposition', 
        `${disposition}; filename="${safeFileName}"; filename*=UTF-8''${encodedFileName}`
      );

      // Handle Partial Content (206) for Range requests
      if (range) {
        res.status(206);
        res.setHeader('Content-Range', `bytes ${startByte}-${endByte}/${length}`);
        res.setHeader('Content-Length', chunkSize);
      } else {
        res.status(200);
        res.setHeader('Content-Length', length);
      }

      // Handle stream errors to prevent server crashes
      stream.on('error', (err) => {
        console.error('Download stream error:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to stream file' });
        }
      });

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
