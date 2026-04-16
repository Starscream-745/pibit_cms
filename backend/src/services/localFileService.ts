import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);

interface UploadResult {
  fileName: string;
  filePath: string;
  downloadUrl: string;
}

class LocalFileService {
  private uploadDir: string;

  constructor() {
    // Store uploads in backend/uploads directory
    this.uploadDir = path.join(process.cwd(), 'uploads');
    this.ensureUploadDir();
  }

  /**
   * Ensure upload directory exists
   */
  private async ensureUploadDir(): Promise<void> {
    try {
      if (!fs.existsSync(this.uploadDir)) {
        await mkdir(this.uploadDir, { recursive: true });
        console.log('✓ Upload directory created:', this.uploadDir);
      }
    } catch (error) {
      console.error('Error creating upload directory:', error);
    }
  }

  /**
   * Generate unique filename
   */
  private generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, ext);
    const safeName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, '_');
    return `${safeName}_${timestamp}_${random}${ext}`;
  }

  /**
   * Upload file to local storage
   */
  async uploadFile(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<UploadResult> {
    try {
      await this.ensureUploadDir();

      const fileName = this.generateFileName(originalName);
      const filePath = path.join(this.uploadDir, fileName);

      // Write file to disk
      await writeFile(filePath, fileBuffer);

      // Generate download URL
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      const downloadUrl = `${baseUrl}/uploads/${fileName}`;

      console.log('✓ File uploaded:', fileName);

      return {
        fileName,
        filePath,
        downloadUrl,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file to local storage');
    }
  }

  /**
   * Delete file from local storage
   */
  async deleteFile(fileName: string): Promise<void> {
    try {
      const filePath = path.join(this.uploadDir, fileName);
      if (fs.existsSync(filePath)) {
        await unlink(filePath);
        console.log('✓ File deleted:', fileName);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file from local storage');
    }
  }

  /**
   * Check if local storage is available
   */
  isAvailable(): boolean {
    return fs.existsSync(this.uploadDir);
  }
}

export default new LocalFileService();
