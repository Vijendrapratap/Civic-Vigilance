-- Migration: Row Level Security policies for profiles table
-- Ensures users can only modify their own profiles but can view others

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- DROP EXISTING POLICIES IF ANY
-- ============================================================================

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

-- ============================================================================
-- SELECT POLICIES (Read access)
-- ============================================================================

-- Allow everyone (including anonymous users) to view all profiles
-- This is needed for displaying usernames, avatars, etc. throughout the app
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (true);

-- ============================================================================
-- INSERT POLICIES (Create access)
-- ============================================================================

-- Users can only insert their own profile
-- The auth.uid() must match the profile id
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- UPDATE POLICIES (Modify access)
-- ============================================================================

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- DELETE POLICIES (Remove access)
-- ============================================================================

-- Users can delete their own profile (though this should cascade from auth.users)
CREATE POLICY "Users can delete their own profile"
  ON public.profiles
  FOR DELETE
  USING (auth.uid() = id);

-- ============================================================================
-- ADDITIONAL SECURITY
-- ============================================================================

-- Ensure the profiles table has proper foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'profiles_id_fkey'
    AND table_name = 'profiles'
  ) THEN
    ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_id_fkey
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON POLICY "Public profiles are viewable by everyone" ON public.profiles
  IS 'Allows all users to view profile information for displaying usernames and avatars';

COMMENT ON POLICY "Users can insert their own profile" ON public.profiles
  IS 'Users can create their own profile during signup';

COMMENT ON POLICY "Users can update their own profile" ON public.profiles
  IS 'Users can modify only their own profile data';

COMMENT ON POLICY "Users can delete their own profile" ON public.profiles
  IS 'Users can delete their own profile (cascades from auth deletion)';
