# 🎮 Demo Mode - Quick Reference

## ✅ Demo Mode is NOW ACTIVE!

Your Civic Vigilance app is configured for testing without Firebase.

---

## 🚀 How to Use

### 1. Start the App
```bash
npm start
```

### 2. Open in Browser
- **URL:** http://localhost:8081
- Or scan QR code with Expo Go app

### 3. Auto-Login
- ✅ You're automatically logged in as a guest
- ✅ No sign-up required
- ✅ Start testing immediately!

---

## 🎯 What You Can Test

### ✅ All Features Available:

1. **View Feed** - Browse civic reports
2. **Create Reports** - Upload photos and report issues
3. **Upvote/Downvote** - Vote on reports
4. **Comment** - Add comments to reports
5. **Profile** - View your profile and stats
6. **My Reports** - See reports you've created
7. **Settings** - Configure app preferences

### ⚠️ Demo Limitations:

- Data stored locally (not synced)
- No Firebase cloud features
- No real-time updates across devices
- No Twitter integration
- No push notifications

---

## 📱 Testing Credentials

**Current Mode:** SQLite Demo
**User:** Auto-guest (no login required)
**Backend:** Local SQLite database
**Data:** Sample civic reports pre-loaded

---

## 🎨 App Screens

### 1. **Home Feed** (Main Screen)
- Browse civic reports
- Sort by: Trending | Newest | Nearby
- Tap any report to view details

### 2. **Report Detail**
- View full report with image
- Read description and location
- Upvote/Downvote
- Add comments
- Share

### 3. **Create Report** (Camera Tab)
- Upload or take photo
- Add title and description
- Select category
- Submit

### 4. **Profile**
- View your stats
- Access "My Reports"
- Open Settings
- View Notifications

---

## 🧪 Quick Test Flow (2 Minutes)

1. **Start App** → See feed of civic issues
2. **Tap Report** → View details
3. **Upvote** → See count increase
4. **Add Comment** → "Great report!"
5. **Go to Report Tab** → Create new report
6. **Upload Photo** → Add title and category
7. **Submit** → See your report in feed
8. **Profile** → View your statistics

---

## 🎬 Demo Scenarios

### Scenario A: Citizen Reports Pothole
1. Open "Report" tab
2. Upload photo of pothole
3. Title: "Dangerous pothole on Main St"
4. Category: "Pothole"
5. Submit
6. Check feed for your report

### Scenario B: Community Engagement
1. Browse feed
2. Open a popular report
3. Upvote it
4. Add supportive comment
5. Share with others

### Scenario C: Track Your Impact
1. Create 3-5 reports
2. Go to Profile
3. View "My Reports"
4. See your contribution stats

---

## 🔄 Switch to Firebase Mode

When ready to use Firebase:

1. **Edit `.env` file:**
   ```env
   EXPO_PUBLIC_BACKEND_MODE=firebase
   EXPO_PUBLIC_AUTO_GUEST=false
   ```

2. **Enable Firebase services** (see `START_HERE.md`)

3. **Restart:**
   ```bash
   npm start
   ```

---

## 📊 Sample Data Included

The app includes pre-loaded sample reports:

- **Potholes** - Road damage
- **Garbage** - Waste issues
- **Streetlights** - Lighting problems
- **Drainage** - Water/sewage
- **Traffic Signals** - Signal issues
- **Stray Animals** - Animal control
- **Parks** - Park maintenance
- **Other** - Miscellaneous

---

## 🎯 What to Look For

### User Experience
- ✅ Smooth navigation
- ✅ Fast loading
- ✅ Responsive touch
- ✅ Clear UI elements

### Functionality
- ✅ Reports load correctly
- ✅ Images display properly
- ✅ Voting works
- ✅ Comments save
- ✅ New reports appear in feed

### Data Persistence
- ✅ Reports saved after creation
- ✅ Votes persisted
- ✅ Profile data retained

---

## 📝 Testing Checklist

Quick checklist to validate all features:

- [ ] App opens successfully
- [ ] Feed loads with reports
- [ ] Can view report details
- [ ] Can upvote/downvote
- [ ] Can add comments
- [ ] Can create new report
- [ ] Can upload image
- [ ] Profile shows stats
- [ ] "My Reports" shows created reports
- [ ] Navigation works smoothly

---

## 🐛 Found an Issue?

Document it:

**Issue:** [Description]
**Steps:** [How to reproduce]
**Expected:** [What should happen]
**Actual:** [What actually happens]

---

## 📚 More Info

- **Complete Testing Guide:** `TESTING_GUIDE.md`
- **Firebase Setup:** `START_HERE.md`
- **Detailed Setup:** `ENABLE_FIREBASE.md`

---

## ⚡ Quick Commands

```bash
# Start app
npm start

# Run tests
npm test

# Type check
npm run typecheck

# Clear cache and restart
npm start -- --clear

# Run on Android
npm run android

# Run on iOS (Mac only)
npm run ios
```

---

## 🎉 You're Ready!

**Status:**
- ✅ Demo mode active
- ✅ Auto-guest enabled
- ✅ Sample data loaded
- ✅ Ready to test

**Open the app and explore!** 🚀

---

## 💡 Tips

1. **Test on multiple platforms** (web, mobile, emulator)
2. **Try different report categories**
3. **Create multiple reports** to test feed
4. **Engage with existing reports** (vote, comment)
5. **Check all screens** (Feed, Report, Profile)
6. **Test navigation flow**
7. **Try edge cases** (long titles, special characters)

---

**Have fun testing!** 🎊

When you're ready for production, just enable Firebase and deploy!
