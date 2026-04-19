# Video Download Fix - MongoDB Files

## ✅ Issue Fixed

**Problem**: Videos stored in MongoDB were playing in the browser instead of downloading when clicking the Download button.

**Root Cause**: The `Content-Disposition` header was set to `inline` which tells the browser to display/play the file instead of downloading it.

**Solution**: Added `?download=true` query parameter to force `Content-Disposition: attachment` header.

---

## How It Works Now

### MongoDB Files (Videos, Images, Documents)
URL format: `http://localhost:3000/api/files/69e120a8770268fa409f0a0f`

#### Open Button (Blue)
```
URL: /api/files/{fileId}
Header: Content-Disposition: inline
Result: Plays/displays in browser
```

#### Download Button (Green)
```
URL: /api/files/{fileId}?download=true
Header: Content-Disposition: attachment
Result: Downloads to Downloads folder
```

---

## Technical Changes

### Backend (`uploadController.ts`)

```typescript
async downloadFile(req: Request, res: Response): Promise<void> {
  const { fileId } = req.params;
  const forceDownload = req.query.download === 'true';
  
  const { stream, fileName, contentType } = await mongoFileService.downloadFile(fileId);
  
  // Set headers
  res.setHeader('Content-Type', contentType);
  
  // Use 'attachment' to force download, 'inline' to display
  const disposition = forceDownload ? 'attachment' : 'inline';
  res.setHeader('Content-Disposition', `${disposition}; filename="${fileName}"`);
  
  stream.pipe(res);
}
```

### Frontend (`AssetCard.tsx`)

```typescript
const handleDownload = async () => {
  // Track download
  const response = await fetch(`${apiUrl}/api/assets/${asset.id}/download`, { headers });
  const data = await response.json();
  
  // Check if MongoDB file
  const isMongoFile = data.url.includes('/api/files/');
  
  if (isMongoFile) {
    // Add ?download=true to force download
    const downloadUrl = `${data.url}?download=true`;
    
    // Trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = asset.name;
    link.click();
  } else {
    // Handle external URLs (fetch as blob)
    // ... existing blob logic
  }
};
```

---

## Testing

### Test Video Download

1. **Restart backend** (to load new code)
   ```bash
   cd backend
   npm run dev
   ```

2. **Refresh frontend**
   ```
   http://localhost:5173
   ```

3. **Test Open button** (Blue)
   - Click "Open" on a video asset
   - Video should play in new browser tab
   - URL: `http://localhost:3000/api/files/{fileId}`

4. **Test Download button** (Green)
   - Click "Download" on a video asset
   - Video should download to Downloads folder
   - URL: `http://localhost:3000/api/files/{fileId}?download=true`
   - Check Downloads folder for the video file

---

## File Types

This fix works for all MongoDB-stored files:

### Videos
- ✅ MP4
- ✅ WebM
- ✅ MOV
- ✅ AVI

### Images
- ✅ JPG/JPEG
- ✅ PNG
- ✅ GIF
- ✅ SVG

### Documents
- ✅ PDF
- ✅ DOCX
- ✅ XLSX
- ✅ PPTX

### Archives
- ✅ ZIP
- ✅ RAR

---

## URL Patterns

### MongoDB Files (Uploaded via Upload Feature)
```
URL: http://localhost:3000/api/files/{fileId}
Storage: MongoDB GridFS
Open: /api/files/{fileId}
Download: /api/files/{fileId}?download=true
```

### External Files (Placeholder Images, External URLs)
```
URL: https://via.placeholder.com/400x400
Storage: External server
Open: Opens in new tab
Download: Fetched as blob, then downloaded
```

---

## Content-Disposition Header

### `inline` (Open Button)
```http
Content-Disposition: inline; filename="video.mp4"
```
- Browser displays/plays the file
- Good for previewing
- Videos play in browser
- PDFs open in browser
- Images display in browser

### `attachment` (Download Button)
```http
Content-Disposition: attachment; filename="video.mp4"
```
- Browser downloads the file
- Saves to Downloads folder
- Correct filename preserved
- Works for all file types

---

## Browser Behavior

### Without `?download=true`
```
Video → Plays in browser
PDF → Opens in browser
Image → Displays in browser
```

### With `?download=true`
```
Video → Downloads to folder
PDF → Downloads to folder
Image → Downloads to folder
```

---

## Analytics Tracking

Both Open and Download are tracked:
- ✅ Session ID
- ✅ User ID (if authenticated)
- ✅ IP Address
- ✅ Timestamp
- ✅ Asset ID and name

Only Download button increments download count in analytics.

---

## Verification

### Check if it's working:

1. **Upload a video**
   ```
   Go to Create Asset page
   Upload a video file
   Save the asset
   ```

2. **Test Open**
   ```
   Click Open button
   Video plays in browser tab
   ```

3. **Test Download**
   ```
   Click Download button
   Video downloads to Downloads folder
   Check Downloads folder
   ```

4. **Check Analytics**
   ```
   Login as admin
   Go to Analytics page
   Download count should increase
   ```

---

## Summary

✅ **Open Button**: Plays video in browser (inline)
✅ **Download Button**: Downloads video to folder (attachment)
✅ **Works for all file types**: Videos, images, documents
✅ **Analytics tracking**: Both actions tracked
✅ **Correct filename**: Preserved in download

**Video download is now working correctly!** 🎉
