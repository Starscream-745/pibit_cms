import { google } from 'googleapis';
import { Readable } from 'stream';

interface UploadResult {
  fileId: string;
  webViewLink: string;
  downloadLink: string;
}

class GoogleDriveService {
  private drive;
  private folderId: string | undefined;

  constructor() {
    // Initialize Google Drive API
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    this.drive = google.drive({ version: 'v3', auth });
    this.folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  }

  /**
   * Upload a file to Google Drive
   */
  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<UploadResult> {
    try {
      // Convert buffer to readable stream
      const fileStream = Readable.from(fileBuffer);

      // Upload file to Google Drive
      const fileMetadata = {
        name: fileName,
        parents: this.folderId ? [this.folderId] : undefined,
      };

      const media = {
        mimeType: mimeType,
        body: fileStream,
      };

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, webViewLink',
      });

      const fileId = response.data.id!;

      // Make file publicly accessible
      await this.drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      // Generate download link
      const downloadLink = `https://drive.usercontent.google.com/u/0/uc?id=${fileId}&export=download`;

      return {
        fileId: fileId,
        webViewLink: response.data.webViewLink || '',
        downloadLink: downloadLink,
      };
    } catch (error) {
      console.error('Error uploading to Google Drive:', error);
      throw new Error('Failed to upload file to Google Drive');
    }
  }

  /**
   * Delete a file from Google Drive
   */
  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.drive.files.delete({
        fileId: fileId,
      });
    } catch (error) {
      console.error('Error deleting from Google Drive:', error);
      throw new Error('Failed to delete file from Google Drive');
    }
  }

  /**
   * Check if Google Drive is configured
   */
  isConfigured(): boolean {
    return !!process.env.GOOGLE_APPLICATION_CREDENTIALS;
  }
}

export default new GoogleDriveService();
