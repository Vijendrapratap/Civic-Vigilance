# Apply Migrations Now - Quick Guide

Follow these steps to fix the profiles table issue and optimize your database.

---

## 🎯 Before You Start

1. **Open Supabase Dashboard** in your browser
2. **Backup recommended** (Settings → Database → Create Backup)
3. Keep this terminal open for testing after each step

---

## Step 1: Apply Migration 004 - Add Profiles Table

### Instructions:

1. **Open:** Supabase Dashboard → **SQL Editor** (left sidebar)
2. **Click:** "New query" button
3. **Copy:** The entire content from the file below
4. **Paste:** Into the SQL Editor
5. **Click:** RUN button (bottom right)

### File to copy:
```
supabase/migrations/004_add_profiles_table.sql
```

### Expected Result:
```
Success. No rows returned
```

### What this does:
- ✅ Creates the profiles table
- ✅ Syncs existing user data
- ✅ Sets up auto-profile creation
- ✅ Adds indexes for fast queries

### Verify:
Run this in a new query to check it worked:
```sql
SELECT COUNT(*) as profile_count FROM public.profiles;
```

Should return the number of existing users.

**✅ Mark when done:** [ ]

---

## Step 2: Apply Migration 005 - Row Level Security

### Instructions:

1. **Click:** "New query" button (create fresh query)
2. **Copy:** The entire content from the file below
3. **Paste:** Into the SQL Editor
4. **Click:** RUN button

### File to copy:
```
supabase/migrations/005_update_rls_for_profiles.sql
```

### Expected Result:
```
Success. No rows returned
```

### What this does:
- ✅ Enables RLS on profiles table
- ✅ Allows everyone to view profiles
- ✅ Restricts updates to profile owners only

### Verify:
Run this to check RLS is enabled:
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'profiles';
```

Should show: `rowsecurity = true`

**✅ Mark when done:** [ ]

---

## Step 3: Apply Migration 006 - Optimizations

### Instructions:

1. **Click:** "New query" button
2. **Copy:** The entire content from the file below
3. **Paste:** Into the SQL Editor
4. **Click:** RUN button

### File to copy:
```
supabase/migrations/006_optimize_schema.sql
```

### Expected Result:
```
Success. No rows returned
```

### What this does:
- ✅ Adds performance indexes
- ✅ Creates trending issues view
- ✅ Adds helper functions
- ✅ Sets up automated triggers
- ✅ Creates avatars storage bucket

### Verify:
Run this to check trending view exists:
```sql
SELECT COUNT(*) FROM pg_matviews WHERE matviewname = 'trending_issues';
```

Should return: 1

**✅ Mark when done:** [ ]

---

## Step 4: Test Everything

### Test 1: Run Backend Test
In this terminal, run:
```bash
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

### Test 2: Check Tables in Supabase
1. Go to **Table Editor** in Supabase
2. You should now see a **profiles** table
3. Click on it to view existing profiles

### Test 3: Test Profile Query
In SQL Editor, run:
```sql
SELECT
  p.id,
  p.username,
  p.full_name,
  p.city,
  s.total_posts,
  s.total_upvotes
FROM profiles p
LEFT JOIN user_stats s ON p.id = s.user_id
LIMIT 5;
```

Should return profile data with stats.

**✅ Mark when done:** [ ]

---

## Step 5: Test in Your App

### Test User Signup
```bash
npm start
```

1. Create a new test account in the app
2. Check Supabase → Authentication → Users
3. Check Table Editor → profiles
4. The new user should have a profile automatically created

### Test Issue Creation
1. Create a test issue in the app
2. Check Table Editor → issues
3. Check Table Editor → issue_metrics
4. Verify metrics are being tracked

**✅ Mark when done:** [ ]

---

## 🎉 Success Checklist

After completing all steps, verify:

- [ ] Migration 004 applied successfully
- [ ] Migration 005 applied successfully
- [ ] Migration 006 applied successfully
- [ ] Profiles table exists in Table Editor
- [ ] Backend test passes (all ✓)
- [ ] New users auto-create profiles
- [ ] Issue creation works
- [ ] No errors in Supabase logs

---

## 🚨 Troubleshooting

### If you get "relation already exists" error:
This is OK! It means the table/function already exists. The migration is idempotent.

### If you get "permission denied":
1. Make sure you're running queries as the project owner
2. Check that you're connected to the correct project

### If profiles table still not found:
1. Go to Table Editor and manually check if table exists
2. Try running just the CREATE TABLE part of migration 004
3. Check Logs → Database for detailed error messages

### Need help?
Check the detailed guide in `SCHEMA_UPDATE_GUIDE.md`

---

## 📞 Next Steps After Success

1. **Configure External Services** (if not done):
   - Update `.env` with real Twitter OAuth credentials
   - Add real Google Maps API key
   - Set up Cloud Functions URL

2. **Set Up Automated Tasks**:
   - Refresh trending issues every 15-30 minutes
   - Clean up old notifications weekly

3. **Enable Realtime** (optional):
   - Database → Replication
   - Enable for: issues, comments, votes, notifications

---

**Ready to start?** Open your Supabase dashboard and begin with Step 1! 🚀
