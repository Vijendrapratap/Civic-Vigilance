# 🔧 Fix: "Database error saving new user"

Complete guide to fixing the signup error in Civic Vigilance.

---

## 🐛 The Problem

When users try to sign up, they get the error:
```
Database error saving new user
```

### **Root Cause:**

The automatic profile creation trigger is being blocked by Row Level Security (RLS) policies. When a new user signs up:

1. ✅ Auth record created in `auth.users` (works fine)
2. ❌ Trigger tries to create profile in `public.profiles` (blocked by RLS)
3. ❌ RLS policy requires `auth.uid() = id`, but trigger doesn't have user context
4. ❌ Profile creation fails → Signup error

---

## ✅ The Solution

Make the trigger function use `SECURITY DEFINER` to bypass RLS policies during automatic profile creation.

---

## 🚀 How to Fix

### **Method 1: Supabase SQL Editor (EASIEST)** ⭐

1. **Open Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/endrnbacxyjpxvgxhpjj/sql
   ```

2. **Run this SQL:**
   - Open the SQL Editor
   - Copy and paste the contents of `FIX_SIGNUP_ERROR.sql`
   - Click "Run"

3. **Verify the fix:**
   - The query will show the trigger details
   - You should see `create_profile_for_user()` function listed

4. **Test signup:**
   - Try creating a new account in the app
   - Should work without errors now! ✅

---

### **Method 2: Using Supabase CLI**

```bash
# Navigate to project
cd /home/pratap/work/CivicVigilance

# Login to Supabase (if not already)
npx supabase login

# Link to your project
npx supabase link --project-ref endrnbacxyjpxvgxhpjj

# Apply the migration
npx supabase db push
```

---

### **Method 3: Manual SQL Execution**

If you have direct database access:

```sql
-- Drop the existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the trigger function with SECURITY DEFINER
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, created_at)
  VALUES (NEW.id, NOW())
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_user();
```

---

## 🧪 Testing the Fix

### **1. Test Signup Flow:**

```bash
# Start the app
npm start

# Or test on device
npx expo run:android
```

### **2. Create a Test Account:**

- Open app → Sign Up
- Enter email: `test@example.com`
- Enter password: `test123`
- Click "Sign up"

### **3. Expected Behavior:**

✅ Account created successfully
✅ Redirected to username selection
✅ No "Database error" message

### **4. Verify in Supabase:**

```sql
-- Check if profile was created
SELECT * FROM public.profiles
ORDER BY created_at DESC
LIMIT 5;

-- Check auth users
SELECT id, email, created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;
```

---

## 📋 What Changed

### **Before (Broken):**

```sql
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  -- This INSERT was blocked by RLS
  INSERT INTO public.profiles (id, created_at)
  VALUES (NEW.id, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Problem:** Trigger runs without user context → RLS blocks INSERT → Error

### **After (Fixed):**

```sql
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER
SECURITY DEFINER  ← This is the fix!
SET search_path = public
AS $$
BEGIN
  -- This INSERT now bypasses RLS
  INSERT INTO public.profiles (id, created_at)
  VALUES (NEW.id, NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Solution:** `SECURITY DEFINER` runs with database admin privileges → Bypasses RLS → Works!

---

## 🔒 Security Considerations

**Q: Is SECURITY DEFINER safe?**
✅ **Yes**, because:
- Only creates profiles for new auth.users (controlled by Supabase Auth)
- Only inserts basic record (id + timestamp)
- ON CONFLICT prevents duplicates
- Users still can't modify other users' profiles (protected by other RLS policies)

**Q: Why not remove RLS instead?**
❌ **Bad idea** because:
- Would allow users to modify any profile
- Would break security model
- SECURITY DEFINER is the proper solution

---

## 🐛 Troubleshooting

### **Issue: Still getting error after fix**

```bash
# 1. Verify trigger exists
SELECT * FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

# 2. Check function definition
SELECT prosecdef
FROM pg_proc
WHERE proname = 'create_profile_for_user';
-- Should return 't' (true) for SECURITY DEFINER

# 3. Clear any existing failed signup attempts
DELETE FROM auth.users
WHERE email = 'your_test@email.com';
```

### **Issue: RLS still blocking**

```sql
-- Check RLS policies
SELECT * FROM pg_policies
WHERE tablename = 'profiles';

-- Verify SECURITY DEFINER is set
\df+ create_profile_for_user
```

### **Issue: Trigger not firing**

```sql
-- Check trigger is enabled
SELECT tgenabled
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
-- Should return 'O' (enabled)

-- Re-enable if disabled
ALTER TABLE auth.users
ENABLE TRIGGER on_auth_user_created;
```

---

## 📊 Migration Status

**Migration:** `007_fix_profile_creation_trigger.sql`
**Status:** Ready to apply
**Location:** `/home/pratap/work/CivicVigilance/supabase/migrations/`

**Applied migrations:**
- ✅ 001: Initial schema
- ✅ 002: Add geohash support
- ✅ 003: Add Twitter integration
- ✅ 004: Add profiles table
- ✅ 005: Update RLS for profiles
- ✅ 006: Optimize schema
- ⏳ 007: Fix profile creation trigger ← **Apply this!**

---

## 🎯 Quick Reference

**Fix location:** `FIX_SIGNUP_ERROR.sql`

**Supabase SQL Editor:**
```
https://supabase.com/dashboard/project/endrnbacxyjpxvgxhpjj/sql
```

**Test credentials:**
```
Email: test@example.com
Password: test123
```

**Verification query:**
```sql
SELECT COUNT(*) as total_profiles FROM public.profiles;
SELECT COUNT(*) as total_users FROM auth.users;
-- Numbers should match!
```

---

## ✅ Success Checklist

- [ ] SQL script executed in Supabase dashboard
- [ ] Trigger recreated with SECURITY DEFINER
- [ ] Test signup in app (no errors)
- [ ] Profile created in database
- [ ] User can proceed to username selection
- [ ] All backend tests passing (17/17)

---

**Generated:** 2025-11-28
**Status:** 🔧 Fix ready to apply!
