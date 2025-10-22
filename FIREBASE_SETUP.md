# Firebase Setup Complete! ✅

## What's Been Configured

Your Firebase project is now connected to the app with these credentials:

- **Project ID**: `civic-vigilance`
- **App ID**: `1:970220352699:web:e3f57712ab4ffc6d81659e`
- **Backend Mode**: Set to `firebase` (was `sqlite`)

## Next Steps to Complete Setup

### 1. Enable Firebase Services (5 minutes)

Go to [Firebase Console](https://console.firebase.google.com/project/civic-vigilance) and enable:

#### A. Authentication
1. Click **Authentication** in the left menu
2. Click **Get Started**
3. Enable these sign-in methods:
   - ✅ **Email/Password** (Required)
   - ✅ **Google** (Recommended)

#### B. Firestore Database
1. Click **Firestore Database** in the left menu
2. Click **Create database**
3. Choose **Start in test mode** (we'll deploy secure rules later)
4. Select a region (choose one close to your users, e.g., `asia-south1` for India)

#### C. Storage
1. Click **Storage** in the left menu
2. Click **Get started**
3. Start in test mode
4. Use the same region as Firestore

#### D. Cloud Messaging (For Push Notifications)
1. Click **Cloud Messaging** in the left menu
2. Enable the service

### 2. Deploy Security Rules (After installing Firebase CLI)

**Install Firebase CLI:**
```bash
npm install -g firebase-tools
```

**Login and deploy:**
```bash
# Login to Firebase
firebase login

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage:rules

# Deploy indexes
firebase deploy --only firestore:indexes
```

**What this does:**
- Sets up proper security so only authenticated users can create reports
- Users can only edit their own reports
- Public read access for browsing reports
- Image upload restrictions (size, type)

### 3. Test the App

```bash
# Make sure Firebase is configured
cat .env | grep FIREBASE

# Start the app
npm start

# Press 'i' for iOS, 'a' for Android, or 'w' for web
```

**Test these features:**
1. ✅ Sign up with email/password
2. ✅ Sign in with Google (if enabled)
3. ✅ Create a test report (will fail without Google Maps key)
4. ✅ View reports in feed
5. ✅ Upvote and comment

### 4. Add Google Maps API Key (Optional but Recommended)

**Why needed:** Converts GPS coordinates to readable addresses

**Get the key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps SDK for Android, iOS, and Geocoding API
3. Create an API key
4. Add to `.env`:
   ```bash
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...your_key_here
   ```

**Without this:** Location will show as coordinates only, but reports will still work.

### 5. Seed Authority Database (Later)

The app needs government authority data (Twitter handles for officials).

For now, sample authorities are hardcoded in `lib/authorities.ts`:
- `@BBMP_Ward23` (Bangalore Ward 23)
- `@BBMPCOMM` (Bangalore Municipal Corporation)
- `@BlrCityPolice` (Bangalore Traffic Police)

**To add more authorities**, you can:
1. Manually add to Firestore `authorities` collection
2. Or create a seed script to populate from a CSV

## What Works Now vs Later

### ✅ Works Now (Without Additional Setup)
- User sign up/login
- Creating reports (with sample authorities)
- Viewing feed (trending, newest)
- Upvoting and commenting
- Profile management
- Offline support

### 🔜 Needs Additional Setup
- **Twitter posting**: Requires Twitter Developer account and OAuth setup
- **Real authority matching**: Requires populating authorities database
- **Google Maps geocoding**: Requires Google Maps API key
- **Cloud Functions**: Requires deployment for server-side Twitter posting

## Troubleshooting

### "Firebase Auth not initialized"
- Make sure you enabled Authentication in Firebase Console
- Restart dev server: `npm start -- --clear`

### "Permission denied" errors
- Deploy security rules: `firebase deploy --only firestore:rules`
- Or keep Firestore in test mode (public access) for development

### "Cannot read location"
- Add Google Maps API key to `.env`
- Or manually enter address for testing

### App not connecting to Firebase
- Check `.env` file has all Firebase keys filled
- Verify `EXPO_PUBLIC_BACKEND_MODE=firebase`
- Clear Expo cache: `expo start -c`

## Security Notes

**Test Mode vs Production:**
- Test mode allows anyone to read/write (good for development)
- Deploy rules before going live (restricts access properly)

**Current setup is for development:**
- Firestore and Storage are in test mode
- Deploy security rules before releasing to users

## Resources

- [Firebase Console](https://console.firebase.google.com/project/civic-vigilance)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- Project docs: `docs/firestore-schema.md`

---

**Questions?** Check the main `README.md` or raise an issue.
