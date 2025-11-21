# 🚀 Supabase Setup Guide for CivicVigilance

This guide will help you set up Supabase as the backend for your CivicVigilance app. Follow these steps carefully.

## 📋 Prerequisites

- A Supabase account (free tier is perfect to start)
- Basic understanding of SQL
- Your CivicVigilance code cloned locally

---

## 🎯 Step 1: Create Supabase Project

### 1.1 Sign Up/Login to Supabase
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign in"
3. Use GitHub, Google, or email to authenticate

### 1.2 Create New Project
1. Click "New Project"
2. Fill in details:
   - **Project Name**: `civicvigilance` (or your choice)
   - **Database Password**: Generate a strong password (SAVE THIS!)
   - **Region**: Choose closest to your users (e.g., Mumbai for India)
   - **Pricing Plan**: Free (perfect for MVP)
3. Click "Create new project"
4. **Wait 2-3 minutes** for project to provision

---

## 🗄️ Step 2: Run Database Migrations

### 2.1 Open SQL Editor
1. In your Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click "New query"

### 2.2 Run Migration Scripts (IN ORDER!)

#### A. Initial Schema (001_initial_schema.sql)
1. Open `supabase/migrations/001_initial_schema.sql` from your project
2. Copy the ENTIRE contents
3. Paste into Supabase SQL Editor
4. Click **RUN** (bottom right)
5. ✅ You should see: "Success. No rows returned"

**What this does:**
- Creates all tables (users, issues, votes, comments, authorities, etc.)
- Enables PostGIS for geospatial queries
- Creates indexes for performance
- Sets up triggers for auto-updating timestamps
- Creates helper functions for nearby queries

#### B. Row Level Security (002_row_level_security.sql)
1. Open `supabase/migrations/002_row_level_security.sql`
2. Copy all contents
3. Paste into a NEW query in SQL Editor
4. Click **RUN**
5. ✅ You should see: "Success. No rows returned"

**What this does:**
- Enables RLS on all tables (security!)
- Creates policies so users can only access their own data
- Allows public viewing of active issues
- Sets up storage policies for image uploads

#### C. Seed Authorities (003_seed_authorities.sql)
1. Open `supabase/migrations/003_seed_authorities.sql`
2. Copy all contents
3. Paste into a NEW query in SQL Editor
4. Click **RUN**
5. ✅ You should see: "Success. Rows affected: 15" (or similar)

**What this does:**
- Populates authorities table with real Indian civic bodies
- Includes BBMP, Mumbai BMC, Delhi MCD, Chennai Corporation, etc.
- Sets up Twitter handles, phone numbers, geohash coverage

---

## 🔐 Step 3: Get API Credentials

### 3.1 Get Your API Keys
1. In Supabase dashboard, go to **Settings** → **API**
2. Find these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Long string starting with `eyJ...`

