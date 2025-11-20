# 🧪 Testing Checklist for CivicVigilance

This document outlines how to test all features of the CivicVigilance app using the provided test data.

## 📦 Test Data Available

The app includes comprehensive seed data in `lib/seedData.ts`:

### Test Accounts
- **Primary Test User**: `test@civic.com` / `TestCitizen_2024`
  - Verified journalist badge ⭐
  - 12 posts, 245 upvotes
  - Google connected

- **Anonymous User**: `anonymous1@civic.com` / `Anonymous_Citizen_4523`
  - Anonymous mode enabled
  - Private profile

- **Civic Activist**: `activist@civic.com` / `CivicActivist_BLR`
  - Verified NGO badge ⭐
  - Twitter connected (@CivicActivistBLR)
  - 45 posts, 890 upvotes

### Test Issues (20+ Reports)
Covers all 11 categories across 6 cities:
- **Bangalore**: Potholes, garbage, streetlights, drainage, water supply, parks
- **Mumbai**: Western Express Highway pothole
- **Delhi**: Connaught Place traffic signal
- **Chennai**: Sewage overflow
- **Pune**: Park maintenance
- **Hyderabad**: Stray animals

All issues include:
- Realistic descriptions
- Unsplash photos
- GPS coordinates
- Geohash data
- Engagement metrics (upvotes, comments, shares)
- Twitter URLs (for posted issues)

---

## ✅ Feature Testing Checklist

### 1. Authentication & Onboarding

#### Sign Up Flow
- [ ] Sign up with email/password
- [ ] Google Sign-in works
- [ ] Username selection screen appears
- [ ] Can choose username or auto-generate
- [ ] Profile created successfully

#### Login Flow
- [ ] Login with email/password
- [ ] Google login works
- [ ] Session persists on app restart
- [ ] Forgot password flow works

**Test Data:**
- Use `test@civic.com` / `password123` (create this account)
- Or use Google OAuth

---

### 2. Feed Screen (Home)

#### Issue Display
- [ ] Issues load and display correctly
- [ ] Cards show: title, category emoji, photo, location, username, time ago
- [ ] Verified badges (⭐) appear for verified users
- [ ] Privacy indicators show (🐦 Twitter / 🔒 App Only)
- [ ] Vote counts display correctly (formatted: 1.2K, 234, etc.)
- [ ] Comment counts show

#### Sorting
- [ ] **Nearby Sort**: Issues sorted by distance
  - Shows "2.3 km" distance badge
  - Closest issues appear first
- [ ] **Newest Sort**: Most recent issues first
- [ ] **Trending Sort**: Issues with most engagement

#### Filtering
- [ ] Filter by category (Pothole, Garbage, etc.)
- [ ] Filter by location/city
- [ ] Filters work with sorting

#### Actions
- [ ] Tap issue → Opens detail screen
- [ ] Upvote button works (toggle on/off)
- [ ] Upvote count updates optimistically
- [ ] Share button shows (TODO implementation)

**Test Data:**
- Feed should show 20+ issues from `SEED_REPORTS`
- Enable location to test "Nearby" sort

---

### 3. Issue Detail Screen

#### Display
- [ ] Full-size hero image loads
- [ ] Title and description display
- [ ] Category with emoji
- [ ] User info: username, verified badge, time ago
- [ ] Full address shown
- [ ] Privacy indicator (Twitter/App Only)

#### Community Impact Section
- [ ] Shows 4 metrics: Upvotes, Comments, Shares, Twitter Views
- [ ] Numbers formatted correctly (1.2K, 234)
- [ ] Twitter Views only show if tweet posted

#### Twitter Amplification Card
- [ ] Shows blue card if issue posted to Twitter
- [ ] "View Tweet" button works (opens Twitter URL)
- [ ] Card only shows for Twitter-posted issues

#### Comments
- [ ] Comments load and display
- [ ] Threaded comments (up to 5 levels deep)
- [ ] Reply button works
- [ ] Can add new comment
- [ ] Comment count updates
- [ ] Comment input has proper UX

