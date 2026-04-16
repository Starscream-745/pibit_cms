# Authentication Setup Guide

## Overview

Your CMS now has optional login authentication to protect asset management while keeping the logos page public.

## Features

✅ **Optional Authentication** - Enable/disable via environment variable
✅ **Public Logos Page** - Anyone can view and download logos
✅ **Protected Asset Management** - Create, edit, delete requires login
✅ **JWT Tokens** - Secure token-based authentication
✅ **24-hour Sessions** - Auto-logout after 24 hours
✅ **Simple Credentials** - Username/password stored in .env

## Configuration

### Enable Authentication

Edit `backend/.env`:

```env
ENABLE_AUTH=true
ADMIN_USERNAME=admin
ADMIN_PASSWORD=pibit2026
JWT_SECRET=your-secret-jwt-key-change-this-in-production
```

### Disable Authentication

Set `ENABLE_AUTH=false` or remove the line entirely.

## Default Credentials

**Username**: `admin`
**Password**: `pibit2026`

**⚠️ IMPORTANT**: Change these in production!

## How It Works

### Public Access (No Login Required)
- `/logos` - View and download logos
- View assets list (read-only)
- View individual assets

### Protected Access (Login Required)
- Create new assets
- Edit existing assets
- Delete assets
- Upload files

### Login Flow
1. User visits protected page (e.g., `/create`)
2. Redirected to `/login` if not authenticated
3. Enter username and password
4. Receive JWT token (stored in localStorage)
5. Token included in all API requests
6. Token valid for 24 hours

## Security Features

- **Password Hashing**: Passwords hashed with bcrypt
- **JWT Tokens**: Secure token-based sessions
- **Token Expiration**: 24-hour automatic logout
- **Protected Routes**: Frontend route protection
- **API Middleware**: Backend endpoint protection

## API Endpoints

### Authentication Endpoints

```
POST /api/auth/login
Body: { "username": "admin", "password": "pibit2026" }
Response: { "success": true, "token": "...", "expiresIn": "24h" }

GET /api/auth/status
Response: { "authEnabled": true, "message": "..." }

GET /api/auth/verify
Headers: Authorization: Bearer <token>
Response: { "valid": true, "user": {...} }
```

### Protected Endpoints (Require Auth Token)

```
POST /api/assets - Create asset
PUT /api/assets/:id - Update asset
DELETE /api/assets/:id - Delete asset
POST /api/upload - Upload file
```

### Public Endpoints (No Auth Required)

```
GET /api/assets - List assets
GET /api/assets/:id - Get asset
GET /api/assets/category/:category - Get by category
GET /api/categories - List categories
GET /api/files/:fileId - Download file
```

## Frontend Components

### AuthContext
Manages authentication state globally:
- `isAuthenticated` - User login status
- `isAuthEnabled` - Whether auth is enabled
- `login(username, password)` - Login function
- `logout()` - Logout function
- `loading` - Loading state

### ProtectedRoute
Wraps routes that require authentication:
```tsx
<Route path="/create" element={
  <ProtectedRoute>
    <CreateAssetPage />
  </ProtectedRoute>
} />
```

### LoginPage
Beautiful login form with PIBIT.AI branding

## Usage Examples

### Enable Auth for Production

```env
ENABLE_AUTH=true
ADMIN_USERNAME=pibit_admin
ADMIN_PASSWORD=SecureP@ssw0rd2026!
JWT_SECRET=random-long-secret-key-min-32-chars
```

### Disable Auth for Development

```env
ENABLE_AUTH=false
```

Or simply comment out:
```env
# ENABLE_AUTH=true
```

## Testing

### Test Login
1. Start backend and frontend
2. Go to `http://localhost:5173`
3. Should redirect to `/login`
4. Enter: `admin` / `pibit2026`
5. Should redirect to home page

### Test Public Access
1. Go to `http://localhost:5173/logos`
2. Should work without login
3. Can view and download logos

### Test Protected Routes
1. Logout (click Logout button)
2. Try to go to `/create`
3. Should redirect to `/login`

## Troubleshooting

### "Unauthorized" errors
- Check `ENABLE_AUTH` is set to `true`
- Verify credentials in `.env`
- Check token in localStorage (browser dev tools)
- Token may have expired (24 hours)

### Can't access anything
- Check if `ENABLE_AUTH=false` to disable auth
- Restart backend after changing `.env`
- Clear browser localStorage

### Login page doesn't appear
- Check frontend is running
- Verify routes in App.tsx
- Check browser console for errors

## Production Recommendations

1. **Strong Password**: Use a strong, unique password
2. **Secret Key**: Generate a random JWT secret (min 32 characters)
3. **HTTPS**: Use HTTPS in production
4. **Environment Variables**: Never commit credentials to git
5. **Regular Updates**: Change password periodically
6. **Token Expiry**: Consider shorter expiry for high-security needs

## Generate Secure JWT Secret

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or online
# https://www.uuidgenerator.net/
```

## Files Created/Modified

### Backend
- `backend/src/services/authService.ts` - Auth logic
- `backend/src/middleware/authMiddleware.ts` - JWT verification
- `backend/src/controllers/authController.ts` - Auth endpoints
- `backend/src/routes/authRoutes.ts` - Auth routes
- `backend/src/routes/assetRoutes.ts` - Added auth middleware
- `backend/src/routes/uploadRoutes.ts` - Added auth middleware
- `backend/src/server.ts` - Added auth routes
- `backend/.env` - Added auth config

### Frontend
- `frontend/src/contexts/AuthContext.tsx` - Auth state management
- `frontend/src/components/ProtectedRoute.tsx` - Route protection
- `frontend/src/pages/LoginPage.tsx` - Login UI
- `frontend/src/styles/LoginPage.css` - Login styling
- `frontend/src/components/Layout.tsx` - Added logout button
- `frontend/src/styles/Layout.css` - Logout button styles
- `frontend/src/services/assetService.ts` - Added auth headers
- `frontend/src/components/FileUpload.tsx` - Added auth headers
- `frontend/src/App.tsx` - Added auth provider and routes

---

**Status**: ✅ Complete and ready to use
**Default**: Authentication enabled with default credentials
**Restart Required**: Yes, restart both backend and frontend
