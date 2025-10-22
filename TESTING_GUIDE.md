# 🧪 Civic Vigilance - Testing Guide

## 🎯 Demo Mode Enabled!

Your app is now running in **demo mode** with SQLite backend and auto-guest login. You can test all features without Firebase!

---

## 🚀 Quick Start

```bash
npm start
```

The app will:
- ✅ Automatically log you in as a guest
- ✅ Load sample civic reports
- ✅ Allow you to test all features locally
- ✅ Store data in local SQLite database

---

## 📱 App Features to Test

### 1. **Home Feed** 🏠

**Location:** Main tab (Home icon)

**Features:**
- View list of civic issues/reports
- Sort by: Trending, Newest, Nearby
- Scroll through sample reports
- See upvotes, downvotes, and comment counts

**Test Actions:**
- ✅ Switch between sort modes (Trending/Newest/Nearby)
- ✅ Scroll through the feed
- ✅ Tap on a report to view details

---

### 2. **Report Details** 📋

**Location:** Tap any report card in the feed

**Features:**
- View full report details
- See report image
- View location/address
- Read description
- View all comments
- Upvote/downvote
- Add comments

**Test Actions:**
- ✅ Upvote a report (👍 icon)
- ✅ Downvote a report (👎 icon)
- ✅ Add a comment
- ✅ View nested comments (if implemented)
- ✅ Share the report

---

### 3. **Create Report** 📸

**Location:** Center tab (Camera icon)

**Features:**
- Take or upload photo
- Enter report title
- Add description
- Select category (pothole, garbage, streetlight, etc.)
- Auto-detect location
- Preview before submitting

**Test Actions:**
- ✅ Click "Report" tab
- ✅ Upload an image (or take photo if on mobile)
- ✅ Fill in title: "Broken streetlight"
- ✅ Add description
- ✅ Select category: "Streetlight"
- ✅ Submit report
- ✅ See your report appear in the feed

---

### 4. **Profile** 👤

**Location:** Right tab (Profile icon)

**Features:**
- View profile information
- See user stats (reports, upvotes received)
- Access settings
- View my reports
- Manage notifications

**Test Actions:**
- ✅ Open profile
- ✅ View your statistics
- ✅ Tap "My Reports" to see reports you created
- ✅ Access settings
- ✅ Test profile editing (if available)

---

###5. **My Reports** 📑

**Location:** Profile → My Reports

**Features:**
- View all your submitted reports
- See status of each report
- Edit or delete your reports

**Test Actions:**
- ✅ View list of your reports
- ✅ Check report status
- ✅ Tap on a report to view details

---

### 6. **Settings** ⚙️

**Location:** Profile → Settings

**Features:**
- Notification preferences
- Privacy settings
- Linked accounts
- App information
- Debug mode

**Test Actions:**
- ✅ Toggle notification settings
- ✅ Review privacy options
- ✅ Check app version
- ✅ View debug information

---

### 7. **Notifications** 🔔

**Location:** Profile → Notifications

**Features:**
- View activity notifications
- Status updates on your reports
- Comments on your reports
- Upvote milestones

**Test Actions:**
- ✅ View notification list
- ✅ Tap notification to go to related report
- ✅ Mark notifications as read

---

## 🎨 UI/UX Elements to Explore

### Navigation
- **Bottom Tab Bar**: 3 main tabs (Home, Report, Profile)
- **Stack Navigation**: Drill down into details
- **Back Button**: Navigate back through screens

### Components
- **Issue Cards**: Report preview cards with image, title, stats
- **Action Bar**: Upvote, downvote, comment, share buttons
- **Sort Bar**: Filter/sort controls (Trending, Newest, Nearby)
- **Floating Action Button**: Quick access to create report

### Interactions
- **Pull to Refresh**: Refresh the feed
- **Infinite Scroll**: Load more reports
- **Swipe Gestures**: Navigate between screens (if implemented)
- **Haptic Feedback**: Touch responses (on mobile)

---

## 📊 Sample Data

The app comes pre-loaded with sample civic reports:

### Report Types:
1. **Potholes** - Road damage reports
2. **Garbage** - Waste management issues
3. **Streetlights** - Lighting problems
4. **Drainage** - Water/sewage issues
5. **Traffic Signals** - Signal malfunctions
6. **Stray Animals** - Animal control issues
7. **Parks** - Park maintenance
8. **Other** - Miscellaneous issues

**Test Different Categories:**
- ✅ Create reports in different categories
- ✅ Filter by category
- ✅ See how categories are displayed

---

## 🧪 Testing Scenarios

### Scenario 1: Report a New Issue
1. Go to "Report" tab
2. Take/upload a photo of a pothole
3. Enter title: "Large pothole on Main St"
4. Add description: "Dangerous pothole near intersection"
5. Select category: "Pothole"
6. Submit
7. Verify it appears in the feed

### Scenario 2: Engage with Reports
1. Open a report from the feed
2. Upvote the report
3. Add a comment: "I saw this too!"
4. Share the report
5. Go back to feed
6. Verify upvote count increased