#### Actions
- [ ] Upvote button works
- [ ] Share button shows (TODO implementation)
- [ ] Back navigation works

**Test Data:**
- Tap on "Deep pothole on 100 Feet Road" issue
- Should show 45 comments, 234 upvotes
- Has Twitter URL: https://twitter.com/CivicVigilance/status/1234567890

---

### 4. Report Issue Flow (5 Stages)

#### Stage 1: Camera
- [ ] Camera permission requested
- [ ] Can take photo (or use demo photo)
- [ ] Can take up to 3 photos
- [ ] Photo preview shows
- [ ] "Next" button enabled after photo taken

#### Stage 2: Details
- [ ] Title input works (min 10 chars)
- [ ] Description textarea works
- [ ] Category picker shows all 11 categories
- [ ] Can select category
- [ ] Location auto-captured (GPS)
- [ ] Address auto-filled via reverse geocoding
- [ ] Can manually edit address
- [ ] Validation works

#### Stage 3: Privacy Selection
- [ ] Shows 3 privacy options:
  - 🛡️ Via @CivicVigilance (Identity protected)
  - 👤 Via My Twitter (Public identity)
  - 🔒 App Only (100% private)
- [ ] Can select privacy mode
- [ ] Selected option highlighted
- [ ] Description explains each option

#### Stage 4: Preview & Authorities
- [ ] Shows issue preview
- [ ] Authority matching works (based on GPS + category)
- [ ] Shows 3-5 relevant authorities
- [ ] Authority cards show:
  - Name
  - Twitter handle
  - Multi-platform contacts (Twitter, WhatsApp, Instagram, Facebook, Email, Phone)
- [ ] Can tap to contact directly
- [ ] "Post Issue" button enabled

#### Stage 5: Success
- [ ] Success screen shows after posting
- [ ] Shows issue details
- [ ] "View Issue" button works
- [ ] "Share More" button shows (TODO)
- [ ] "Done" button returns to feed

**Test Data:**
- Use any GPS location in Bangalore (12.9716, 77.5946)
- Should match: BBMP, Traffic Police, BWSSB, BESCOM
- Category "pothole" matches BBMP and Traffic Police

---

### 5. Profile & Settings

#### Profile Screen
- [ ] Shows user info: username, email, stats
- [ ] Shows posts count, upvotes, comments
- [ ] Verified badge (if applicable)
- [ ] Can navigate to My Reports
- [ ] Can navigate to Settings
- [ ] Can navigate to Notifications

#### Settings Screen (New - 507 lines!)
- [ ] **Account Section**:
  - Shows username
  - Shows email
  - Anonymous mode toggle works
- [ ] **Connected Accounts**:
  - Shows Google (Connected ✅)
  - Shows Twitter status
- [ ] **Privacy Settings**:
  - Default privacy selector
  - Profile visibility toggle
  - Show location toggle
- [ ] **Notifications** (8 types):
  - Nearby issues toggle
  - Comments toggle
  - Upvotes toggle
  - Replies toggle
  - Twitter engagement toggle
  - Weekly digest toggle
  - Trending issues toggle
  - Similar issues toggle
- [ ] **About & Legal**:
  - Terms of Service link works
  - Privacy Policy link works
  - Version shows (1.0.0)
- [ ] **Danger Zone**:
  - Logout shows confirmation
  - Delete Account shows confirmation

**Test Data:**
- Login as `test@civic.com`
- Should show: 12 posts, 245 upvotes, 56 comments

---

### 6. Legal Screens

#### Terms of Service
- [ ] Screen loads
- [ ] Shows 12 sections
- [ ] Scrollable content
- [ ] Philosophy section ("We don't fix potholes...")
- [ ] Privacy tiers explained
- [ ] Content guidelines
- [ ] Back button works

#### Privacy Policy
- [ ] Screen loads
- [ ] Shows 11 sections
- [ ] Privacy tiers detailed
- [ ] Data collection explained
- [ ] Third-party services listed
- [ ] User rights (GDPR-compliant)
- [ ] Shield icon footer
- [ ] Back button works

