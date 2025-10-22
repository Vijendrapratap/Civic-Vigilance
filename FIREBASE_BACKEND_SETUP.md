# Firebase Backend Setup Guide

## Overview
This guide will help you enable and configure Firebase services for the Civic Vigilance app.

**Project ID:** `civic-vigilance`
**Console URL:** https://console.firebase.google.com/project/civic-vigilance

---

## Step 1: Enable Firebase Authentication (REQUIRED)

### Why This is Needed
The error `Firebase: Error (auth/configuration-not-found)` occurs because Email/Password authentication is not enabled in your Firebase project.

### Instructions

1. **Open Firebase Console**
   - Go to: https://console.firebase.google.com/project/civic-vigilance/authentication/providers

2. **Navigate to Authentication**
   - Click **Authentication** in the left sidebar
   - Click the **Sign-in method** tab at the top

3. **Enable Email/Password Provider**
   - Find **Email/Password** in the list of sign-in providers
   - Click on it
   - Toggle **Enable** to ON
   - ✅ Check "Email/Password" (first option)
   - ❌ Leave "Email link (passwordless sign-in)" unchecked for now
   - Click **Save**

4. **Verify**
   - You should see "Email/Password" status change to "Enabled"

---

## Step 2: Set Up Firestore Database (REQUIRED)

### Why This is Needed
Firestore stores all civic reports, comments, votes, and user profiles.

### Instructions

1. **Navigate to Firestore**
   - Go to: https://console.firebase.google.com/project/civic-vigilance/firestore
   - Or click **Firestore Database** in the left sidebar

2. **Create Database**
   - Click **Create database** button

3. **Choose Mode**
   - Select **Start in test mode** (for development)
   - Note: We'll update security rules later
   - Click **Next**

4. **Choose Location**
   - Select a location close to your users
   - Recommended: `us-central1` or your nearest region
   - ⚠️ **This cannot be changed later!**
   - Click **Enable**

5. **Wait for Provisioning**
   - This may take 1-2 minutes
   - You'll see "Provisioning Cloud Firestore..."

### Set Up Security Rules

Once created, update the rules:

1. Click the **Rules** tab
2. Replace with the following rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // Issues/Reports collection
    match /issues/{issueId} {
      allow read: if true; // Public read
      allow create: if isSignedIn();
      allow update, delete: if isSignedIn() && isOwner(resource.data.user_id);
    }

    // Comments collection
    match /comments/{commentId} {
      allow read: if true; // Public read
      allow create: if isSignedIn();
      allow update, delete: if isSignedIn() && isOwner(resource.data.userId);
    }

    // Votes collection
    match /issue_votes/{voteId} {
      allow read: if isSignedIn();
      allow write: if isSignedIn() && isOwner(request.resource.data.user_id);
    }

    // User profiles
    match /profiles/{userId} {
      allow read: if true; // Public profiles
      allow write: if isSignedIn() && isOwner(userId);
    }
  }
}
```

3. Click **Publish**

---

## Step 3: Set Up Firebase Storage (REQUIRED)

### Why This is Needed
Storage is used for uploading photos of civic issues.

### Instructions

1. **Navigate to Storage**
   - Go to: https://console.firebase.google.com/project/civic-vigilance/storage
   - Or click **Storage** in the left sidebar

2. **Get Started**
   - Click **Get started** button

3. **Security Rules**
   - Select **Start in test mode**
   - Click **Next**

4. **Choose Location**
   - Use the **same location** as your Firestore database
   - Click **Done**

### Update Storage Rules

1. Click the **Rules** tab
2. Replace with the following rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload images
    match /issue-images/{imageId} {
      allow read: if true; // Public read
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024  // Max 5MB
                   && request.resource.contentType.matches('image/.*');  // Images only
    }

    // User avatars
    match /avatars/{userId}.jpg {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.uid == userId
                   && request.resource.size < 2 * 1024 * 1024; // Max 2MB
    }
  }
}
```

3. Click **Publish**

---

## Step 4: Configure Authorized Domains (OPTIONAL)

### Instructions

1. **Navigate to Authentication Settings**
   - Go to: https://console.firebase.google.com/project/civic-vigilance/authentication/settings
   - Or: Authentication → Settings tab

2. **Add Authorized Domains**
   - Scroll to **Authorized domains** section
   - These should already be there:
     - `localhost` ✅
     - `civic-vigilance.firebaseapp.com` ✅
   - If not, add them

---

## Step 5: Create Initial Firestore Indexes (OPTIONAL but RECOMMENDED)

For better query performance, create these indexes:

1. **Navigate to Firestore Indexes**
   - Go to: https://console.firebase.google.com/project/civic-vigilance/firestore/indexes

2. **Add Composite Indexes**

   **For Issues (sorted by date):**
   - Collection: `issues`
   - Fields:
     - `created_at` (Descending)

   **For Issues (sorted by score):**
   - Collection: `issues`
   - Fields:
     - `score` (Descending)
     - `created_at` (Descending)

   **For Comments:**
   - Collection: `comments`
   - Fields:
     - `reportId` (Ascending)
     - `createdAt` (Ascending)

---

## Verification Steps

After completing the setup, verify everything works:

### 1. Check Firebase Console

- [ ] Authentication → Email/Password is **Enabled**
- [ ] Firestore Database shows **active database**
- [ ] Storage shows **default bucket created**
- [ ] All services show in **green/active** status

### 2. Test the App

1. **Restart your Expo dev server:**
   ```bash
   # Press Ctrl+C to stop
   npm start
   ```

2. **Open the app** in your browser or emulator

3. **Try to sign up:**
   - Click "Don't have an account? Sign up"
   - Enter email and password
   - Submit
   - You should be able to create an account!

4. **Check Firestore:**
   - Go to Firestore Database
   - You should see a `profiles` collection with your user

---

## Troubleshooting

### Error: "auth/configuration-not-found"
- ✅ Make sure Email/Password is enabled in Authentication
- ✅ Verify your Firebase config in `.env` matches the console

### Error: "Missing or insufficient permissions"
- ✅ Update Firestore security rules (see Step 2)
- ✅ Make sure you're signed in when creating reports

### Error: "Permission denied" on Storage
- ✅ Update Storage security rules (see Step 3)
- ✅ Check file size is under 5MB

### App won't load
- ✅ Clear cache: `npm start -- --clear`
- ✅ Restart dev server
- ✅ Check browser console (F12) for errors

---

## Next Steps After Setup

Once Firebase is enabled:

1. **Test User Authentication**
   - Sign up with email/password
   - Sign in
   - Sign out

2. **Test Creating Reports**
   - Create a new civic issue report
   - Upload a photo
   - Check Firestore to see the data

3. **Test Social Features**
   - Upvote/downvote reports
   - Add comments
   - View other users' reports

4. **Production Security** (before launching)
   - Update Firestore rules to production mode
   - Update Storage rules to production mode
   - Enable App Check for security
   - Set up Firebase Analytics

---

## Quick Links

- **Firebase Console:** https://console.firebase.google.com/project/civic-vigilance
- **Authentication:** https://console.firebase.google.com/project/civic-vigilance/authentication
- **Firestore:** https://console.firebase.google.com/project/civic-vigilance/firestore
- **Storage:** https://console.firebase.google.com/project/civic-vigilance/storage
- **Project Settings:** https://console.firebase.google.com/project/civic-vigilance/settings/general

---

## Support

If you encounter any issues:
1. Check the browser console (F12) for error messages
2. Check the Expo dev server terminal for logs
3. Verify all Firebase services are enabled
4. Review the security rules

**Estimated Setup Time:** 10-15 minutes

Good luck! 🚀
