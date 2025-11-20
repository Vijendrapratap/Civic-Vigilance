# CivicVigilance 🏙️

> **"We don't fix potholes. We make them impossible to ignore."**

A civic engagement platform that amplifies citizen voices through **social media pressure**, not resolution tracking.

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Twitter_API-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" />
</p>

---

## 🎯 What is CivicVigilance?

A mobile app that lets citizens report civic issues (potholes, garbage, broken infrastructure) and **automatically** notifies authorities through Twitter, WhatsApp, Instagram, Facebook, and other platforms.

Think of it as **"Twitter for Civic Issues"** - but with smart authority tagging, multi-platform reach, and community engagement.

### 🎬 How It Works (30 Seconds)

```
1. 📸 See a pothole? Take a photo
2. 📍 GPS auto-captures location
3. 🔒 Choose privacy level (Anonymous/Personal/App-Only)
4. 🤖 AI matches relevant authorities
5. 🚀 Post to Twitter/WhatsApp/etc OR keep private
6. 👥 Community upvotes = More pressure
```

---

## ✨ Key Features

### 🛡️ **3-Tier Privacy System** (Our Core Innovation)

Choose how you want your voice heard:

| Option | Who Posts | Your Identity | Authorities Reach |
|--------|-----------|---------------|-------------------|
| **🛡️ Via @CivicVigilance** | Official account | **Protected** | ✅ Twitter + Multi-platform |
| **👤 Via My Twitter** | Your account | **Public** | ✅ From your profile |
| **🔒 App Only** | No one | **100% Private** | ❌ Community only |

**Why this matters:** Not everyone feels safe publicly reporting. We protect whistleblowers while maximizing impact.

---

### 🤖 **Smart Authority Matching**

Don't know who to tag? We do.

```
Your Location (GPS)
  → Geohash Encoding
  → Database Query
  → Match by Category
  → Top 5 Authorities
```

**Example:**
```
Pothole in Indiranagar, Bangalore
  ↓
@BBMPCOMM (City Corporation)
@BlrCityTraffic (Traffic Police)
@BWSSB_Official (Water Board)
```

**Multi-Platform Contacts:**
- 🐦 Twitter handles
- 💚 WhatsApp Business numbers
- 📘 Facebook pages
- 📧 Email addresses
- 📞 Helpline numbers

---

### 📱 **Multi-Platform Authority Contact**

Beyond just Twitter tagging:

```
🐦 Twitter: @BBMPCOMM
💚 WhatsApp: +91 80226-60000 (Business Verified)
📘 Facebook: BBMP.Bengaluru (Verified)
📧 Email: commissioner@bbmp.gov.in
📞 Toll-Free: 1800-425-2368
🌐 Website: bbmp.gov.in
```

**One tap to contact via any platform!**

---

### 🗳️ **Community Amplification**

The more people care, the louder it gets:

- **Upvote** issues to boost visibility
- **Comment** to add information
- **Share** on social media
- **Track** Twitter engagement (views, retweets, replies)

**Community Impact Dashboard:**
```
234 Upvotes | 45 Comments | 67 Shares | 12.5K Twitter Views
```

---

### 📍 **Offline Support**

No internet? No problem.

- Take photos offline
- Queue reports locally (SQLite)
- Auto-sync when online
- Optimistic UI updates

---

### 📊 **11 Issue Categories**

🚧 Potholes • 🗑️ Garbage • 💡 Streetlights • 🌊 Drainage
💧 Water Supply • 🚰 Sewage • 🚦 Traffic Signals • 🚧 Encroachment
🐕 Stray Animals • 🌳 Parks • ⚠️ Other

---

## 🏗️ Tech Stack (High-Level)

```
┌─────────────────────────────────────────┐
│           FRONTEND (Mobile)             │
│  React Native + Expo + TypeScript       │
│  Cross-platform: iOS, Android, Web      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         BACKEND (Supabase)              │
│  • PostgreSQL + PostGIS: Database       │
│  • Auth: Google Sign-In, Email/Password │
│  • Storage: Photo uploads               │
│  • Edge Functions: Twitter posting      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│       INTEGRATIONS (APIs)               │
│  • Twitter API v2: Public posting       │
│  • Google Maps: Geocoding               │
│  • WhatsApp Business: Direct messaging  │
└─────────────────────────────────────────┘
```

**Why These Choices?**
- ✅ **React Native**: Single codebase for iOS/Android/Web
- ✅ **Supabase**: PostgreSQL power, unlimited reads, better free tier
- ✅ **TypeScript**: Type safety = fewer bugs
- ✅ **Expo**: Simplifies builds and deployments

---

## 🚀 Quick Start (For Developers)

### Prerequisites

```bash
Node.js 18+
npm or yarn
Expo CLI
```

### 1. Clone & Install