### Scenario 3: Track Your Activity
1. Create multiple reports (3-5 different categories)
2. Go to Profile
3. Check "My Reports"
4. Verify all your reports are listed
5. Check your stats (total reports count)

### Scenario 4: Navigation Flow
1. Start at Home feed
2. Tap a report → View details
3. Tap back → Return to feed
4. Switch to Profile tab
5. Open Settings
6. Navigate back to Home
7. Verify smooth navigation

---

## 🎯 Key Features to Validate

### Core Functionality
- [ ] View feed of civic reports
- [ ] Create new reports with photos
- [ ] Upvote/downvote reports
- [ ] Add comments to reports
- [ ] View report details
- [ ] Navigate between screens
- [ ] Sort and filter reports

### User Experience
- [ ] App loads quickly
- [ ] Images load properly
- [ ] Smooth scrolling
- [ ] Responsive touch interactions
- [ ] Clear error messages
- [ ] Intuitive navigation

### Data Persistence
- [ ] Reports saved after creation
- [ ] Votes persisted
- [ ] Comments saved
- [ ] Profile data retained
- [ ] Settings preserved

---

## 🐛 Known Limitations (Demo Mode)

**SQLite Mode Limitations:**
- ✅ Data is stored locally (not synced across devices)
- ✅ No real-time updates
- ✅ No photo uploads to cloud
- ✅ Twitter integration disabled
- ✅ Authority tagging disabled
- ✅ Push notifications not available

**To Enable Full Features:**
- Switch to Firebase backend (see `START_HERE.md`)
- Enable Firebase Authentication
- Set up Firestore and Storage

---

## 📝 Testing Checklist

### Basic Tests
- [ ] App launches successfully
- [ ] Feed loads with sample data
- [ ] Can create a new report
- [ ] Can upvote/downvote reports
- [ ] Can add comments
- [ ] Navigation works smoothly
- [ ] Profile loads correctly

### Advanced Tests
- [ ] Multiple reports creation
- [ ] Image upload works
- [ ] Location detection works
- [ ] Category selection works
- [ ] Search/filter (if implemented)
- [ ] Settings can be changed
- [ ] Notifications appear (if implemented)

### Edge Cases
- [ ] Create report without image
- [ ] Very long report titles
- [ ] Special characters in descriptions
- [ ] Multiple rapid upvotes
- [ ] Empty comment submission
- [ ] Network offline (should still work in SQLite mode)

---

## 🎥 Demo Flow (5 Minutes)

Perfect for showcasing the app:

1. **Start** - Open app, see feed of civic issues
2. **Explore** - Scroll through various reports
3. **Engage** - Upvote a report, add a comment
4. **Create** - Report a new issue with photo
5. **Track** - View your profile and reports
6. **Navigate** - Show smooth transitions

---

## 🔄 Switching Between Modes

### Demo Mode (Current)
```env
EXPO_PUBLIC_BACKEND_MODE=sqlite
EXPO_PUBLIC_AUTO_GUEST=true
```

### Firebase Mode (Production)
```env
EXPO_PUBLIC_BACKEND_MODE=firebase
EXPO_PUBLIC_AUTO_GUEST=false
```

**After editing `.env`:**
```bash
# Restart the dev server
npm start
```

---

## 📚 Additional Resources

- **App Screenshot**: Take screenshots for documentation
- **Video Demo**: Record screen while testing
- **Bug Reports**: Note any issues you find
- **Feature Ideas**: Document enhancement suggestions

---

## 🆘 Troubleshooting

### App won't load
```bash
npm start -- --clear
```

### No sample data visible
- Check that SQLite mode is enabled
- Restart the app
- Check browser/app console for errors

### Features not working
- Verify `.env` settings
- Check that all packages are installed
- Run `npm install` if needed

### Can't create reports
- Check camera/gallery permissions
- Try uploading vs. taking photo
- Check console for errors

---

## 📱 Platform-Specific Testing

### Web Browser
- Open http://localhost:8081
- Test in Chrome, Firefox, Safari
- Test responsive design
- Check mobile emulation (DevTools)

### Android Emulator
- Launch Android emulator
- Run: `npm run android`
- Test touch interactions
- Test camera functionality

### iOS Simulator (Mac only)
- Launch iOS simulator
- Run: `npm run ios`
- Test iOS-specific features

---

## ✅ Test Report Template

After testing, document your findings:

**Date:** [Date]
**Platform:** [Web/Android/iOS]
**Mode:** [SQLite Demo]

**Working Features:**
- ✅ Feature 1
- ✅ Feature 2

**Issues Found:**
- ❌ Issue 1 - [Description]
- ❌ Issue 2 - [Description]

**Suggestions:**
- 💡 Suggestion 1
- 💡 Suggestion 2

---

## 🎉 Ready to Test!

**Current Status:**
- ✅ Demo mode enabled
- ✅ Auto-guest login active
- ✅ Sample data loaded
- ✅ All features testable

**Start Testing:**
```bash
npm start
```

Open the app and start exploring! 🚀

---

**Note:** Remember, this is demo mode. To experience the full app with cloud sync, Firebase integration, and all features, follow the Firebase setup in `START_HERE.md`.

Happy Testing! 🎊
