# 🔥 Enable Firebase Backend - Complete Guide

This guide will help you enable Firebase services for your Civic Vigilance app.

---

## 📋 Prerequisites

- ✅ Firebase project created: `civic-vigilance`
- ✅ Firebase configuration in `.env` file
- ✅ Firebase CLI installed (done!)

---

## 🚀 Method 1: Manual Setup (Recommended for First-Time)

Follow these steps in the Firebase Console:

### Step 1: Enable Email/Password Authentication ⚡ **REQUIRED**

**This fixes the `auth/configuration-not-found` error!**

1. Open: https://console.firebase.google.com/project/civic-vigilance/authentication/providers
2. Click on **Email/Password** provider
3. Toggle **Enable** to ON
4. Click **Save**

**✅ Status:** Authentication enabled!

---

### Step 2: Create Firestore Database 🗄️ **REQUIRED**

1. Open: https://console.firebase.google.com/project/civic-vigilance/firestore
2. Click **Create database**
3. Select **Start in test mode** (we'll deploy proper rules later)
4. Choose location: `us-central1` (or your preferred region)
   - ⚠️ **Cannot be changed later!**
5. Click **Enable**
6. Wait 1-2 minutes for provisioning

**✅ Status:** Firestore created!

---

### Step 3: Create Storage Bucket 📦 **REQUIRED**

1. Open: https://console.firebase.google.com/project/civic-vigilance/storage
2. Click **Get started**
3. Select **Start in test mode**
4. Choose **same location** as Firestore
5. Click **Done**

**✅ Status:** Storage enabled!

---

### Step 4: Deploy Security Rules 🔒 **IMPORTANT**

Now that the services are created, deploy the security rules:

```bash
# Make the script executable (already done)
chmod +x deploy-firebase.sh

# Run the deployment script
./deploy-firebase.sh
```

**Or manually:**

```bash
# Login to Firebase (if not already)
firebase login

# Deploy all rules and indexes
firebase deploy --only firestore:rules,firestore:indexes,storage --project civic-vigilance
```

**✅ Status:** Security rules deployed!

---

## 🤖 Method 2: Automated Setup (After Manual Steps 1-3)

After you've **manually** enabled Authentication, Firestore, and Storage in the console:

```bash
# Deploy everything automatically
./deploy-firebase.sh
```

Select option **4** (All of the above) to deploy:
- Firestore security rules
- Firestore indexes
- Storage security rules

---

## ✅ Verification

After completing all steps:

### 1. Check Firebase Console

Visit each service and verify:

- **Authentication**: https://console.firebase.google.com/project/civic-vigilance/authentication
  - [ ] Email/Password provider shows "Enabled"

- **Firestore**: https://console.firebase.google.com/project/civic-vigilance/firestore
  - [ ] Database is created
  - [ ] Rules are deployed (check Rules tab)

- **Storage**: https://console.firebase.google.com/project/civic-vigilance/storage
  - [ ] Bucket is created
  - [ ] Rules are deployed (check Rules tab)

### 2. Test the App

```bash
# Restart the dev server
npm start
```

Then try:

1. **Sign Up**
   - Open the app
   - Click "Don't have an account? Sign up"
   - Enter email and password
   - Submit

   **Expected:** Account created successfully!

2. **Check Firestore**
   - Go to Firestore Database in console
   - You should see a `users` collection with your profile

3. **Create a Report**
   - Click the camera/report button
   - Fill in details
   - Upload a photo
   - Submit

   **Expected:** Report created successfully!

4. **Check Storage**
   - Go to Storage in console
   - You should see uploaded images

---

## 🐛 Troubleshooting

### Error: "auth/configuration-not-found"
**Solution:** Enable Email/Password in Authentication (Step 1)

### Error: "Missing or insufficient permissions"
**Solution:** Deploy Firestore rules (Step 4)
```bash
firebase deploy --only firestore:rules --project civic-vigilance
```

### Error: "Permission denied" on Storage
**Solution:** Deploy Storage rules (Step 4)
```bash
firebase deploy --only storage --project civic-vigilance
```

### Error: "Firebase not initialized"
**Solution:** Check `.env` file has all Firebase config values

### Error: "Project not found"
**Solution:** Make sure you're logged into Firebase CLI
```bash
firebase login
firebase projects:list
```

---

## 📝 What Each File Does

- **`firebase.json`**: Firebase project configuration
- **`docs/firestore.rules`**: Firestore security rules
- **`firestore.indexes.json`**: Database indexes for query performance
- **`storage.rules`**: Storage security rules
- **`deploy-firebase.sh`**: Automated deployment script

---

## 🔐 Security Rules Summary

### Firestore Rules
- ✅ Anyone can **read** reports (public browsing)
- ✅ Authenticated users can **create** reports
- ✅ Users can **update** their own reports
- ✅ Users can **comment** and **vote**
- ❌ Only admins can **delete**

### Storage Rules
- ✅ Anyone can **read** images
- ✅ Authenticated users can **upload** images (max 10MB)
- ✅ Users can only **modify** their own avatars (max 5MB)
- ❌ All files must be images

---

## 🎯 Next Steps

After Firebase is enabled:

1. **Test all features:**
   - User registration and login
   - Creating reports with photos
   - Commenting and voting
   - Profile updates

2. **Set up Firebase Cloud Functions** (optional):
   - Automated Twitter posting
   - Notification triggers
   - Authority tagging

3. **Enable Firebase Analytics** (optional):
   - Track user engagement
   - Monitor report submissions
   - Analyze popular issues

4. **Production checklist:**
   - [ ] Review and test all security rules
   - [ ] Set up Firebase App Check
   - [ ] Enable backup for Firestore
   - [ ] Set up monitoring and alerts
   - [ ] Review Firebase billing limits

---

## 📚 Resources

- **Firebase Console:** https://console.firebase.google.com/project/civic-vigilance
- **Firebase Documentation:** https://firebase.google.com/docs
- **Firestore Rules Guide:** https://firebase.google.com/docs/firestore/security/get-started
- **Storage Rules Guide:** https://firebase.google.com/docs/storage/security

---

## 🆘 Need Help?

1. Check the Firebase Console for error messages
2. Review browser console (F12) for client-side errors
3. Check Expo dev server logs for backend errors
4. See `FIREBASE_QUICK_SETUP.md` for quick reference
5. See `FIREBASE_BACKEND_SETUP.md` for detailed instructions

---

**Estimated Setup Time:** 10-15 minutes

Good luck! 🚀
