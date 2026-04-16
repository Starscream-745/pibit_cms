# 🌐 Make CMS Available on Local Network (LAN)

## 🎯 Goal
Make your PIBIT.AI CMS accessible to anyone on your local network (office, home WiFi, etc.)

---

## 📋 Prerequisites

1. ✅ MongoDB is running
2. ✅ Backend and Frontend work on your computer
3. ✅ You're connected to a network (WiFi or Ethernet)

---

## 🚀 Step-by-Step Setup

### **Step 1: Find Your Local IP Address**

#### **Windows:**
Open Command Prompt and run:
```cmd
ipconfig
```

Look for **IPv4 Address** under your active network adapter:
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.100
```

**Your IP will be something like:**
- `192.168.1.100`
- `192.168.0.50`
- `10.0.0.25`

**Write this down - you'll need it!**

---

### **Step 2: Configure Backend for LAN Access**

#### **2.1: Update Backend .env File**

Navigate to `backend/.env` and update:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL=mongodb://localhost:27017/pibit-cms

# CORS Configuration - IMPORTANT!
CORS_ORIGIN=*

# Base URL - Replace with YOUR IP address
BASE_URL=http://192.168.1.100:3000

# Authentication
ENABLE_AUTH=true
ADMIN_USERNAME=admin
ADMIN_PASSWORD=pibit2026
USER_USERNAME=user
USER_PASSWORD=user123
JWT_SECRET=pibit-cms-secret-key
```

**Replace `192.168.1.100` with YOUR actual IP address from Step 1!**

#### **2.2: Start Backend**

```cmd
cd backend
npm run dev
```

You should see:
```
✓ MongoDB connected successfully
✓ Server running on port 3000
✓ CORS enabled for: *
```

---

### **Step 3: Configure Frontend for LAN Access**

#### **3.1: Update Frontend .env File**

Navigate to `frontend/.env` and update:

```env
# API URL - Replace with YOUR IP address
VITE_API_URL=http://192.168.1.100:3000
```

**Replace `192.168.1.100` with YOUR actual IP address!**

#### **3.2: Configure Vite for Network Access**

Open `frontend/vite.config.ts` and update:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Listen on all network interfaces
    port: 5173,
    strictPort: true,
  }
})
```

#### **3.3: Start Frontend**

```cmd
cd frontend
npm run dev
```

You should see:
```
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/
```

---

### **Step 4: Configure Windows Firewall**

Windows Firewall might block incoming connections. You need to allow ports 3000 and 5173.

#### **Option A: Using Command Prompt (Recommended)**

Open **Command Prompt as Administrator** and run:

```cmd
netsh advfirewall firewall add rule name="PIBIT CMS Backend" dir=in action=allow protocol=TCP localport=3000

netsh advfirewall firewall add rule name="PIBIT CMS Frontend" dir=in action=allow protocol=TCP localport=5173
```

#### **Option B: Using Windows Firewall GUI**

1. Open **Windows Defender Firewall**
2. Click **Advanced settings**
3. Click **Inbound Rules** → **New Rule**
4. Select **Port** → Next
5. Select **TCP** and enter port `3000` → Next
6. Select **Allow the connection** → Next
7. Check all profiles → Next
8. Name it "PIBIT CMS Backend" → Finish
9. **Repeat for port `5173`** (Frontend)

---

### **Step 5: Test Access**

#### **From Your Computer:**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

#### **From Other Devices on Network:**
- Frontend: `http://192.168.1.100:5173`
- Backend: `http://192.168.1.100:3000`

**Replace `192.168.1.100` with YOUR IP address!**

---

## 📱 Access from Other Devices

### **Desktop/Laptop:**
1. Open any web browser
2. Go to: `http://192.168.1.100:5173`
3. You should see the PIBIT.AI CMS login page

### **Mobile Phone/Tablet:**
1. Connect to the **same WiFi network**
2. Open browser (Chrome, Safari, etc.)
3. Go to: `http://192.168.1.100:5173`
4. Use the CMS on mobile!

### **Test Backend API:**
Open browser and go to:
```
http://192.168.1.100:3000/api/auth/status
```

You should see:
```json
{
  "authEnabled": true,
  "message": "Authentication is enabled"
}
```

---

## 🔒 Security Considerations

### **1. Network Security:**
- ✅ Only accessible on your local network
- ✅ Not accessible from the internet
- ✅ Firewall protects from external access

### **2. Authentication:**
- ✅ Login required for admin functions
- ✅ User role for view-only access
- ✅ JWT tokens for session management

### **3. Change Default Passwords:**

Update `backend/.env`:
```env
ADMIN_PASSWORD=YourStrongPassword123!
USER_PASSWORD=AnotherStrongPassword456!
```

---

## 📊 Network Configuration Summary

