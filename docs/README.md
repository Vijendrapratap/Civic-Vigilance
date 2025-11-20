# 📚 Documentation

This folder contains all setup guides, technical documentation, and reference materials for CivicVigilance.

## 📁 Folder Structure

```
docs/
├── setup/              # Setup guides for different backends
│   ├── firebase/       # Firebase setup (legacy/optional)
│   └── legacy/         # Deprecated setup guides
└── guides/             # Technical guides and references
```

---

## 🚀 Getting Started

**New developers should start here:**

1. **Main README**: `/README.md` - Overview of the project
2. **Supabase Setup**: `/SUPABASE_SETUP.md` - Primary backend setup (RECOMMENDED)
3. **Testing Guide**: `/TESTING.md` - Comprehensive testing checklist

---

## 📂 What's in Each Folder

### `/setup/firebase/` - Firebase Setup (Optional)

Firebase is **not the primary backend** anymore, but these docs are kept for reference if you want to use Firebase instead of Supabase.

**Files:**
- `FIREBASE_BACKEND_SETUP.md` - Complete Firebase setup guide
- `FIREBASE_QUICK_SETUP.md` - Quick Firebase setup
- `FIREBASE_SETUP.md` - Basic Firebase configuration
- `ENABLE_FIREBASE.md` - How to enable Firebase mode
- `firestore-schema.md` - Firestore database schema
- `firestore.rules` - Firestore security rules
- `firestore.indexes.json` - Firestore index configuration

**Note:** Supabase is recommended over Firebase due to:
- Better free tier (unlimited reads vs 50K/day)
- PostGIS for geospatial queries
- Lower cost at scale ($25/mo vs $200-500/mo)

### `/setup/legacy/` - Deprecated Guides

These guides are outdated and kept only for historical reference:

- `DEMO_MODE_README.md` - Old demo mode with SQLite
- `QUICK_START.md` - Outdated quick start
- `START_HERE.md` - Outdated entry point
- `TESTING_GUIDE.md` - Old testing guide (replaced by `/TESTING.md`)

**Don't use these** - they may contain incorrect information.

### `/guides/` - Technical Guides

Reference documentation for developers:

- `BACKEND.md` - Backend architecture and API reference
- `FRONTEND.md` - Frontend architecture and component guide
- `CODE_IMPROVEMENTS.md` - Code quality and improvement suggestions

---

## 🗺️ Documentation Map

### For New Users
1. Read `/README.md` (5 min)
2. Follow `/SUPABASE_SETUP.md` (15 min)
3. Use `/TESTING.md` to test features (30 min)

### For Contributors
1. Read `/README.md`
2. Read `guides/FRONTEND.md` - Understand React Native structure
3. Read `guides/BACKEND.md` - Understand backend architecture
4. Read `guides/CODE_IMPROVEMENTS.md` - Follow best practices

### For Firebase Users (Optional)
1. Read `setup/firebase/FIREBASE_BACKEND_SETUP.md`
2. Configure `setup/firebase/firestore.rules`
3. Deploy `setup/firebase/firestore.indexes.json`

---

## 🔄 Why the Reorganization?

**Before:** 13 markdown files scattered in root directory ❌
**After:** 3 key files in root + organized docs folder ✅

**Benefits:**
- Cleaner root directory
- Easier to find documentation
- Clear separation between current and legacy docs
- Better navigation for new developers

---

## 📝 Quick Links

### Primary Documentation (Root)
- [**README.md**](../README.md) - Project overview
- [**SUPABASE_SETUP.md**](../SUPABASE_SETUP.md) - Backend setup (RECOMMENDED)
- [**TESTING.md**](../TESTING.md) - Testing guide

### Setup Guides
- [Supabase Setup](../SUPABASE_SETUP.md) ⭐ RECOMMENDED
- [Firebase Setup](setup/firebase/FIREBASE_BACKEND_SETUP.md) (Optional)

### Technical Guides
- [Backend Architecture](guides/BACKEND.md)
- [Frontend Architecture](guides/FRONTEND.md)
- [Code Improvements](guides/CODE_IMPROVEMENTS.md)

### Reference
- [Firestore Schema](setup/firebase/firestore-schema.md)
- [Security Rules](setup/firebase/firestore.rules)

---

## 🆘 Need Help?

- **Setup Issues**: Check `/SUPABASE_SETUP.md` troubleshooting section
- **Testing Issues**: Check `/TESTING.md` troubleshooting section
- **Code Questions**: Read `guides/BACKEND.md` and `guides/FRONTEND.md`
- **Bug Reports**: Create a GitHub issue

---

**Happy Building! 🚀**
