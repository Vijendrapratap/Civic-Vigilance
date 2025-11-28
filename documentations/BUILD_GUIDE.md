# 📱 Civic Vigilance - Build Guide

Complete guide to building and sharing the Civic Vigilance Android app.

---

## 🎯 Quick Start - Recommended Options

### **Option 1: EAS Build (Cloud) - EASIEST** ⭐

Build your APK in the cloud without needing Android SDK or Java locally.

```bash
# 1. Login to Expo (creates free account if needed)
npx eas-cli login

# 2. Configure the project (first time only)
npx eas-cli build:configure

# 3. Build the APK
npx eas-cli build --platform android --profile preview

# 4. Wait 10-15 minutes for build to complete
# You'll get a download link for the APK!
```

**Advantages:**
- ✅ No local setup needed
- ✅ Professional build environment
- ✅ Get shareable download link
- ✅ Build logs saved online
- ✅ Free tier available

---

### **Option 2: Local Build with Java**

Build the APK locally on your machine.

#### **Step 1: Install Java 17**

```bash
# Install OpenJDK 17 (required for Android builds)
sudo apt-get update
sudo apt-get install -y openjdk-17-jdk

# Verify installation
java -version
# Should show: openjdk version "17.x.x"
```

#### **Step 2: Set Environment Variables**

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$PATH:$JAVA_HOME/bin
```

Then reload:
```bash
source ~/.bashrc  # or source ~/.zshrc
```

#### **Step 3: Build the APK**

```bash
# Navigate to project root
cd /home/pratap/work/CivicVigilance

# Build debug APK
cd android && ./gradlew assembleDebug

# Build release APK (production-ready)
cd android && ./gradlew assembleRelease
```

#### **Step 4: Find Your APK**

```bash
# Debug APK (for testing)
android/app/build/outputs/apk/debug/app-debug.apk

# Release APK (for distribution)
android/app/build/outputs/apk/release/app-release.apk
```

---

### **Option 3: Expo Development Build**

Create a development build for testing.

```bash
# Install on connected device
npx expo run:android

# Build without installing
npx expo run:android --no-install

# APK will be at:
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📤 Sharing Your APK with Friends

### **Method 1: Direct File Sharing**

1. **Find the APK:**
   ```bash
   ls -lh android/app/build/outputs/apk/debug/app-debug.apk
   ```

2. **Transfer to your phone:**
   ```bash
   # If using Windows with WSL
   cp android/app/build/outputs/apk/debug/app-debug.apk /mnt/c/Users/YOUR_USERNAME/Downloads/
   ```

3. **Share via:**
   - Google Drive / Dropbox
   - WhatsApp / Telegram
   - Email
   - USB transfer

### **Method 2: Upload to Distribution Service**

**Using Firebase App Distribution (Free):**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize App Distribution
firebase init appdistribution

# Upload APK
firebase appdistribution:distribute \
  android/app/build/outputs/apk/debug/app-debug.apk \
  --app YOUR_FIREBASE_APP_ID \
  --groups testers
```

**Using Diawi (Free, no signup):**

1. Go to https://www.diawi.com/
2. Upload your APK
3. Get shareable link
4. Send link to friends

### **Method 3: EAS Build Link**

If you used EAS Build (Option 1), you get:
- Direct download link
- QR code for easy install
- Build expires after 30 days (renew for free)

---

## 📋 What Your Friends Need to Do

### **Installing the APK:**

1. **Enable Unknown Sources:**
   - Settings → Security → Unknown Sources → Enable
   - Or Settings → Apps → Special Access → Install Unknown Apps → Enable for Chrome/File Manager

2. **Download & Install:**
   - Download the APK you shared
   - Tap on the file
   - Click "Install"

3. **Grant Permissions:**
   - Camera (for capturing issues)
   - Location (for GPS tagging)
   - Storage (for photos)

---

## 🏗️ Build Configurations

Your project has 3 build profiles (configured in `eas.json`):

### **1. Development** (`--profile development`)
- Development client with debugging
- Hot reload enabled
- Larger file size (~80MB)
- Use for: Active development

### **2. Preview** (`--profile preview`) ⭐ **RECOMMENDED FOR SHARING**
- Production-like build
- No debugging overhead
- Optimized size (~30MB)
- Use for: Testing with friends, beta testing

### **3. Production** (`--profile production`)
- Store-ready build (AAB format)
- Fully optimized
- Smallest size (~25MB)
- Use for: Play Store submission

---

## 🔧 Build Commands Reference

```bash
# EAS Cloud Build
npx eas-cli build --platform android --profile preview

# Local Gradle Build
cd android && ./gradlew assembleDebug          # Debug
cd android && ./gradlew assembleRelease        # Release

# Expo CLI Build
npx expo run:android                           # Debug
npx expo run:android --variant release         # Release

# Clean build (if errors occur)
cd android && ./gradlew clean
rm -rf android/build android/app/build
cd android && ./gradlew assembleDebug
```

---

## 🐛 Troubleshooting

### **Error: JAVA_HOME not set**
```bash
# Find Java installation
sudo update-alternatives --config java
# Copy path and set JAVA_HOME
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

### **Error: Android SDK not found**
```bash
# Set ANDROID_HOME
export ANDROID_HOME=/mnt/c/Users/YOUR_USERNAME/AppData/Local/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator
```

### **Error: Build failed - Out of memory**
```bash
# Increase Gradle memory
echo "org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=512m" >> android/gradle.properties
```

### **Error: Keystore not found (for release builds)**
```bash
# Generate keystore
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore \
  -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

---

## 📊 Current Configuration

**Project:** Civic Vigilance
**Package:** com.anonymous.civicvigilance
**Version:** 0.1.0
**Min Android:** API 24 (Android 7.0)
**Target Android:** API 34 (Android 14)

**Environment:**
- ✅ Supabase configured
- ✅ Google Maps API configured
- ✅ Twitter OAuth configured
- ✅ All environment variables set

**Build Size Estimates:**
- Debug APK: ~50-80MB
- Release APK: ~25-35MB
- AAB (Play Store): ~20-25MB

---

## 🚀 Next Steps

1. **Choose your build method** (EAS Cloud recommended)
2. **Build the APK** using commands above
3. **Test on your device** first
4. **Share with friends** using any method above
5. **Collect feedback** and iterate

---

## 📞 Need Help?

**Common Issues:**
- Build errors → Check Troubleshooting section
- APK not installing → Check if Unknown Sources enabled
- App crashes → Check logs with `adb logcat`

**Useful Links:**
- EAS Build Docs: https://docs.expo.dev/build/introduction/
- Android Studio: https://developer.android.com/studio
- Expo Forums: https://forums.expo.dev/

---

**Generated:** 2025-11-28
**Status:** ✅ Ready to build!
