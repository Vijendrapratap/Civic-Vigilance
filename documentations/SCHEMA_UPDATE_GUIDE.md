# Schema Update Guide - Fixing Profiles Table Issue

This guide will help you apply the improved database schema to your Supabase instance.

## 🎯 What This Update Fixes

### **CRITICAL FIX: Profiles Table**
- ✅ Adds the missing `profiles` table that the application expects
- ✅ Syncs existing user data to the profiles table
- ✅ Sets up automatic profile creation when users sign up
- ✅ Implements proper Row Level Security (RLS) policies

### **Performance Improvements**
- ✅ Adds optimized indexes for faster queries
- ✅ Creates materialized view for trending issues
- ✅ Improves trigger performance for vote counts
- ✅ Adds helper functions for common queries

### **Data Integrity**
- ✅ Adds missing vote count triggers
- ✅ Implements user stats auto-updates
- ✅ Cleans up orphaned records
- ✅ Creates storage bucket for avatars

---

## 📋 Prerequisites

- [ ] Supabase project created and accessible
- [ ] Initial schema (001_initial_schema.sql) already applied
- [ ] Access to Supabase SQL Editor
- [ ] Backup of current database (recommended)

---

## 🚀 Step-by-Step Migration Process

### Step 1: Backup Your Database (IMPORTANT!)

Before making any changes, create a backup:

1. Go to **Settings** → **Database** in Supabase dashboard
2. Scroll down to **Database Backups**
3. Click **Create Backup Now**
4. Wait for confirmation

Alternatively, using CLI:
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Create a backup
supabase db dump -f backup-$(date +%Y%m%d).sql
```

---

### Step 2: Apply Migration 004 - Add Profiles Table

1. Open **Supabase Dashboard** → **SQL Editor**
2. Click **New Query**
3. Open the file: `supabase/migrations/004_add_profiles_table.sql`
4. **Copy the entire contents** of the file
5. **Paste into SQL Editor**
6. Click **RUN** (bottom right)

**Expected Result:**
```
Success. No rows returned
```

**What This Does:**
- Creates the `profiles` table with columns: id, full_name, avatar_url, username, bio, city, state
- Adds indexes for fast queries
- Creates triggers for auto-updating timestamps
- Syncs existing user data from `users` table to `profiles` table
- Sets up auto-profile creation when new users sign up

**Verification:**
```sql
-- Check if profiles table exists
SELECT COUNT(*) FROM public.profiles;

-- Check if existing users have profiles
SELECT u.id, u.email, p.full_name, p.username
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LIMIT 5;
```

---

### Step 3: Apply Migration 005 - Row Level Security for Profiles

1. Create a **New Query** in SQL Editor
2. Open the file: `supabase/migrations/005_update_rls_for_profiles.sql`
3. **Copy the entire contents**
4. **Paste into SQL Editor**
5. Click **RUN**

**Expected Result:**
```
Success. No rows returned
```

**What This Does:**
- Enables Row Level Security on profiles table
- Creates policies:
  - Everyone can view all profiles (for displaying usernames/avatars)
  - Users can only insert/update/delete their own profile
- Ensures data security while allowing public profile viewing

**Verification:**
```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'profiles';

-- Check policies exist
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename = 'profiles';
```

---

### Step 4: Apply Migration 006 - Schema Optimizations

1. Create a **New Query** in SQL Editor
2. Open the file: `supabase/migrations/006_optimize_schema.sql`
3. **Copy the entire contents**
4. **Paste into SQL Editor**
5. Click **RUN**

**Expected Result:**
```
Success. No rows returned
```

**What This Does:**
- Adds performance indexes for common queries
- Creates triggers for auto-updating user stats
- Creates materialized view for trending issues
- Adds helper functions for complex queries
- Creates avatars storage bucket
- Cleans up orphaned records

**Verification:**
```sql
-- Check indexes were created
SELECT indexname FROM pg_indexes
WHERE tablename IN ('profiles', 'issues', 'votes', 'comments')
ORDER BY tablename, indexname;

-- Check materialized view exists
SELECT schemaname, matviewname FROM pg_matviews
WHERE matviewname = 'trending_issues';

-- Check storage bucket exists
SELECT id, name, public FROM storage.buckets;
```

---

### Step 5: Test the Schema Changes

Run these queries to verify everything works:

#### Test 1: Check Profiles Table
```sql
-- Should return your profile data
SELECT * FROM public.profiles LIMIT 5;
```

#### Test 2: Test Profile Creation Trigger
```sql
-- Create a test user (this will automatically create a profile)
-- Note: This is just for verification, actual user creation happens via Supabase Auth

-- Check that user_stats and user_preferences are also created
SELECT
  u.id,
  u.email,
  p.full_name,
  s.total_posts,
  pr.notify_nearby
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.user_stats s ON u.id = s.user_id
LEFT JOIN public.user_preferences pr ON u.id = pr.user_id
LIMIT 5;
```

#### Test 3: Test Helper Functions
```sql
-- Get user with stats (replace with actual user ID)
SELECT * FROM get_user_with_stats('YOUR_USER_UUID_HERE');

