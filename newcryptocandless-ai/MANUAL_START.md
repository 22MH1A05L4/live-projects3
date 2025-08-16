# 🚀 Manual Startup Guide (PowerShell)

## ✅ **QUICK START - 3 SIMPLE STEPS:**

### **Step 1: Start Backend Server**
Open a new PowerShell window and run:
```powershell
cd C:\cryptocandless-ai\server
npm install
npm start
```
Wait until you see: `🚀 Server running on port 5000`

### **Step 2: Start Frontend Client**
Open another PowerShell window and run:
```powershell
cd C:\cryptocandless-ai\client
npm install
npm start
```
Wait until you see: `Local: http://localhost:3000`

### **Step 3: Open Browser**
Open http://localhost:3000 in your browser

---

## 🔧 **IF YOU GET ERRORS:**

### **Error: "npm is not recognized"**
- Install Node.js from: https://nodejs.org/
- Restart PowerShell after installation

### **Error: "Cannot find module"**
- Make sure you're in the correct directory
- Run `npm install` first

### **Error: "Port already in use"**
- Close other applications using ports 3000 or 5000
- Or kill the process: `netstat -ano | findstr :5000`

### **Error: "Permission denied"**
- Run PowerShell as Administrator
- Or check if antivirus is blocking the connection

---

## 📱 **TEST THE APPLICATION:**

1. **Search for stocks**: Type "AAPL" and click search
2. **Search for crypto**: Type "BTC" and click search  
3. **View charts**: Click on search results
4. **AI Analysis**: Click "Analyze" button

---

## 🎯 **EXPECTED OUTPUT:**

- **Backend**: `🚀 Server running on port 5000`
- **Frontend**: `Local: http://localhost:3000`
- **Browser**: Professional trading interface like TradingView

---

## 🚨 **STILL HAVING ISSUES?**

1. Check if Node.js is installed: `node --version`
2. Check if npm is installed: `npm --version`
3. Make sure you're in the right directory
4. Try running PowerShell as Administrator
5. Check Windows Firewall settings

---

**🎉 Your project should work perfectly now!**