| Component | Port | Access URL |
|-----------|------|------------|
| Frontend | 5173 | `http://YOUR_IP:5173` |
| Backend API | 3000 | `http://YOUR_IP:3000` |
| MongoDB | 27017 | `localhost:27017` (internal only) |

---

## 🛠️ Troubleshooting

### **Issue 1: Cannot Access from Other Devices**

**Check 1: Firewall**
```cmd
netsh advfirewall firewall show rule name="PIBIT CMS Backend"
netsh advfirewall firewall show rule name="PIBIT CMS Frontend"
```

**Check 2: Backend is listening on all interfaces**
```cmd
netstat -an | findstr "3000"
```
Should show: `0.0.0.0:3000` (not `127.0.0.1:3000`)

**Check 3: Frontend is accessible**
```cmd
netstat -an | findstr "5173"
```

**Check 4: Same Network**
- Make sure all devices are on the same WiFi/network
- Check IP range (should be similar: 192.168.1.x)

### **Issue 2: CORS Errors**

Make sure `backend/.env` has:
```env
CORS_ORIGIN=*
```

Restart backend after changing.

### **Issue 3: API Calls Failing**

Check `frontend/.env`:
```env
VITE_API_URL=http://YOUR_IP:3000
```

**Important:** After changing `.env`, restart frontend:
```cmd
cd frontend
npm run dev
```

### **Issue 4: IP Address Changed**

If your computer's IP changes (common with DHCP):

1. Find new IP: `ipconfig`
2. Update `backend/.env` → `BASE_URL`
3. Update `frontend/.env` → `VITE_API_URL`
4. Restart both servers

---

## 💡 Pro Tips

### **1. Static IP Address (Recommended)**

Set a static IP for your computer so it doesn't change:

1. Open **Network Connections**
2. Right-click your network adapter → **Properties**
3. Select **Internet Protocol Version 4 (TCP/IPv4)** → **Properties**
4. Select **Use the following IP address**
5. Enter:
   - IP address: `192.168.1.100` (or your preferred IP)
   - Subnet mask: `255.255.255.0`
   - Default gateway: `192.168.1.1` (your router IP)
   - DNS: `8.8.8.8` (Google DNS)

### **2. Create Desktop Shortcuts**

Create shortcuts for team members:
- Right-click Desktop → New → Shortcut
- Enter: `http://192.168.1.100:5173`
- Name: "PIBIT.AI CMS"

### **3. QR Code for Mobile Access**

Generate a QR code for `http://192.168.1.100:5173` so mobile users can scan and access easily.

### **4. Bookmark the URL**

Tell users to bookmark the URL for easy access.

---

## 📝 Quick Start Commands

### **Start Everything:**

```cmd
# Terminal 1: Start MongoDB
net start MongoDB

# Terminal 2: Start Backend
cd backend
npm run dev

# Terminal 3: Start Frontend
cd frontend
npm run dev
```

### **Share with Team:**

**Tell them to visit:**
```
http://YOUR_IP:5173
```

**Login Credentials:**
- **Admin**: username: `admin`, password: `pibit2026`
- **User**: username: `user`, password: `user123`

---

## 🌟 What Users Can Do

### **From Any Device on Network:**

1. ✅ **View Assets** - Browse all digital assets
2. ✅ **Download Files** - Download images, videos, documents
3. ✅ **Search & Filter** - Find assets quickly
4. ✅ **View Logos** - Access brand logos
5. ✅ **View Brand Guidelines** - See brand standards
6. ✅ **Admin Functions** (Admin only):
   - Upload new assets
   - Edit existing assets
   - Delete assets
   - Organize categories

---

## 🎯 Example Scenario

**Your Setup:**
- Your Computer IP: `192.168.1.100`
- Backend running on port `3000`
- Frontend running on port `5173`

**Team Member Access:**
1. Connects to office WiFi
2. Opens browser
3. Goes to: `http://192.168.1.100:5173`
4. Logs in as User or Admin
5. Can now use the CMS!

---

## ✅ Verification Checklist

Before sharing with team:

- [ ] MongoDB is running
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] You can access frontend on `http://localhost:5173`
- [ ] You can access frontend on `http://YOUR_IP:5173`
- [ ] Firewall rules are added
- [ ] CORS is set to `*` in backend
- [ ] API URL is set correctly in frontend
- [ ] You can login and see assets
- [ ] Another device can access the URL
- [ ] Assets load correctly from other devices

---

## 🚀 You're Ready!

Your PIBIT.AI CMS is now accessible to everyone on your local network!

**Share this URL with your team:**
```
http://YOUR_IP:5173
```

**They can access it from:**
- 💻 Desktop computers
- 💻 Laptops
- 📱 Mobile phones
- 📱 Tablets

**All on the same network!** 🎉