---

### 7. Authority Matching System

#### Geohash-Based Matching
- [ ] Bangalore (geohash `tdr1`) → BBMP, Traffic Police, BWSSB, BESCOM
- [ ] Mumbai (geohash `te7`) → BMC, Mumbai Traffic Police
- [ ] Delhi (geohash `tt`) → MCD, Delhi Traffic Police, Delhi Jal Board
- [ ] Chennai (geohash `tdm`) → Greater Chennai Corporation

#### Category-Based Matching
- [ ] `pothole` → Road authorities (BBMP, Traffic Police, MCD, etc.)
- [ ] `garbage` → Municipal corporations (BBMP, BMC, MCD, etc.)
- [ ] `streetlight` → Electricity boards (BESCOM, etc.)
- [ ] `water_supply` / `sewage` → Water boards (BWSSB, Delhi Jal Board)
- [ ] `drainage` → Municipal corporations + water boards

#### Multi-Platform Contact
- [ ] Twitter handles shown
- [ ] WhatsApp numbers shown (if available)
- [ ] Instagram handles shown (if available)
- [ ] Facebook pages shown (if available)
- [ ] Email addresses shown (if available)
- [ ] Phone numbers shown (if available)
- [ ] Toll-free helplines shown

**Test Data:**
- 15+ authorities pre-loaded in `supabase/migrations/003_seed_authorities.sql`
- Coverage: Bangalore, Mumbai, Delhi, Chennai

---

### 8. Notifications (Smart Notifications)

#### Types Supported
- [ ] Report submitted (your issue is live)
- [ ] Twitter post success
- [ ] Comment on your post
- [ ] Reply to your comment
- [ ] Upvote milestone (10, 50, 100, etc.)
- [ ] Nearby issue (within 2km)
- [ ] Trending issue (in your city)
- [ ] Similar issue (nearby)
- [ ] Weekly digest

#### Notification UX
- [ ] Badge count shows on tab
- [ ] List view shows all notifications
- [ ] Can mark as read
- [ ] Can delete notification
- [ ] Tap notification → navigates to issue

**Test Data:**
- Create an issue to trigger "report submitted" notification
- Upvote to trigger milestone notifications

---

### 9. Performance & Optimization

#### Load Times
- [ ] Feed loads in < 2 seconds
- [ ] Images load progressively
- [ ] Infinite scroll works smoothly
- [ ] No jank when scrolling

#### Memory
- [ ] No memory leaks after 10+ navigations
- [ ] Images properly cached
- [ ] Old issues unloaded from memory

#### Optimizations Verified
- [ ] React.memo on EnhancedIssueCard (no re-renders)
- [ ] useCallback on handlers
- [ ] useMemo on expensive computations
- [ ] Formatted numbers cached

---

### 10. Error Handling

#### Network Errors
- [ ] Shows error message if offline
- [ ] Retries failed requests
- [ ] Cached data shown while offline

#### Validation Errors
- [ ] Title < 10 chars → error shown
- [ ] No photo → error shown
- [ ] No location → error shown
- [ ] Invalid email → error shown

#### Auth Errors
- [ ] Wrong password → clear error
- [ ] Account exists → clear message
- [ ] Session expired → redirect to login

---

## 🗃️ Database Testing (Supabase)

### Schema Verification
- [ ] All tables created (users, issues, votes, comments, authorities, etc.)
- [ ] PostGIS enabled
- [ ] Indexes created
- [ ] Triggers work (auto-update timestamps)
- [ ] Helper functions work

### Row Level Security
- [ ] Users can only edit own issues
- [ ] Users can view all active issues
- [ ] Users can only see own notifications
- [ ] Storage policies work (image upload)

### Data Integrity
- [ ] Foreign keys enforced
- [ ] Check constraints work
- [ ] Unique constraints work
- [ ] NOT NULL constraints work

