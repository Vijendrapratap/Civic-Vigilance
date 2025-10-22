# Civic Vigilance 📱

> **See a pothole? Report it in 30 seconds.**

A simple mobile app that lets you report civic problems (potholes, garbage, broken streetlights) by taking a photo. The app automatically notifies the right government officials on Twitter and tracks the issue until it's fixed.

## What Does This App Do?

**In Simple Terms:**
1. You see a civic problem (pothole, garbage pile, broken streetlight, etc.)
2. Open the app and take a photo
3. The app automatically gets your GPS location
4. Choose if you want to tweet about it or keep it private
5. Submit! The app tags the right government authorities on Twitter
6. Track the issue and see when it gets fixed

Think of it as "Instagram for Civic Problems" - but instead of likes, you get results from authorities.

## Why This App is Different 🌟

### 1. Smart Privacy Options
You decide how public or private you want to be:

**Option A: Anonymous via @CivicVigilance** (Recommended)
- ✅ No Twitter account needed
- ✅ Your identity is protected
- ✅ Still notifies authorities
- Perfect for: People who want to help but stay private

**Option B: Tweet from Your Account**
- ✅ Build your civic reputation
- ✅ Your followers see your good work
- ✅ Full credit for making your city better
- Perfect for: Activists and civic leaders

**Option C: App Only (No Twitter)**
- ✅ 100% private
- ✅ Only visible to other app users
- ⚠️ Authorities won't see it on Twitter
- Perfect for: Just tracking issues in your neighborhood

### 2. Finds the Right Officials Automatically
Don't know who to tag? We do!

The app uses your GPS location to automatically find and tag:
- Your local ward office (e.g., @BBMP_Ward23)
- City municipal account (e.g., @BBMPCOMM)
- Relevant departments (e.g., @BlrCityPolice for traffic issues)

**How it works:** GPS → Geohash → Matches your location with government authority database → Tags the right officials

### 3. Works Offline
No internet? No problem!
- Take photos and create reports offline
- Everything saves locally
- Auto-posts when you get back online

### 4. Community Features
Like Reddit, but for fixing your city:
- Upvote important issues to get them noticed
- Comment and discuss solutions
- See what's trending in your area
- Track issues from "Reported" to "Fixed"

## What Can You Report?

The app has 11 categories (with emojis for easy recognition):

| Category | Emoji | Example |
|----------|-------|---------|
| Potholes | 🚧 | Deep holes on roads causing accidents |
| Garbage | 🗑️ | Overflowing bins, illegal dumping |
| Streetlights | 💡 | Broken or non-functional lights |
| Drainage | 🌊 | Blocked drains, flooding issues |
| Water Supply | 💧 | Leaking pipes, no water supply |
| Sewage | 🚰 | Sewage overflows, open manholes |
| Traffic Signals | 🚦 | Non-working signals, timing issues |
| Encroachment | 🚧 | Illegal construction, road blocking |
| Stray Animals | 🐕 | Animal welfare and safety concerns |
| Parks | 🌳 | Park maintenance, broken equipment |
| Other | ⚠️ | Anything else that needs attention |

## Tech Stack (For Developers)

Built with modern, reliable technologies:

- **Mobile App**: React Native (Expo) - Works on iOS, Android, and Web
- **Database**: Firebase Firestore - Real-time, scalable cloud database
- **Authentication**: Firebase Auth - Secure user login
- **Storage**: Firebase Cloud Storage - For photos
- **Backend Logic**: Firebase Cloud Functions - Server-side operations
- **Social Integration**: Twitter API v2 - For posting and tagging
- **Maps**: Google Maps - For location and geocoding
- **Offline Support**: SQLite - Local database for offline mode

## How to Use the App (User Guide)

### Step 1: Sign Up
- Open the app
- Create account with email and password
- Or sign in with Google (optional)

### Step 2: Report an Issue
1. **Tap the camera button** (big + icon at bottom)
2. **Take a photo** of the problem
   - The app shows your live location at the top
   - Don't worry about angles - just capture the issue clearly
3. **Add details**:
   - Give it a short title (e.g., "Big pothole on MG Road")
   - Add description if needed
   - Select category (Pothole, Garbage, etc.)
4. **Choose privacy level**:
   - Anonymous via @CivicVigilance (Recommended)
   - Tweet from your account
   - Keep it app-only