### 3.2 Update Your .env File
1. In your project root, create `.env` (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Add your Supabase credentials:
   ```bash
   # Supabase Configuration
   EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   # Set backend mode to Supabase
   EXPO_PUBLIC_BACKEND_MODE=supabase
   ```

3. **IMPORTANT**: Never commit `.env` to Git! It's already in `.gitignore`.

---

## 🖼️ Step 4: Configure Storage for Images

### 4.1 Verify Storage Bucket
The migration should have created the `issue-photos` bucket automatically.

Verify:
1. Go to **Storage** in Supabase dashboard
2. You should see `issue-photos` bucket
3. If NOT there, create it manually:
   - Click "New bucket"
   - Name: `issue-photos`
   - Public bucket: **Yes** ✅
   - Click "Create bucket"

### 4.2 Set File Size Limits (Optional)
1. Click on `issue-photos` bucket
2. Go to **Configuration**
3. Set:
   - **Max file size**: 5 MB (photos get compressed anyway)
   - **Allowed MIME types**: `image/*`

---

## 🔒 Step 5: Configure Authentication

### 5.1 Enable Email Auth
1. Go to **Authentication** → **Providers**
2. **Email** should be enabled by default
3. Configure:
   - ✅ Enable Email provider
   - ✅ Confirm email: ON (recommended)
   - Email templates: You can customize later

### 5.2 Enable Google OAuth (For "Sign in with Google")
1. Still in **Authentication** → **Providers**
2. Click **Google**
3. Enable the provider
4. You'll need:
   - Google Client ID
   - Google Client Secret

**Get Google Credentials:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project → Enable OAuth
3. Get Client ID and Secret
4. Paste into Supabase

### 5.3 Configure Redirect URLs
Add your app's redirect URLs:
```
civicvigilance://oauth/callback
http://localhost:19000 (for Expo dev)
```

---

## 🧪 Step 6: Test Your Setup

### 6.1 Install Dependencies
```bash
npm install @supabase/supabase-js
npm install react-native-url-polyfill
```

### 6.2 Test Database Connection
1. Start your app:
   ```bash
   npm start
   ```

2. Open Expo Go on your phone (or simulator)

3. Try creating an account:
   - You should be able to sign up
   - Check **Authentication** → **Users** in Supabase dashboard
   - Your user should appear!

### 6.3 Test Issue Creation
1. Try creating a test issue in the app
2. Go to **Table Editor** → `issues` in Supabase
3. Your issue should appear!

---

## 📊 Step 7: Monitor Your App

### 7.1 Enable Realtime (Optional)
1. Go to **Database** → **Replication**
2. Enable realtime for tables you want live updates:
   - `issues` ✅
   - `comments` ✅
   - `votes` ✅
   - `notifications` ✅

### 7.2 Set Up Logs
1. Go to **Logs** → **Database**
2. You can see all queries in real-time
3. Useful for debugging!

---

## 🔧 Troubleshooting

### Problem: "No rows returned" when creating issue
**Solution:** Check Row Level Security policies. User must be authenticated.

```sql
-- Verify RLS is working
SELECT * FROM public.issues;  -- Should only show your issues
```

### Problem: "Permission denied for table users"
**Solution:** RLS is blocking you. Check policies:

```sql
-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'issues';
```

### Problem: Images not uploading
**Solution:** Check storage bucket policies:

1. Go to Storage → issue-photos → Policies
2. Ensure "Authenticated users can upload" policy exists

### Problem: Geospatial queries not working
**Solution:** Ensure PostGIS is enabled:

```sql
-- Check if PostGIS is enabled
SELECT PostGIS_Version();
```

---

## 🚀 Next Steps

### Optimize Performance
1. **Add indexes** as your data grows:
   ```sql
   -- If queries are slow, add custom indexes
   CREATE INDEX idx_custom ON issues(created_at DESC, category);
   ```

2. **Enable caching** (Supabase Pro):
   - Go to Settings → API → Edge Functions
   - Enable Supabase Cache

### Set Up Backups (Recommended)
1. Go to **Settings** → **Database**
2. Enable **Point-in-Time Recovery** (Pro plan)
3. Or use **pg_dump** manually:
   ```bash
   pg_dump -h db.xxx.supabase.co -U postgres civicvigilance > backup.sql
   ```

### Monitor Usage
1. Go to **Settings** → **Billing**
2. Monitor:
   - Database size (500MB free tier limit)
   - API requests (unlimited on free tier!)
   - Storage (1GB free tier)
   - Bandwidth (2GB free tier)

---

## 📈 Scaling Guide

### When You Outgrow Free Tier

**Upgrade to Pro ($25/month) when:**
- Database > 500MB
- Bandwidth > 2GB/month
- Need daily backups
- Need email support

**Pro Plan Includes:**
- 8GB database
- 100GB storage
- 250GB bandwidth
- Daily backups
- Email support

**When to Consider Enterprise:**
- 10K+ daily active users
- Need SLA guarantees
- Need dedicated support
- Multi-region deployment

---

## 🛠️ Advanced: PostGIS Queries

Your database is now powered by PostGIS! Here are some powerful queries:

### Find Issues Within 2km
```sql
SELECT
  id,
  title,
  ST_Distance(
    location,
    ST_SetSRID(ST_MakePoint(77.5946, 12.9716), 4326)::geography
  ) / 1000 as distance_km
FROM issues
WHERE ST_DWithin(
  location,
  ST_SetSRID(ST_MakePoint(77.5946, 12.9716), 4326)::geography,
  2000  -- 2km in meters
)
ORDER BY distance_km;
```

### Get Authorities for a Location
```sql
SELECT * FROM get_authorities_for_issue(
  12.9716,  -- latitude
  77.5946,  -- longitude
  'tdr1',   -- geohash
  'pothole', -- category
  5         -- limit
);
```

---

## 📞 Support

### Supabase Support
- Docs: [https://supabase.com/docs](https://supabase.com/docs)
- Discord: [https://discord.supabase.com](https://discord.supabase.com)
- GitHub Issues: [https://github.com/supabase/supabase](https://github.com/supabase/supabase)

### CivicVigilance Support
- Issues: [Your GitHub repo]/issues
- Questions: Create a GitHub Discussion

---

## ✅ Checklist

Before going live, ensure:

- [ ] All 3 migrations run successfully
- [ ] .env file has correct credentials
- [ ] Storage bucket created and public
- [ ] RLS policies enabled on all tables
- [ ] Google OAuth configured (if using)
- [ ] Test user can sign up
- [ ] Test user can create issue
- [ ] Test user can upvote/comment
- [ ] Images upload successfully
- [ ] Nearby issues query works
- [ ] Authority matching works

---

## 🎉 You're All Set!

Your CivicVigilance app is now powered by Supabase with:
- ✅ PostgreSQL database with PostGIS
- ✅ Real-time subscriptions
- ✅ Secure Row Level Security
- ✅ File storage for images
- ✅ Authentication ready
- ✅ 15+ civic authorities pre-loaded
- ✅ Geospatial queries optimized
- ✅ Free tier for MVP

**Happy building! 🚀**
