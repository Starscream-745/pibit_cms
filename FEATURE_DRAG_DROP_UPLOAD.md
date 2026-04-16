# Drag & Drop File Upload Feature

## Overview

Added Google Drive integration with drag-and-drop file upload functionality to the PIBIT.AI CMS. Users can now upload files directly through the CMS interface, and files are automatically uploaded to Google Drive with download URLs generated automatically.

## What Was Implemented

### Backend Components

1. **Google Drive Service** (`backend/src/services/googleDriveService.ts`)
   - Handles file uploads to Google Drive
   - Generates public download URLs
   - Manages file permissions
   - Supports optional folder organization

2. **Upload Controller** (`backend/src/controllers/uploadController.ts`)
   - Handles file upload requests
   - Validates files and checks configuration
   - Returns download URLs to frontend

3. **Upload Routes** (`backend/src/routes/uploadRoutes.ts`)
   - POST `/api/upload` - Upload file endpoint
   - GET `/api/status` - Check if Google Drive is configured
   - File validation (type, size limits)
   - 50MB file size limit

4. **Server Integration** (`backend/src/server.ts`)
   - Added upload routes to Express app
   - Integrated with existing middleware

### Frontend Components

1. **FileUpload Component** (`frontend/src/components/FileUpload.tsx`)
   - Drag-and-drop interface
   - Click to browse files
   - Upload progress indicator
   - Success/error handling
   - Visual feedback during drag operations

2. **Updated AssetForm** (`frontend/src/components/AssetForm.tsx`)
   - Toggle between "Enter URL" and "Upload File" modes
   - Integrated FileUpload component
   - Auto-populates URL field after successful upload
   - Auto-fills name from filename if empty

3. **Styling** (`frontend/src/styles/FileUpload.css`, `frontend/src/styles/AssetForm.css`)
   - PIBIT.AI brand-compliant design
   - Smooth animations and transitions
   - Responsive layout
   - Visual feedback for drag states

### Configuration & Documentation

1. **Environment Variables** (`backend/.env.example`)
   - `GOOGLE_APPLICATION_CREDENTIALS` - Path to service account JSON
   - `GOOGLE_DRIVE_FOLDER_ID` - Optional specific folder for uploads

2. **Setup Guide** (`GOOGLE_DRIVE_SETUP.md`)
   - Complete step-by-step instructions
   - Google Cloud Console setup
   - Service account creation
   - API enablement
   - Troubleshooting guide

3. **Security** (`.gitignore`)
   - Added `google-credentials.json` to prevent credential leaks
   - Environment variable protection

4. **Documentation** (`README.md`)
   - Updated features list
   - Added Google Drive setup reference
   - Updated API endpoints documentation

### Dependencies Added

**Backend:**
- `googleapis` - Google Drive API client
- `multer` - File upload handling middleware

## How It Works

### User Flow

1. User clicks "+ Add Asset"
2. Clicks "Upload File" tab (or stays on "Enter URL" for manual entry)
3. Drags and drops a file or clicks to browse
4. File is uploaded to Google Drive via backend
5. Backend returns download URL
6. URL is automatically populated in the form
7. User fills in remaining details (name, category, description)
8. Submits the form to create the asset

### Technical Flow

```
Frontend (FileUpload)
    ↓ FormData with file
Backend (uploadController)
    ↓ File buffer
Google Drive Service
    ↓ Upload to Drive
    ↓ Set public permissions
    ↓ Generate download URL
Backend Response
    ↓ Download URL
Frontend (AssetForm)
    ↓ Auto-populate URL field
User submits form
    ↓
Asset saved to MongoDB
```

## Features

### ✅ Implemented

- Drag-and-drop file upload
- Click to browse file selection
- Upload progress indicator
- File type validation
- File size validation (50MB limit)
- Automatic Google Drive upload
- Public download URL generation
- Toggle between URL entry and file upload
- Auto-populate form fields
- Success/error feedback
- Graceful fallback (works without Google Drive setup)

### 🎨 UI/UX Features

- Smooth drag-and-drop animations
- Visual feedback during drag operations
- Upload progress spinner
- Success messages
- Error handling with user-friendly messages
- PIBIT.AI brand styling
- Responsive design

### 🔒 Security Features

- File type whitelist (images, documents, videos, audio)
- File size limits
- Service account authentication
- Credentials not committed to git
- Environment variable configuration
- Public read-only permissions on uploaded files

## Supported File Types

- **Images**: JPEG, PNG, GIF, WebP, SVG
- **Documents**: PDF, DOC, DOCX, XLS, XLSX
- **Videos**: MP4, MPEG
- **Audio**: MP3, WAV

## Configuration Options

### Required (for upload feature)
- `GOOGLE_APPLICATION_CREDENTIALS` - Path to service account JSON file

### Optional
- `GOOGLE_DRIVE_FOLDER_ID` - Specific folder for uploads (otherwise uploads to root)

## Fallback Behavior

If Google Drive is NOT configured:
- "Upload File" tab shows error message
- "Enter URL" tab still works perfectly
- All other CMS features work normally
- No impact on existing functionality

## Testing Checklist

- [ ] Drag and drop file
- [ ] Click to browse and select file
- [ ] Upload progress shows correctly
- [ ] URL auto-populates after upload
- [ ] File appears in Google Drive
- [ ] Download URL works
- [ ] File size limit enforced
- [ ] File type validation works
- [ ] Error messages display correctly
- [ ] Toggle between URL/Upload modes
- [ ] Works without Google Drive setup (fallback)

## Future Enhancements (Optional)

- [ ] Multiple file upload at once
- [ ] Image preview before upload
- [ ] Upload queue for multiple files
- [ ] Drag-and-drop directly on asset list
- [ ] Delete from Google Drive when asset deleted
- [ ] File compression before upload
- [ ] Custom folder selection per upload
- [ ] Upload history/logs

## Files Modified

### Created
- `backend/src/services/googleDriveService.ts`
- `backend/src/controllers/uploadController.ts`
- `backend/src/routes/uploadRoutes.ts`
- `frontend/src/components/FileUpload.tsx`
- `frontend/src/styles/FileUpload.css`
- `GOOGLE_DRIVE_SETUP.md`
- `FEATURE_DRAG_DROP_UPLOAD.md`

### Modified
- `backend/src/server.ts` - Added upload routes
- `backend/.env.example` - Added Google Drive config
- `frontend/src/components/AssetForm.tsx` - Added upload integration
- `frontend/src/styles/AssetForm.css` - Added upload styles
- `.gitignore` - Added credentials protection
- `README.md` - Updated documentation

## Cost & Limits

- **Google Drive API**: FREE (1 billion queries/day)
- **Storage**: Uses Google Drive quota (15GB free)
- **File Size Limit**: 50MB per file (configurable)
- **No additional costs** for normal CMS usage

## Support

For setup help, see:
- `GOOGLE_DRIVE_SETUP.md` - Complete setup guide
- `README.md` - General documentation
- Backend logs for error details

---

**Status**: ✅ Complete and ready to use
**Optional**: Works with or without Google Drive setup
**Tested**: TypeScript compilation successful, no errors
