# Quick Start Guide - Civic Vigilance

## 🚀 Run on Your Phone (Easiest!)

### Step 1: Install Expo Go App
- **Android**: https://play.google.com/store/apps/details?id=host.exp.exponent
- **iOS**: https://apps.apple.com/app/expo-go/id982107779

### Step 2: Start the Development Server

The server is currently running! You should see a QR code in your terminal.

### Step 3: Scan the QR Code
1. Open **Expo Go** app on your phone
2. Tap **"Scan QR Code"**
3. Point your camera at the QR code in the terminal
4. Wait for the app to load (first time takes 1-2 minutes)

**Troubleshooting:**
- Make sure your phone and computer are on the **same WiFi network**
- If QR code doesn't work, you can manually type the URL shown in terminal
- In Expo Go, tap "Enter URL manually" and type: `exp://YOUR_IP:8081`

---

## 🖥️ Run on Android Emulator (WSL/Windows)

### Prerequisites Check

```bash
# Check if Android SDK is installed
ls /mnt/c/Users/adroi/AppData/Local/Android/Sdk

# Check if ADB is available
/mnt/c/Users/adroi/AppData/Local/Android/Sdk/platform-tools/adb.exe devices
```

### Step 1: Launch Android Emulator

```bash
# List available emulators
/mnt/c/Users/adroi/AppData/Local/Android/Sdk/emulator/emulator.exe -list-avds

# Start an emulator (replace EMULATOR_NAME with one from list)
/mnt/c/Users/adroi/AppData/Local/Android/Sdk/emulator/emulator.exe -avd EMULATOR_NAME &
```

### Step 2: Wait for Emulator to Boot (30-60 seconds)

```bash
# Check if emulator is ready
/mnt/c/Users/adroi/AppData/Local/Android/Sdk/platform-tools/adb.exe devices
# Should show: emulator-5554   device
```

### Step 3: Run App on Emulator

In the Expo terminal, press **`a`** to run on Android

**Or manually:**
```bash
npx expo run:android
```

---

## 🌐 Run on Web Browser

```bash
# Open in browser
npm run web

# Or in the Expo terminal, press 'w'
```

Then open: **http://localhost:8081**

---

## 📱 Current Server Status

**Server Running**: ✅ Yes (port 8081)
**Metro Bundler**: Building cache...
**QR Code**: Will appear once bundler is ready

**Wait for this message in terminal:**
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

---

## 🐛 Common Issues

### "Bundler cache is empty, rebuilding"
- **Normal!** First run takes 1-2 minutes
- Just wait for it to finish

### "Package version mismatch warnings"
- **Can ignore for now** - App will still work
- To fix permanently: `npx expo install --fix`

### Phone can't connect via QR code
1. Check same WiFi network
2. Try "Enter URL manually" in Expo Go
3. Use emulator instead

### Emulator doesn't start
1. Make sure Android Studio is installed
2. Check emulator exists: `emulator -list-avds`
3. Try from Windows directly (not WSL)

### Web shows blank screen
1. Press F12 for browser console
2. Check for Firebase initialization message
3. Verify `.env` file has Firebase keys

---

## 📊 What to Expect

### First Launch (Phone/Emulator)
1. **Downloading JavaScript bundle** (30-60s)
2. **Loading Civic Vigilance...** (loading screen)
3. **Login/Sign Up screen** (if Firebase working)

### If You See Errors
- Open browser console (F12)
- Look for red error messages
- Check: `[Firebase] Successfully initialized` message

---

## 🎯 Test Checklist

Once app loads:

- [ ] See login screen
- [ ] Can create account (email + password)
- [ ] Can sign in
- [ ] Firebase console shows user created
- [ ] No red errors in console

---

## 💡 Pro Tips

### Faster Development
```bash
# Start with tunnel (works without same WiFi)
npx expo start --tunnel

# Start specific platform
npx expo start --android  # Android only
npx expo start --ios      # iOS only (Mac only)
npx expo start --web      # Web only
```

### Debug Mode
```bash
# Show QR code in terminal (if hidden)
Press 'q' in Expo terminal

# Reload app
Press 'r' in Expo terminal

# Clear cache and restart
npx expo start --clear
```

### WSL-Specific (Your Setup)
```bash
# Access from Windows browser
http://localhost:8081

# Run Android emulator from Windows
# Use Windows Command Prompt or PowerShell, not WSL
```

---

## 🔗 Useful Links

- **Expo Go**: https://expo.dev/client
- **Expo Docs**: https://docs.expo.dev/
- **Firebase Console**: https://console.firebase.google.com/project/civic-vigilance
- **Troubleshooting**: https://docs.expo.dev/troubleshooting/

---

**Current Status**: Waiting for Metro bundler to finish building cache...

Check terminal for QR code!