```bash
git clone https://github.com/Vijendrapratap/Civic-Vigilance.git
cd Civic-Vigilance
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Add your API keys (Supabase, Google Maps, Twitter)
```

**Required API Keys:**
- 💚 **Supabase**: [supabase.com/dashboard](https://supabase.com/dashboard) - Follow [SUPABASE_SETUP.md](documentations/SUPABASE_SETUP.md)
- 🗺️ **Google Maps**: [console.cloud.google.com](https://console.cloud.google.com)
- 🐦 **Twitter** (Optional): [developer.twitter.com](https://developer.twitter.com)

### 3. Run

```bash
npm start

# Then press:
# 'i' for iOS Simulator
# 'a' for Android Emulator
# 'w' for Web Browser
```

**Test Account:**
```
Email: test@civic.com
Username: TestCitizen_2024
(See lib/seedData.ts for 10+ pre-loaded issues)
```

### 📚 Documentation

- **[SUPABASE_SETUP.md](documentations/SUPABASE_SETUP.md)** - Complete backend setup guide (15 min)
- **[TESTING.md](documentations/TESTING.md)** - Comprehensive testing checklist
- **[Technical Guides](documentations/)** - Architecture and reference docs
  - [Backend Architecture](documentations/guides/BACKEND.md)
  - [Frontend Architecture](documentations/guides/FRONTEND.md)

---

## 📱 Key Screens

### 1. **Feed Screen** (Home)
- Sort: Nearby / Newest / Trending
- Distance calculation (e.g., "2.3 km away")
- Twitter badges (🐦 Posted / 🔒 App Only)
- Upvote, Comment, Share buttons

### 2. **5-Stage Reporting Flow**
```
Stage 1: 📸 Camera + GPS Overlay
Stage 2: 📝 Title + Description + Category
Stage 3: 🔒 Privacy Selection (3 tiers)
Stage 4: 👀 Preview with Authority Tags
Stage 5: ✅ Success + View Tweet
```

### 3. **Issue Detail Screen**
- Full-size photos (16:9 ratio)
- **Community Impact** metrics
- Twitter Amplification Card (if posted publicly)
- 5-level threaded comments
- One-tap authority contact

### 4. **Settings Screen**
- Account (Username, Email)
- Connected Accounts (Google, Twitter)
- Privacy Preferences
- Notification Settings (8 types)
- Terms of Service + Privacy Policy

---

## 🧠 Smart Features

### Geohash-Based Matching

```typescript
GPS: 12.9716°N, 77.5946°E
  → Geohash: "tdr1"
  → Query: authorities WHERE geohashes CONTAINS "tdr1"
  → Filter: issueCategories CONTAINS "pothole"
  → Result: [@BBMPCOMM, @BlrCityTraffic]
```

**Why Geohash?**
- Converts GPS to string (e.g., "tdr1x2y3")
- Nearby locations have similar strings
- Makes database queries super fast
- Precision: 4 chars = ~20km area

### Platform-Specific Messaging

**Twitter (280 char limit):**
```
🚨 Deep pothole on 100 Feet Road

📍 Indiranagar, Bangalore

2-foot deep pothole causing accidents...

@BBMPCOMM @BlrCityTraffic #CivicVigilance
```

**WhatsApp (rich format):**
```
🚨 *Deep pothole on 100 Feet Road*

📍 *Location:* Indiranagar, Bangalore, Karnataka

📝 *Details:* 2-foot deep pothole causing accidents...

🏷️ *Category:* Potholes

_Reported via CivicVigilance_
```

**Email (formal):**
```
Dear Sir/Madam,

I would like to report the following civic issue:

**Issue:** Deep pothole on 100 Feet Road
**Location:** Indiranagar, Bangalore, Karnataka
**Category:** Potholes

**Description:**
2-foot deep pothole causing accidents...

Sincerely,
A Concerned Citizen
```

---

## 📊 Database Schema (Simplified)

```typescript
// PostgreSQL Tables (via Supabase)

users
  ├── username: "TestCitizen_2024"
  ├── email: "test@civic.com"
  ├── twitterConnected: false
  └── stats: { totalPosts: 12, totalUpvotes: 245 }

issues/{issueId}
  ├── title: "Deep pothole on 100 Feet Road"
  ├── photos: ["url1", "url2"]
  ├── location: { lat, lng, address, geohash }
  ├── privacy: "civic_vigilance" | "personal" | "none"
  ├── authorities: ["@BBMPCOMM", "@BlrCityTraffic"]
  ├── tweetUrl: "https://twitter.com/..."
  └── metrics: { upvotes, comments, shares, twitterImpressions }

authorities/{authorityId}
  ├── name: "BBMP"
  ├── socialMedia: {
  │     twitter: { handle: "@BBMPCOMM", verified: true }
  │     whatsapp: { number: "+918022660000" }
  │     facebook: { handle: "BBMP.Bengaluru" }
  │   }
  ├── jurisdiction: { city, state, geohashes: ["tdr1"] }
  └── issueCategories: ["pothole", "garbage", ...]

comments/{commentId}
  ├── issueId: "issue123"
  ├── userId: "user456"
  ├── text: "I saw this too!"
  └── parentId: null  // or commentId for nested replies
```

---

## 🎨 Design Philosophy

### Colors (PRD Compliant)
- **Civic Blue:** `#2563EB` (Primary actions, links)
- **Vibrant Orange:** `#FF6B3D` (Upvotes, alerts)
- **Fresh Green:** `#34D399` (Success, shares)
- **Twitter Blue:** `#1DA1F2` (Twitter features)
- **Soft White:** `#F4F4F5` (Card backgrounds)

### Typography
- **Titles:** 700 weight, proper line height
- **Body:** 15-16px, readable spacing
- **Metadata:** 12-14px, lighter colors

### Interactions
- Optimistic updates (votes, comments)
- Smooth animations (Animated API)
- Proper loading states
- Error boundaries with fallbacks

---

## 📦 Project Structure

```
civic-vigilance/
├── screens/               # Main screens (Feed, Report, Detail, Settings)
├── components/            # Reusable UI components
├── lib/                   # Core utilities
│   ├── authoritiesData.ts         # Authority database (16 authorities, 6 cities)
│   ├── smartAuthorities.ts        # Geohash matching algorithm
│   ├── authorityContactManager.ts # Multi-platform contact utilities
│   ├── geohash.ts                 # GPS ↔ Geohash conversion
│   ├── seedData.ts                # Test data (10 issues, 3 users)
│   └── supabase.ts                # Supabase client
├── types/                 # TypeScript types
├── documentations/        # All documentation and guides
└── .env.example           # Environment template
```

---

## 🧪 Testing

### Pre-loaded Test Data

**Test Account:** `test@civic.com` / `TestCitizen_2024`

**10 Realistic Issues:**
- Bangalore: Deep pothole, garbage overflow, streetlight, drainage, water supply, park
- Mumbai: Western Express Highway pothole
- Delhi: Traffic signal at Connaught Place
- Chennai: Sewage overflow on Anna Salai
- All with real photos, GPS, engagement metrics

**3 Test Users:**
- TestCitizen_2024 (verified journalist)
- Anonymous_Citizen_4523 (privacy-focused)
- CivicActivist_BLR (verified NGO)

### Run Tests

```bash
npm test           # Unit tests
npm run lint       # Code quality
npm run typecheck  # TypeScript validation
```

---

## 🔒 Legal & Compliance

- ✅ **Terms of Service** (`screens/TermsOfServiceScreen.tsx`)
- ✅ **Privacy Policy** (`screens/PrivacyPolicyScreen.tsx`)
- ✅ **GDPR Compliant** (user rights: access, delete, export, opt-out)
- ✅ **App Store Ready** (legal requirements met)

**Key Privacy Points:**
- NO background location tracking
- User controls all data sharing
- Anonymous mode protects identity
- Data deletion on request

---

## 🛣️ Roadmap

### ✅ Phase 1 & 2 (Complete)
- 5-stage reporting flow
- 3-tier privacy system
- Smart authority matching
- Multi-platform contact
- Feed with sorting
- Comprehensive settings

### 🔄 Phase 3 (Current)
- Feed UI enhancements
- Community Impact dashboard
- Twitter amplification cards
- 5-level threaded comments

### 📅 Phase 4 (Next)
- Twitter OAuth for "Via My Twitter"
- Native share functionality
- Deep linking (Supabase deep links)
- Analytics dashboard

### 🚀 Phase 5 (Future)
- WhatsApp Business API integration
- Push notifications
- Map view with clustering
- Gamification (badges, leaderboards)
- Multi-language support

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repo
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

**Code Standards:**
- TypeScript for type safety
- ESLint + Prettier for formatting
- Follow existing patterns
- Add tests for new features

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/Vijendrapratap/Civic-Vigilance/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Vijendrapratap/Civic-Vigilance/discussions)
- **Email:** support@civicvigilance.com
- **Twitter:** [@CivicVigilance](https://twitter.com/CivicVigilance)

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with ❤️ using:
- React Native & Expo
- Supabase (PostgreSQL + PostGIS)
- Twitter API v2
- Google Maps API
- Unsplash (test images)

Special thanks to:
- Government authorities who engage with citizens
- Open source community
- Early testers and contributors

---

<p align="center">
  <strong>Made for better cities and empowered citizens</strong><br>
  🏙️ Report Issues • 📢 Amplify Voices • 🤝 Build Community
</p>

<p align="center">
  <a href="#-quick-start-for-developers">Get Started</a> •
  <a href="#-key-features">Features</a> •
  <a href="#-tech-stack-high-level">Tech Stack</a> •
  <a href="#-contributing">Contribute</a>
</p>
