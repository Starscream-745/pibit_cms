# MongoDB File Storage (GridFS)

## Overview

Your CMS now uses **MongoDB GridFS** to store uploaded files directly in the database. This is the simplest solution - no external services or additional setup needed!

## How It Works

### GridFS
- MongoDB's built-in file storage system
- Stores files as chunks in the database
- Perfect for files up to 16MB (can handle larger with streaming)
- No additional configuration needed

### Upload Flow
1. User drags/drops file in CMS
2. File is sent to backend
3. Backend stores file in MongoDB using GridFS
4. MongoDB returns a file ID
5. Backend generates download URL: `/api/files/{fileId}`
6. URL is saved in the asset record

### Download Flow
1. User clicks download/open button
2. Browser requests: `/api/files/{fileId}`
3. Backend retrieves file from MongoDB GridFS
4. File is streamed to the browser
5. Browser displays or downloads the file

## Advantages

✅ **No External Services** - Everything in MongoDB
✅ **No API Keys** - No Google Drive setup needed
✅ **Simple Backup** - Files backed up with database
✅ **No File System** - No local folders to manage
✅ **Automatic Cleanup** - Delete asset = delete file
✅ **Works Immediately** - Already configured!

## File Storage Location

Files are stored in MongoDB collections:
- `uploads.files` - File metadata
- `uploads.chunks` - File data (in chunks)

You can view these in MongoDB Compass.

## File Size Limits

- **Current Limit**: 50MB per file (configured in uploadRoutes.ts)
- **MongoDB Limit**: 16MB per document, but GridFS handles larger files by chunking
- **Recommended**: Keep files under 10MB for best performance

## API Endpoints

### Upload File
```
POST /api/upload
Content-Type: multipart/form-data

Response:
{
  "success": true,
  "uploadMethod": "mongodb",
  "fileId": "507f1f77bcf86cd799439011",
  "fileName": "logo.png",
  "downloadUrl": "http://localhost:3000/api/files/507f1f77bcf86cd799439011",
  "contentType": "image/png",
  "size": 12345
}
```

### Download File
```
GET /api/files/{fileId}

Response: File stream with appropriate Content-Type header
```

### Check Status
```
GET /api/status

Response:
{
  "available": true,
  "storage": "mongodb",
  "message": "MongoDB file storage is active"
}
```

## Usage in CMS

1. **Create Asset Page**
   - Click "Upload File" tab
   - Drag and drop your file
   - File uploads to MongoDB
   - URL auto-populates
   - Fill in name, category, description
   - Submit

2. **View Assets**
   - Files display with preview (if image)
   - Click "Open" to view in new tab
   - Click "Download" to download

3. **Logos Page**
   - All logos display with previews
   - Click download to get the file
   - Files served from MongoDB

## Database Management

### View Files in MongoDB Compass
1. Connect to your database
2. Look for collections:
   - `uploads.files` - File metadata
   - `uploads.chunks` - File chunks

### Backup
Files are included in MongoDB backups:
```bash
mongodump --db pibit-cms
```

### Restore
```bash
mongorestore --db pibit-cms dump/pibit-cms
```

### Delete Orphaned Files
If you delete assets without deleting files, you can clean up:
```javascript
// In MongoDB shell
use pibit-cms
db.uploads.files.find()  // List all files
db.uploads.files.deleteOne({ _id: ObjectId("...") })  // Delete specific file
```

## Performance

- **Small Files** (<1MB): Excellent performance
- **Medium Files** (1-10MB): Good performance
- **Large Files** (10-50MB): Acceptable, but consider external storage for production

## Troubleshooting

### "Upload failed"
- Check MongoDB is running
- Check DATABASE_URL in .env
- Check backend console for errors

### "File not found" on download
- File ID might be invalid
- File might have been deleted
- Check MongoDB collections

### Slow uploads
- Large file size
- Slow MongoDB connection
- Consider reducing file size limit

## Migration from Other Storage

If you were using local storage or Google Drive:
- Old URLs will still work if files exist
- New uploads automatically use MongoDB
- No migration needed for existing assets

## Production Considerations

For production deployment:
1. **MongoDB Atlas** - Use cloud MongoDB for reliability
2. **CDN** - Consider CDN for frequently accessed files
3. **File Size** - Enforce reasonable limits
4. **Monitoring** - Monitor database size growth
5. **Backup** - Regular automated backups

## Cost

- **FREE** - No additional cost beyond MongoDB
- Storage uses your MongoDB space
- 15GB free with MongoDB Atlas
- Scales with your database plan

---

**Status**: ✅ Active and ready to use
**Setup Required**: None - works out of the box!
**Restart Backend**: Required to activate changes