5. **Submit!**

The app automatically:
- Tags your GPS coordinates
- Finds the right government officials
- Posts to Twitter (if you chose that option)
- Saves everything to track progress

### Step 3: Follow and Engage
- **Upvote** issues you care about (helps prioritize)
- **Comment** to add information or discuss
- **Share** on social media to get more attention
- **Track** status updates: Reported → Acknowledged → In Progress → Resolved

### Step 4: Check Your Impact
Go to your **Profile** to see:
- All your reports
- How many got resolved
- Your civic contribution score
- Notifications when authorities respond

---

# Developer Setup Guide 👨‍💻

> **Below this line is for developers who want to run/modify the app**

## Quick Start (3 Steps)

### Step 1: Install Dependencies

**What you need:**
- Node.js 18 or newer ([Download here](https://nodejs.org/))
- A code editor like VS Code
- iOS Simulator (Mac only) or Android Studio (any OS)

**Install the app:**
```bash
# Clone the project
git clone https://github.com/Vijendrapratap/Civic-Vigilance.git
cd Civic-Vigilance

# Install dependencies
npm install

# Install Expo CLI globally
npm install -g expo-cli
```

### Step 2: Configure Services

You need API keys for these services (all free to start):

1. **Firebase** (Database & Auth) - [Get started](https://console.firebase.google.com/)
2. **Twitter API** (For posting) - [Apply here](https://developer.twitter.com/)
3. **Google Maps** (For location) - [Get API key](https://console.cloud.google.com/)

Copy the example environment file:
```bash
cp .env.example .env
```

Then fill in your API keys in the `.env` file (see detailed setup below).

### Step 3: Run the App

```bash
# Start the development server
npm start

# Then press:
# i - for iOS simulator
# a - for Android emulator
# w - for web browser
```

That's it! The app should now be running.

---

## Detailed Setup Instructions

### Firebase Setup (15 minutes)

**What is Firebase?** It's Google's backend service - handles database, authentication, and file storage for you.

1. **Create a Firebase project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Name it: "civic-vigilance" (or anything you like)
   - Follow the setup wizard (disable Google Analytics if you want)

2. **Enable required services:**

   **Authentication** (for user login):
   - In Firebase Console, go to Authentication
   - Click "Get Started"
   - Enable "Email/Password"
   - Enable "Google" (optional but recommended)

   **Firestore Database** (stores reports, comments, etc.):
   - Go to Firestore Database
   - Click "Create database"
   - Choose "Start in test mode" (we'll add security later)
   - Select a region close to your users

   **Storage** (for photos):
   - Go to Storage
   - Click "Get started"
   - Use default security rules for now

   **Cloud Functions** (optional for now):
   - Only needed for Twitter posting
   - Can skip initially and test app without Twitter features

3. **Get your Firebase config:**
   - Click the gear icon → Project settings
   - Scroll down to "Your apps"
   - Click the Web icon `</>`
   - Copy the config values
   - Paste them into your `.env` file

### Twitter API Setup (20 minutes)

**What is Twitter API?** Allows the app to post tweets and tag authorities automatically.

**Note:** You can skip this initially and test the app without Twitter features. Choose "App Only" mode when submitting reports.

1. **Apply for Twitter Developer Account:**
   - Go to [Twitter Developer Portal](https://developer.twitter.com/)
   - Sign in with your Twitter account
   - Apply for a developer account (takes 5-10 mins)
   - Explain: "Building a civic engagement app"

2. **Create a Twitter App:**
   - After approval, create a new project
   - Create a new app inside the project
   - Give it a name: "Civic Vigilance"

3. **Set up OAuth 2.0:**
   - Go to app settings → User authentication
   - Click "Set up"
   - Enable OAuth 2.0
   - Add callback URL: `civicvigilance://oauth/twitter`
   - Permissions: Read and Write
   - Copy the **Client ID** to your `.env` file

### Google Maps Setup (5 minutes)

**What is Google Maps API?** Converts GPS coordinates into readable addresses.

1. **Enable the API:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project (or use existing)
   - Go to "APIs & Services" → "Library"
   - Search and enable:
     - Maps SDK for Android
     - Maps SDK for iOS
     - Geocoding API

2. **Create API Key:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the key to your `.env` file
   - **Important:** Restrict the key to only the APIs you enabled

### Environment Configuration

Your `.env` file should look like this:

```bash
# ============================================
# Firebase Configuration (REQUIRED)
# ============================================
# Get these from Firebase Console → Project Settings → General
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXX
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdefgh
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# ============================================
# Google Maps (REQUIRED)
# ============================================
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXX

# ============================================
# Twitter API (OPTIONAL - can skip for testing)
# ============================================
EXPO_PUBLIC_TWITTER_CLIENT_ID=your_client_id_here
EXPO_PUBLIC_TWITTER_REDIRECT_URI=civicvigilance://oauth/twitter
EXPO_PUBLIC_CIVIC_VIGILANCE_TWITTER_HANDLE=@CivicVigilance

# ============================================
# Backend Settings
# ============================================
EXPO_PUBLIC_BACKEND_MODE=firebase
# Leave this empty for local development:
EXPO_PUBLIC_API_URL=
```

**What each does:**
- **Firebase keys**: Connect to your database and auth
- **Google Maps key**: Convert GPS to readable addresses
- **Twitter keys**: Post tweets (optional for initial testing)
- **Backend mode**: Set to "firebase" to use cloud database

---

## How the App Works (Technical Flow)

### The 5-Stage Reporting Process

```
📸 Capture → 📝 Details → 🔒 Privacy → 👀 Preview → ✅ Submit
```

### Stage 1: Photo Capture
**What happens:**
- Camera opens with live GPS overlay at the top
- Shows your current address, coordinates, and accuracy
- Take a photo of the problem
- GPS location is automatically recorded

**Behind the scenes:**
- Uses `expo-location` for GPS tracking
- Reverse geocodes coordinates to readable address
- If no GPS, shows "Locating..." and waits
- On iOS Simulator (no camera), uses a sample image

### Stage 2: Add Details
**What you fill in:**
- Title: Short description (e.g., "Big pothole on MG Road")
- Category: Select from 11 options (Pothole, Garbage, etc.)
- Description: Optional additional info

**Behind the scenes:**
- Validates required fields (photo, title, location)
- Location can be refreshed if you moved
- Photo can be retaken if needed

### Stage 3: Choose Privacy (THE KEY FEATURE)
**Three options appear:**

| Option | Who Posts | Your Identity | Authorities Notified |
|--------|-----------|---------------|---------------------|
| 🛡️ **Via @CivicVigilance** | Official account | Protected | ✅ Yes (on Twitter) |
| 👤 **Via My Twitter** | Your account | Public | ✅ Yes (from you) |
| 🔒 **App Only** | No one | 100% Private | ❌ No (app only) |

**Behind the scenes:**
- Choice is saved in database
- "Remember my choice" checkbox saves preference
- Personal Twitter option checks if account is connected

### Stage 4: Preview & Submit
**What you see:**
- Formatted tweet preview with:
  - Emoji + category
  - Your title and description
  - GPS coordinates and Google Maps link
  - Tagged authorities (e.g., @BBMP_Ward23, @BBMPCOMM)
  - #CivicVigilance hashtag

**Behind the scenes:**
- `lib/authorities.ts` → `findAuthorities()` runs:
  1. Converts GPS to geohash (for efficient matching)
  2. Queries Firestore for authorities at that location
  3. Filters by issue category
  4. Returns top 5 most relevant authorities
- Tweet text is composed with `lib/twitter.ts` → `composeTweetText()`
- Photo is uploaded to Firebase Storage
- If offline, queues in `pendingTwitterPosts` collection

### Stage 5: Success!
**What you see:**
- Confirmation screen
- Link to tweet (if posted)
- "View in Feed" button

**Behind the scenes:**
- Report saved to Firestore `reports` collection
- If Twitter enabled:
  - Cloud Function calls Twitter API v2
  - Posts from chosen account
  - Saves tweet ID and URL
- Report appears in Home Feed for others to see
- You get notifications when status changes

---

## Understanding the Code Structure

### Important Files (For Developers)

```
📁 screens/
  └── TwitterOptionsScreen.tsx    ⭐ The screen with 3 privacy options

📁 lib/
  ├── twitter.ts                  ⭐ Composes tweets, handles OAuth
  ├── authorities.ts              ⭐ Intelligent authority matching
  ├── geohash.ts                  📍 GPS → Geohash conversion
  ├── firebase.ts                 🔥 Firebase initialization
  └── location.ts                 📍 GPS tracking, geocoding

📁 types/
  └── index.ts                    📝 All TypeScript types

📁 docs/
  ├── firestore-schema.md         📊 Database structure explained
  └── firestore.rules             🔒 Security rules

📁 components/
  └── ui/                         🎨 Reusable UI components
```

### Key Algorithms Explained

#### 1. Authority Matching (`lib/authorities.ts`)

**Problem:** How to find the right government officials for any location?

**Solution:**
```
User reports pothole at GPS: 12.97160, 77.59456 (Bangalore)
                    ↓
Step 1: Convert to Geohash → "tdnu20qr"
Step 2: Query Firestore authorities where:
        - geohashes contains "tdnu20"
        - issueCategories contains "pothole"
        - status == "active"
Step 3: Sort by priority:
        1. Ward offices (most specific)
        2. City offices
        3. Departments
        4. State/National
Step 4: Return top 5 authorities
                    ↓
Result: [@BBMP_Ward23, @BBMPCOMM, @BlrCityPolice]
```

**Why Geohash?**
- Converts GPS coordinates to a string
- Nearby locations have similar strings
- Makes database queries super fast
- Example: "tdnu20qr" ≈ 38m × 19m area

#### 2. Tweet Composition (`lib/twitter.ts`)

Takes report data and formats it perfectly:

```typescript
Input: {
  category: 'pothole',
  title: 'Big pothole on MG Road',
  address: '123 MG Road, Bangalore',
  lat: 12.97160,
  lng: 77.59456,
  authorities: ['@BBMP_Ward23', '@BBMPCOMM']
}

Output tweet:
"🚧 Pothole reported on Dec 17, 2025, 3:45 PM

📍 123 MG Road, Bangalore
🗺 GPS: 12.97160, 77.59456
https://maps.google.com/?q=12.97160,77.59456

@BBMP_Ward23 @BBMPCOMM

Please take immediate action.

Reported by: John Doe via Civic Vigilance

#CivicVigilance"
```

### Database Structure (Simplified)

**Think of Firebase Firestore like folders:**

```
📂 users/
  └── user123/
      ├── name: "John Doe"
      ├── email: "john@email.com"
      ├── twitterConnected: true
      └── totalReports: 5

📂 reports/
  └── report456/
      ├── title: "Big pothole"
      ├── imageUrl: "https://..."
      ├── lat: 12.97160
      ├── lng: 77.59456
      ├── twitterMethod: "civic_vigilance"
      ├── twitterUrl: "https://twitter.com/..."
      ├── status: "reported"
      └── upvotes: 23

📂 authorities/
  └── bbmp_ward23/
      ├── name: "BBMP Ward 23"
      ├── handle: "@BBMP_Ward23"
      ├── geohashes: ["tdnu20", "tdnu21"]
      └── categories: ["pothole", "garbage", ...]

📂 comments/
  └── comment789/
      ├── reportId: "report456"
      ├── userId: "user123"
      ├── text: "I saw this too!"
      └── createdAt: <timestamp>
```

See `docs/firestore-schema.md` for complete technical documentation.

---

## Testing

### Manual Testing Checklist

Core Features:
- [ ] Photo capture with live GPS overlay
- [ ] Offline report creation and sync queue
- [ ] Twitter Options Screen displays all 3 methods correctly
- [ ] Authority geo-matching returns relevant handles
- [ ] Tweet composition format matches specification
- [ ] Personal Twitter OAuth connection flow
- [ ] Report submission to Firestore
- [ ] Home feed sorting (Trending/Newest)
- [ ] Upvote/downvote with optimistic updates
- [ ] Threaded comments with replies
- [ ] Push notifications for status updates

Twitter Posting:
- [ ] Civic Vigilance method posts from @CivicVigilance account
- [ ] Personal method posts from user's connected Twitter
- [ ] None method skips Twitter, saves to Firestore only
- [ ] Remember choice checkbox saves preference

Authority Matching:
- [ ] Ward-level authorities matched for Bangalore ward 23
- [ ] City-level authorities matched for Bangalore
- [ ] Category-specific filtering (pothole → Roads dept)
- [ ] Fallback to sample data when Firebase empty

### Run Automated Tests

```bash
npm test
```

## Troubleshooting

### Common Issues

**Issue**: "Twitter OAuth redirect not working"
- **Solution**: Ensure callback URI matches exactly: `civicvigilance://oauth/twitter` in both Twitter Developer Portal and `.env` file

**Issue**: "Authority matching returns no results"
- **Solution**:
  - Verify authorities collection is seeded in Firestore
  - Check geohash indexing on authorities collection
  - Ensure GPS coordinates are valid (lat: -90 to 90, lng: -180 to 180)

**Issue**: "Firebase permission denied"
- **Solution**:
  - Deploy latest security rules: `firebase deploy --only firestore:rules`
  - Check user is authenticated before writing
  - Verify user owns the report being modified

**Issue**: "Photos not uploading to Firebase Storage"
- **Solution**:
  - Check Firebase Storage bucket is created
  - Verify storage rules allow authenticated writes
  - Ensure `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` is set correctly

**Issue**: "Expo start fails with environment variable errors"
- **Solution**:
  - Verify `.env` file exists (copy from `.env.example`)
  - Restart dev server with cache clear: `expo start -c`
  - Check all required `EXPO_PUBLIC_*` variables are set

## Deployment

### Deploy to Production

#### Build the App

```bash
# iOS (requires macOS and Apple Developer account)
eas build --platform ios

# Android
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

#### Deploy Cloud Functions

```bash
# Deploy all functions
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:postTweetFromCivicAccount

# View logs
firebase functions:log
```

#### Deploy Security Rules

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage:rules
```

#### Environment Configuration

For production:
1. Set `EXPO_PUBLIC_BACKEND_MODE=firebase` in `.env`
2. Configure production Firebase project
3. Set up @CivicVigilance Twitter credentials in Cloud Functions config
4. Enable proper CORS and API key restrictions
5. Configure OAuth redirect URIs for production domain

## Design Architecture

### Component Structure
- Small, reusable components in `components/`
- Screen-level layouts in `screens/`
- Custom hooks for data and session logic in `hooks/`
- Platform services centralized in `lib/`

### UI/UX Principles
- Feed follows Reddit patterns for familiarity (chips, counts, nested threads)
- Report flow emphasizes GPS accuracy with live overlay
- Twitter Options Screen uses clear radio buttons and benefit lists
- Profile matches standard social app patterns

### Offline Support
- SQLite fallback for offline operation
- Reports queue in `pendingTwitterPosts` collection
- Background sync when connectivity restored
- Optimistic UI updates for votes and comments

## Permissions

The app requests the following permissions:

- **Camera**: Capture evidence photos of civic issues
- **Location (While Using)**: Auto-tag reports with accurate GPS coordinates
- **Notifications (Optional)**: Status updates when authorities respond

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Follow existing code style and patterns
4. Add tests for new features
5. Update documentation as needed
6. Commit changes: `git commit -m "Add my feature"`
7. Push to branch: `git push origin feature/my-feature`
8. Submit pull request with detailed description

## Roadmap

### Phase 1 (Current)
- ✅ Core reporting flow with GPS capture
- ✅ Three Twitter posting methods
- ✅ Intelligent authority geo-matching
- ✅ Firebase backend integration
- ✅ Community engagement (upvotes, comments)

### Phase 2 (Planned)
- [ ] Nearby sort using distance calculations
- [ ] Map view with clustering and heat map
- [ ] Authority response tracking via Twitter webhooks
- [ ] Push notifications for status updates
- [ ] Weekly civic digest emails

### Phase 3 (Future)
- [ ] Media moderation with ML content filtering
- [ ] Spam detection and user blocking
- [ ] Authority performance dashboard
- [ ] Gamification (badges, leaderboards)
- [ ] Multi-language support

## License

MIT License - see LICENSE file for details

## Support

- **Documentation**: See `/docs` folder for detailed specifications
- **Issues**: https://github.com/Vijendrapratap/Civic-Vigilance/issues
- **Email**: support@civicvigilance.app
- **Twitter**: [@CivicVigilance](https://twitter.com/CivicVigilance)

## Acknowledgments

Built with React Native, Expo, Firebase, and Twitter API v2. Designed to empower civic engagement through technology and transparency.

Special thanks to:
- Government authorities who engage with citizen reports
- Community contributors and testers
- Open source maintainers of our dependencies

---

**Made with ❤️ for better cities and empowered citizens**