### Geospatial Queries
- [ ] `get_nearby_issues()` function works
  ```sql
  SELECT * FROM get_nearby_issues(12.9716, 77.5946, 5000, 20);
  ```
- [ ] `get_authorities_for_issue()` function works
  ```sql
  SELECT * FROM get_authorities_for_issue(12.9716, 77.5946, 'tdr1', 'pothole', 5);
  ```
- [ ] Distance calculations accurate

---

## 🎨 UI/UX Testing

### Design Compliance
- [ ] Colors match PRD:
  - Deep Blue: #0B1524
  - Cyan: #00AEEF
  - Vibrant Orange: #FF6B3D
  - Soft White: #F4F4F5
- [ ] Typography: Inter font
- [ ] Card shadows: 0 2px 8px rgba(0,0,0,0.1)
- [ ] Border radius: 12px
- [ ] Spacing: 16px padding

### Accessibility
- [ ] All buttons have accessibility labels
- [ ] Color contrast meets WCAG AA
- [ ] Touch targets ≥ 44x44 pixels
- [ ] Screen reader support

### Responsive Design
- [ ] Works on small phones (iPhone SE)
- [ ] Works on large phones (iPhone 14 Pro Max)
- [ ] Works on tablets (iPad)
- [ ] Landscape mode supported

---

## 🚀 Testing Instructions

### Quick Start
1. **Clone & Install**
   ```bash
   git clone <repo>
   cd Civic-Vigilance
   npm install
   ```

2. **Configure Supabase**
   - Follow `SUPABASE_SETUP.md`
   - Run 3 SQL migrations
   - Add API keys to `.env`

3. **Start App**
   ```bash
   npm start
   ```

4. **Test on Device**
   - Scan QR code with Expo Go
   - Or use iOS Simulator / Android Emulator

### Using Test Data

**Option 1: Use Pre-Seeded Authorities**
- 15+ authorities already in Supabase (via migration 003)
- Just create issues to test authority matching

**Option 2: Manual Test Data**
- Use `lib/seedData.ts` constants
- Import into your database
- Or manually create test issues

### Test Account
- Email: `test@civic.com`
- Password: (create during signup)
- Username: `TestCitizen_2024`

---

## 📊 Test Results Template

### ✅ Passed
- [ ] Authentication works
- [ ] Feed displays issues
- [ ] Issue detail shows correctly
- [ ] Report flow (5 stages) works
- [ ] Voting works
- [ ] Comments work
- [ ] Authority matching works
- [ ] Settings screen functional
- [ ] Legal screens accessible

### ❌ Failed
- List any failures here with details

### 🐛 Bugs Found
- List any bugs with steps to reproduce

### 💡 Improvements Suggested
- List any UX/UI improvements

---

## 🎯 Critical Path Testing

For a quick smoke test, follow this path:

1. **Sign up** → Create account
2. **Feed** → View 20+ issues
3. **Issue Detail** → Tap any issue, view details
4. **Vote** → Upvote an issue
5. **Comment** → Add a comment
6. **Report** → Go through 5-stage flow
7. **Success** → Verify issue posted
8. **Settings** → Check all settings work
9. **Logout** → Verify logout works
10. **Login** → Verify login works

**Expected Time: 10-15 minutes**

---

## 📝 Notes

- All test data is **realistic** (real civic issues from Indian cities)
- Images from **Unsplash** (properly licensed)
- Authorities are **real** (BBMP, BMC, MCD, etc.)
- Twitter handles are **verified** (where available)

---

## 🆘 Troubleshooting

### "No issues showing"
- Check Supabase connection
- Verify API keys in `.env`
- Check Row Level Security policies

### "Authority matching not working"
- Verify geohash calculation
- Check authorities table has data
- Test `get_authorities_for_issue()` function in SQL

### "Images not loading"
- Check storage bucket created
- Verify storage policies
- Check internet connection

### "Can't create issue"
- Check user authenticated
- Verify all required fields filled
- Check RLS policies allow insert

---

**Happy Testing! 🚀**

For questions or issues, create a GitHub issue with:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
