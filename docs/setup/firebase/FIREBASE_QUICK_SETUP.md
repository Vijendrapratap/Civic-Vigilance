# 🚀 Firebase Quick Setup Checklist

## ⚡ 3-Step Quick Setup (5 minutes)

### ✅ Step 1: Enable Email/Password Authentication
**URL:** https://console.firebase.google.com/project/civic-vigilance/authentication/providers

1. Click **Authentication** → **Sign-in method**
2. Click **Email/Password**
3. Toggle **Enable** → **Save**

**This fixes the current error!** ✅

---

### ✅ Step 2: Create Firestore Database
**URL:** https://console.firebase.google.com/project/civic-vigilance/firestore

1. Click **Create database**
2. Choose **Test mode**
3. Select location (e.g., `us-central1`)
4. Click **Enable**

---

### ✅ Step 3: Set Up Storage
**URL:** https://console.firebase.google.com/project/civic-vigilance/storage

1. Click **Get started**
2. Choose **Test mode**
3. Use same location as Firestore
4. Click **Done**

---

## 🎉 That's It!

After these 3 steps, restart your app:
```bash
npm start
```

The `auth/configuration-not-found` error will be gone!

---

## 📚 Full Details

See `FIREBASE_BACKEND_SETUP.md` for:
- Detailed instructions with screenshots descriptions
- Security rules for production
- Firestore indexes for performance
- Troubleshooting guide
- Next steps

---

## 🔗 Quick Links

- [Firebase Console](https://console.firebase.google.com/project/civic-vigilance)
- [Authentication Setup](https://console.firebase.google.com/project/civic-vigilance/authentication/providers)
- [Firestore Setup](https://console.firebase.google.com/project/civic-vigilance/firestore)
- [Storage Setup](https://console.firebase.google.com/project/civic-vigilance/storage)
