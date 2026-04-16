# Google Drive API Setup Guide

This guide will help you set up Google Drive API integration for automatic file uploads in your PIBIT.AI CMS.

## Overview

With Google Drive integration enabled, you can:
- Drag and drop files directly in the CMS
- Automatically upload files to your Google Drive
- Get download URLs automatically
- No manual upload needed

## Prerequisites

- Google Account
- Google Cloud Console access
- Node.js backend running

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `PIBIT-CMS` (or any name)
4. Click "Create"

### 2. Enable Google Drive API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Drive API"
3. Click on it and press "Enable"

### 3. Create Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Enter details:
   - **Service account name**: `pibit-cms-uploader`
   - **Service account ID**: (auto-generated)
   - **Description**: `Service account for CMS file uploads`
4. Click "Create and Continue"
5. Skip optional steps (Grant access, Grant users access)
6. Click "Done"

### 4. Create Service Account Key

1. In "Credentials" page, find your service account
2. Click on the service account email
3. Go to "Keys" tab
4. Click "Add Key" → "Create new key"
5. Select "JSON" format
6. Click "Create"
7. A JSON file will download automatically - **keep this safe!**

### 5. Configure Your Backend

1. Rename the downloaded JSON file to `google-credentials.json`
2. Move it to your backend folder: `backend/google-credentials.json`
3. Update your `backend/.env` file:

```env
# Google Drive API Configuration
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
```

### 6. (Optional) Create a Dedicated Upload Folder

If you want all uploads to go to a specific folder:

1. Open [Google Drive](https://drive.google.com/)
2. Create a new folder (e.g., "CMS Uploads")
3. Right-click the folder → "Share"
4. Add your service account email (found in the JSON file: `client_email`)
5. Give it "Editor" permission
6. Copy the folder ID from the URL:
   - URL format: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
7. Add to your `.env`:

```env
GOOGLE_DRIVE_FOLDER_ID=your-folder-id-here
```

### 7. Security: Add to .gitignore

Make sure your credentials are NOT committed to git:

```bash
# Add to .gitignore
backend/google-credentials.json
```

### 8. Restart Your Backend

```bash
cd backend
npm run dev
```

## Testing the Integration

1. Open your CMS: `http://localhost:5173`
2. Click "+ Add Asset"
3. Click "Upload File" tab
4. Drag and drop a file or click to browse
5. File should upload to Google Drive automatically
6. URL will be populated automatically

## Troubleshooting

### "Google Drive integration not configured"
- Check that `GOOGLE_APPLICATION_CREDENTIALS` is set in `.env`
- Verify the path to `google-credentials.json` is correct
- Restart your backend server

### "Upload failed"
- Check that Google Drive API is enabled in Cloud Console
- Verify service account has proper permissions
- Check backend console for detailed error messages

### "Permission denied"
- If using a specific folder, ensure service account has Editor access
- Check folder ID is correct in `.env`

### Files upload but can't be accessed
- Make sure permissions are set to "anyone with the link" (handled automatically by the code)
- Check that the file ID is correct in the generated URL

## Without Google Drive Integration

If you don't set up Google Drive API, the CMS will still work perfectly:
- The "Upload File" option will show an error message
- You can still use "Enter URL" mode to manually add URLs
- All other features work normally

## Cost

- Google Drive API is **FREE** for normal usage
- 1 billion queries per day limit (more than enough for a CMS)
- Storage uses your Google Drive quota (15GB free)

## Security Best Practices

1. ✅ Never commit `google-credentials.json` to git
2. ✅ Keep service account keys secure
3. ✅ Use environment variables for configuration
4. ✅ Regularly rotate service account keys (every 90 days recommended)
5. ✅ Use a dedicated folder with limited access
6. ✅ Monitor API usage in Google Cloud Console

## Need Help?

- [Google Drive API Documentation](https://developers.google.com/drive/api/guides/about-sdk)
- [Service Account Guide](https://cloud.google.com/iam/docs/service-accounts)
- Check backend logs for detailed error messages

---

**Note**: This setup is optional. Your CMS works perfectly fine with manual URL entry if you prefer not to set up Google Drive API integration.
