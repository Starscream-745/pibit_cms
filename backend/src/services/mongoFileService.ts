import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import { Readable } from 'stream';

interface UploadResult {
  fileId: string;
  fileName: string;
  downloadUrl: string;
  contentType: string;
}

class MongoFileService {
  private client: MongoClient | null = null;
  private bucket: GridFSBucket | null = null;
  private dbName: string;

  constructor() {
    const dbUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/pibit-cms';
    // Extract database name from URL
    this.dbName = dbUrl.split('/').pop() || 'pibit-cms';
  }

  /**
   * Initialize GridFS bucket
   */
  private async initBucket(): Promise<GridFSBucket> {
    if (this.bucket) {
      return this.bucket;
    }

    const dbUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/pibit-cms';
    this.client = new MongoClient(dbUrl);
    await this.client.connect();

    const db = this.client.db(this.dbName);
    this.bucket = new GridFSBucket(db, {
      bucketName: 'uploads',
    });

    console.log('✓ GridFS bucket initialized');
    return this.bucket;
  }

  /**
   * Upload file to MongoDB GridFS
   */
  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<UploadResult> {
    try {
      const bucket = await this.initBucket();

      // Create readable stream from buffer
      const readableStream = Readable.from(fileBuffer);

      // Upload to GridFS
      const uploadStream = bucket.openUploadStream(fileName, {
        contentType: mimeType,
        metadata: {
          originalName: fileName,
          uploadDate: new Date(),
        },
      });

      // Pipe the file buffer to GridFS
      await new Promise((resolve, reject) => {
        readableStream
          .pipe(uploadStream)
          .on('finish', resolve)
          .on('error', reject);
      });

      const fileId = uploadStream.id.toString();

      // Generate download URL
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      const downloadUrl = `${baseUrl}/api/files/${fileId}`;

      console.log('✓ File uploaded to MongoDB:', fileName);

      return {
        fileId,
        fileName,
        downloadUrl,
        contentType: mimeType,
      };
    } catch (error) {
      console.error('Error uploading to MongoDB:', error);
      throw new Error('Failed to upload file to MongoDB');
    }
  }

  /**
   * Download file from MongoDB GridFS
   */
  async downloadFile(fileId: string): Promise<{
    stream: Readable;
    fileName: string;
    contentType: string;
  }> {
    try {
      const bucket = await this.initBucket();
      const objectId = new ObjectId(fileId);

      // Get file info
      const files = await bucket.find({ _id: objectId }).toArray();
      if (files.length === 0) {
        throw new Error('File not found');
      }

      const file = files[0];
      const downloadStream = bucket.openDownloadStream(objectId);

      return {
        stream: downloadStream,
        fileName: file.filename,
        contentType: file.contentType || 'application/octet-stream',
      };
    } catch (error) {
      console.error('Error downloading from MongoDB:', error);
      throw new Error('Failed to download file from MongoDB');
    }
  }

  /**
   * Delete file from MongoDB GridFS
   */
  async deleteFile(fileId: string): Promise<void> {
    try {
      const bucket = await this.initBucket();
      const objectId = new ObjectId(fileId);
      await bucket.delete(objectId);
      console.log('✓ File deleted from MongoDB:', fileId);
    } catch (error) {
      console.error('Error deleting from MongoDB:', error);
      throw new Error('Failed to delete file from MongoDB');
    }
  }

  /**
   * Check if MongoDB is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      await this.initBucket();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Close MongoDB connection
   */
  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.bucket = null;
    }
  }
}

export default new MongoFileService();
