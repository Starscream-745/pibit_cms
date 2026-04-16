# ⚡ Quick LAN Setup - 5 Minutes

## Step 1: Find Your IP Address
```cmd
ipconfig
```
Look for **IPv4 Address**: `192.168.1.100` (example)

---

## Step 2: Update Backend .env

File: `backend/.env`
```env
PORT=3000
DATABASE_URL=mongodb://localhost:27017/pibit-cms
CORS_ORIGIN=*
BASE_URL=http://192.168.1.100:3000

ENABLE_AUTH=true
ADMIN_USERNAME=admin
ADMIN_PASSWORD=pibit2026
USER_USERNAME=user
USER_PASSWORD=user123
JWT_SECRET=pibit-cms-secret-key
```
**Replace `192.168.1.100` with YOUR IP!**

---

## Step 3: Update Frontend .env

File: `frontend/.env`
```env
VITE_API_URL=http://192.168.1.100:3000
```
**Replace `192.168.1.100` with YOUR IP!**

---

## Step 4: Update Vite Config

File: `frontend/vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  }
})
```

---

## Step 5: Open Firewall Ports

**Run as Administrator:**
```cmd
netsh advfirewall firewall add rule name="PIBIT CMS Backend" dir=in action=allow protocol=TCP localport=3000

netsh advfirewall firewall add rule name="PIBIT CMS Frontend" dir=in action=allow protocol=TCP localport=5173
```

---

## Step 6: Start Everything

**Terminal 1:**
```cmd
net start MongoDB
```

**Terminal 2:**
```cmd
cd backend
npm run dev
```

**Terminal 3:**
```cmd
cd frontend
npm run dev
```

---

## ✅ Done!

**Share this URL with your team:**
```
http://YOUR_IP:5173
```

**Example:** `http://192.168.1.100:5173`

---

## 🔑 Login Credentials

**Admin (Full Access):**
- Username: `admin`
- Password: `pibit2026`

**User (View Only):**
- Username: `user`
- Password: `user123`

---

## 🧪 Test It

1. Open browser on another device
2. Go to: `http://YOUR_IP:5173`
3. You should see the login page
4. Login and use the CMS!

---

**That's it! Your CMS is now available on the network!** 🎉
