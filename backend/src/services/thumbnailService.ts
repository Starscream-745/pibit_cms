import CloudConvert from 'cloudconvert';
import mongoFileService from './mongoFileService';
import axios from 'axios';

class ThumbnailService {
  private cloudConvert: CloudConvert | null = null;

  constructor() {
    const apiKey = process.env.CLOUDCONVERT_API_KEY;
    if (apiKey) {
      this.cloudConvert = new CloudConvert(apiKey, false); // false for production API
    }
  }

  isAvailable(): boolean {
    return this.cloudConvert !== null;
  }

  /**
   * Generates a JPEG thumbnail for a document (PDF, DOCX, PPTX) via CloudConvert.
   * Returns the GridFS downloadUrl for the saved thumbnail.
   */
  async generateThumbnail(
    fileBuffer: Buffer,
    originalFileName: string,
    mimeType: string
  ): Promise<string | null> {
    if (!this.cloudConvert) {
      console.warn('CloudConvert API key not configured. Skipping thumbnail generation.');
      return null;
    }

    try {
      console.log(`Starting thumbnail generation for ${originalFileName}...`);

      // 1. Create the CloudConvert Job
      const job = await this.cloudConvert.jobs.create({
        tasks: {
          'import-it': {
            operation: 'import/upload'
          },
          'convert-it': {
            operation: 'convert',
            input: 'import-it',
            output_format: 'jpg',
            pages: '1', // Only extract the first page for the thumbnail
            width: 800, // Optimize width for card previews
            fit: 'max'
          },
          'export-it': {
            operation: 'export/url',
            input: 'convert-it'
          }
        }
      });

      // 2. Upload the file buffer to the import task
      const uploadTask = job.tasks.find(task => task.name === 'import-it');
      if (!uploadTask) throw new Error('Upload task not found in job.');
      
      await this.cloudConvert.tasks.upload(uploadTask, fileBuffer, originalFileName);

      // 3. Wait for the job to complete
      const finishedJob = await this.cloudConvert.jobs.wait(job.id);
      
      if (finishedJob.status === 'error') {
        throw new Error('CloudConvert job failed to process the file.');
      }

      // 4. Get the export task and download the generated JPG
      const exportTask = finishedJob.tasks.find(
        task => task.name === 'export-it' && task.status === 'finished'
      );
      
      if (!exportTask || !exportTask.result || !exportTask.result.files || exportTask.result.files.length === 0) {
        throw new Error('Export task did not return any files.');
      }

      const fileData = exportTask.result.files[0];
      const downloadUrl = fileData.url;

      // 5. Download the image buffer from CloudConvert URL
      const response = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data);

      // 6. Save the thumbnail to MongoDB GridFS
      const thumbFileName = `thumbnail_${Date.now()}_${originalFileName}.jpg`;
      const uploadResult = await mongoFileService.uploadFile(
        imageBuffer,
        thumbFileName,
        'image/jpeg'
      );

      console.log('✓ Thumbnail generated and saved to GridFS:', uploadResult.downloadUrl);
      return uploadResult.downloadUrl;

    } catch (error) {
      console.error('Thumbnail generation error:', error);
      // Return null so the main upload still succeeds without a thumbnail
      return null;
    }
  }
}

export default new ThumbnailService();