-- Get nearby issues (test with Bangalore coordinates)
SELECT * FROM get_nearby_issues(12.9716, 77.5946, 5000, 10);
```

#### Test 4: Test Row Level Security
```sql
-- This should work (viewing is public)
SELECT id, full_name, username FROM public.profiles LIMIT 5;

-- Try updating someone else's profile (should fail unless you're that user)
-- UPDATE public.profiles SET full_name = 'Test' WHERE id = 'SOMEONE_ELSE_UUID';
```

---

## 🧪 Testing from Your Application

After applying the migrations, test from your app:

### Test 1: Backend Connection
```bash
# Run the backend test script
node test-backend-simple.js
```

**Expected Output:**
```
[✓] Supabase Connection: Successfully connected to Supabase
[✓] Table: profiles: Table exists and is accessible
[✓] Table: issues: Table exists and is accessible
[✓] Table: votes: Table exists and is accessible
[✓] Table: comments: Table exists and is accessible
[✓] Table: authorities: Table exists and is accessible
```

### Test 2: User Signup and Profile Creation
```bash
# Start your app
npm start
```

1. Try creating a new account in the app
2. Check Supabase Dashboard → **Authentication** → **Users**
3. Check **Table Editor** → **profiles** table
4. Verify that a profile was automatically created for the new user

### Test 3: Issue Creation
1. Create a test issue in the app
2. Check **Table Editor** → **issues** table
3. Check **Table Editor** → **issue_metrics** table
4. Verify metrics are being tracked

---

## 🔧 Troubleshooting

### Problem: Migration fails with "relation already exists"
**Solution:** Some tables/functions may already exist. This is normal if you've run parts of the migration before. The migrations use `IF NOT EXISTS` and `IF EXISTS` to be idempotent.

### Problem: "permission denied for table profiles"
**Solution:** Check that RLS policies are correctly applied:
```sql
-- View current policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- If missing, re-run migration 005
```

### Problem: Test shows "profiles table not found"
**Solution:**
1. Verify migration 004 ran successfully
2. Check the table exists: `SELECT * FROM public.profiles;`
3. Check schema: `\d public.profiles` (in psql) or view in Table Editor

### Problem: Existing user data not in profiles table
**Solution:** Re-run the sync query from migration 004:
```sql
INSERT INTO public.profiles (id, full_name, avatar_url, username, bio, city, state, created_at)
SELECT
  id,
  full_name,
  photo_url as avatar_url,
  username,
  bio,
  city,
  state,
  created_at
FROM public.users
WHERE id IS NOT NULL
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url,
  username = EXCLUDED.username;
```

### Problem: Trending issues view not working
**Solution:** Refresh the materialized view:
```sql
REFRESH MATERIALIZED VIEW trending_issues;

-- Or use the helper function
SELECT refresh_trending_issues();
```

---

## 📊 Schema Structure After Migration

### Tables Created/Modified:

1. **`public.profiles`** (NEW)
   - Stores user profile data
   - Auto-created on user signup
   - RLS enabled

2. **`public.users`** (UPDATED)
   - Added username, full_name, avatar_url columns if missing
   - Works alongside profiles table

3. **`public.issue_metrics`** (UPDATED)
   - Added views column
   - Improved triggers for vote counting

4. **`trending_issues`** (NEW - Materialized View)
   - Cached trending issues with scoring
   - Refresh periodically: `SELECT refresh_trending_issues();`

### Storage Buckets:

1. **`issue-photos`** (from migration 002)
   - Stores issue images

2. **`avatars`** (NEW)
   - Stores user avatar images

---

## 🔄 Maintenance Tasks

### Refresh Trending Issues (Every 15-30 minutes)
Set up a Supabase Edge Function or cron job:
```sql
SELECT refresh_trending_issues();
```

### Monitor Database Size
```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Clean Up Old Notifications (Weekly)
```sql
DELETE FROM public.notifications
WHERE created_at < NOW() - INTERVAL '90 days'
AND read = true;
```

---

## ✅ Migration Checklist

After completing all steps, verify:

- [ ] Migration 004 applied successfully
- [ ] Migration 005 applied successfully
- [ ] Migration 006 applied successfully
- [ ] Profiles table exists and contains data
- [ ] RLS policies are active on profiles
- [ ] Test script passes all tests
- [ ] User signup creates profile automatically
- [ ] Issue creation works in app
- [ ] Voting and commenting work
- [ ] No errors in Supabase logs

---

## 🎉 Success!

Your database schema is now updated and optimized! The application should now work without the "profiles table not found" error.

### Next Steps:

1. **Configure External Services** (if not done):
   - Twitter OAuth credentials
   - Google Maps API key
   - Cloud Functions URL

2. **Enable Realtime** (optional):
   - Go to Database → Replication
   - Enable for: issues, comments, votes, notifications

3. **Set Up Backups**:
   - Enable daily backups (Settings → Database)
   - Or schedule manual backups weekly

4. **Monitor Performance**:
   - Check **Database** → **Usage** regularly
   - Watch for slow queries in Logs

---

## 📞 Support

If you encounter issues:

1. Check **Logs** → **Database** in Supabase dashboard
2. Review error messages in SQL Editor
3. Verify all migrations ran completely
4. Check the troubleshooting section above
5. Create an issue on GitHub with error details

---

**Schema Version:** 006
**Last Updated:** 2025-11-27
**Status:** Production Ready ✅
