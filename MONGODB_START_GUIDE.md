# 🔧 MongoDB Not Running - Quick Fix Guide

## ❌ Problem
The backend server cannot start because MongoDB is not running:
```
❌ MongoDB connection error: connect ECONNREFUSED ::1:27017
```

## ✅ Solution

### **Step 1: Start MongoDB**

You have MongoDB 8.2 installed. You need to start the MongoDB service.

#### **Option A: Start MongoDB as Windows Service**

Open **Command Prompt as Administrator** and run:
```cmd
net start MongoDB
```

Or using PowerShell as Administrator:
```powershell
Start-Service MongoDB
```

#### **Option B: Start MongoDB Manually**

If MongoDB is not installed as a service, navigate to your MongoDB installation directory and run:
```cmd
"C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\data\db"
```

**Note:** Make sure the `C:\data\db` directory exists. If not, create it:
```cmd
mkdir C:\data\db
```

### **Step 2: Verify MongoDB is Running**

Open a new terminal and run:
```cmd
mongosh
```

If you see the MongoDB shell prompt, MongoDB is running successfully!

### **Step 3: Restart Backend Server**

Once MongoDB is running, the backend should automatically reconnect (if using `npm run dev`).

If not, restart it:
```cmd
cd backend
npm run dev
```

You should see:
```
✓ MongoDB connected successfully
✓ GridFS bucket initialized
✓ Server running on port 3000
```

---

## 🔍 Check MongoDB Status

### **Windows:**
```cmd
sc query MongoDB
```

### **Check if MongoDB is listening on port 27017:**
```cmd
netstat -an | findstr "27017"
```

You should see:
```
TCP    0.0.0.0:27017    0.0.0.0:0    LISTENING
```

---

## 🚀 Quick Start Commands

### **1. Start MongoDB:**
```cmd
net start MongoDB
```

### **2. Start Backend:**
```cmd
cd backend
npm run dev
```

### **3. Start Frontend:**
```cmd
cd frontend
npm run dev
```

---

## 🛠️ MongoDB Compass

You mentioned using MongoDB Compass. Make sure:
1. MongoDB Compass is connected to `mongodb://localhost:27017`
2. You can see the `pibit-cms` database
3. The connection shows as "Connected"

If Compass cannot connect, MongoDB service is not running.

---

## 📝 Common Issues

### **Issue 1: MongoDB Service Not Installed**

If you get "service not found", MongoDB might not be installed as a service.

**Solution:** Install MongoDB as a service:
```cmd
"C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --install --serviceName MongoDB --dbpath "C:\data\db"
```

### **Issue 2: Port 27017 Already in Use**

If another process is using port 27017:

**Check what's using the port:**
```cmd
netstat -ano | findstr "27017"
```

**Kill the process (replace PID with actual process ID):**
```cmd
taskkill /PID <PID> /F
```

### **Issue 3: Data Directory Doesn't Exist**

Create the data directory:
```cmd
mkdir C:\data\db
```

---

## ✅ Verification Checklist

After starting MongoDB, verify:

- [ ] MongoDB service is running: `sc query MongoDB`
- [ ] Port 27017 is listening: `netstat -an | findstr "27017"`
- [ ] MongoDB Compass can connect
- [ ] Backend starts without errors
- [ ] You see "✓ MongoDB connected successfully"

---

## 🎯 Expected Backend Output

When everything is working, you should see:
```
> pibit-cms-backend@1.0.0 dev
> tsx watch src/server.ts

✓ MongoDB connected successfully
✓ GridFS bucket initialized
✓ Server running on port 3000
✓ CORS enabled for: *
```

---

## 💡 Pro Tip

**Set MongoDB to start automatically on Windows boot:**

1. Open Services (Win + R, type `services.msc`)
2. Find "MongoDB" service
3. Right-click → Properties
4. Set "Startup type" to "Automatic"
5. Click "Apply" and "OK"

Now MongoDB will start automatically when you boot your computer!

---

## 🆘 Still Having Issues?

If MongoDB still won't start:

1. **Check MongoDB logs:**
   - Location: `C:\Program Files\MongoDB\Server\8.2\log\mongod.log`
   - Look for error messages

2. **Reinstall MongoDB:**
   - Download from: https://www.mongodb.com/try/download/community
   - Choose Windows version
   - Install with default settings
   - Select "Install MongoDB as a Service"

3. **Check firewall:**
   - Make sure Windows Firewall isn't blocking port 27017

---

## 📞 Quick Commands Summary

```cmd
# Start MongoDB
net start MongoDB

# Stop MongoDB
net stop MongoDB

# Check MongoDB status
sc query MongoDB

# Connect with MongoDB Shell
mongosh

# Start Backend
cd backend
npm run dev

# Start Frontend
cd frontend
npm run dev
```

---

**Once MongoDB is running, your backend will work perfectly!** 🚀
