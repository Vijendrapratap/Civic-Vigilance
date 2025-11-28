-- Migration: Add profiles table to match application expectations
-- This migration creates a profiles table that the application code expects
-- while keeping the existing users table for comprehensive user data

-- ============================================================================
-- PROFILES TABLE (Simplified public profile data)
-- ============================================================================
-- This table stores public profile information that the app expects
-- It's separate from the main users table to allow flexible profile management

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic profile info (what the app currently uses)
  full_name TEXT,
  avatar_url TEXT,
  username TEXT UNIQUE,
  bio TEXT,

  -- Location info
  city TEXT,
  state TEXT,

  -- Display preferences
  anonymous_mode BOOLEAN DEFAULT false,
  display_name TEXT, -- Shown when not in anonymous mode

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT username_length CHECK (username IS NULL OR char_length(username) >= 3),
  CONSTRAINT username_format CHECK (username IS NULL OR username ~ '^[a-zA-Z0-9_]+$')
);

-- ============================================================================
-- UPDATE USERS TABLE STRUCTURE
-- ============================================================================
-- Modify the existing users table to work better with the profiles table
-- Only add columns if they don't exist to avoid conflicts

DO $$
BEGIN
  -- Add username if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = 'public'
                 AND table_name = 'users'
                 AND column_name = 'username') THEN
    ALTER TABLE public.users ADD COLUMN username TEXT UNIQUE;
    ALTER TABLE public.users ADD CONSTRAINT users_username_length CHECK (char_length(username) >= 3);
    ALTER TABLE public.users ADD CONSTRAINT users_username_format CHECK (username ~ '^[a-zA-Z0-9_]+$');
  END IF;

  -- Add full_name if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = 'public'
                 AND table_name = 'users'
                 AND column_name = 'full_name') THEN
    ALTER TABLE public.users ADD COLUMN full_name TEXT;
  END IF;

  -- Add avatar_url if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = 'public'
                 AND table_name = 'users'
                 AND column_name = 'avatar_url') THEN
    ALTER TABLE public.users ADD COLUMN avatar_url TEXT;
  END IF;
END $$;

-- ============================================================================
-- INDEXES FOR PROFILES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);

-- ============================================================================
-- TRIGGERS FOR PROFILES
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profiles_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a basic profile for the new user
  INSERT INTO public.profiles (id, created_at)
  VALUES (NEW.id, NOW())
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_user();

-- ============================================================================
-- SYNC EXISTING USERS TO PROFILES
-- ============================================================================
-- Migrate any existing users from the users table to profiles table

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
  username = EXCLUDED.username,
  bio = EXCLUDED.bio,
  city = EXCLUDED.city,
  state = EXCLUDED.state;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Get profile by user ID (convenience function)
CREATE OR REPLACE FUNCTION get_profile(user_id UUID)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  avatar_url TEXT,
  username TEXT,
  bio TEXT,
  city TEXT,
  state TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.full_name,
    p.avatar_url,
    p.username,
    p.bio,
    p.city,
    p.state,
    p.created_at
  FROM public.profiles p
  WHERE p.id = user_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- Update profile (convenience function with validation)
CREATE OR REPLACE FUNCTION update_profile(
  user_id UUID,
  new_full_name TEXT DEFAULT NULL,
  new_avatar_url TEXT DEFAULT NULL,
  new_username TEXT DEFAULT NULL,
  new_bio TEXT DEFAULT NULL,
  new_city TEXT DEFAULT NULL,
  new_state TEXT DEFAULT NULL
)
RETURNS public.profiles AS $$
DECLARE
  updated_profile public.profiles;
BEGIN
  UPDATE public.profiles
  SET
    full_name = COALESCE(new_full_name, full_name),
    avatar_url = COALESCE(new_avatar_url, avatar_url),
    username = COALESCE(new_username, username),
    bio = COALESCE(new_bio, bio),
    city = COALESCE(new_city, city),
    state = COALESCE(new_state, state),
    updated_at = NOW()
  WHERE id = user_id
  RETURNING * INTO updated_profile;

  RETURN updated_profile;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.profiles IS 'Public user profiles - simplified view of user data for the application';
COMMENT ON COLUMN public.profiles.id IS 'References auth.users(id)';
COMMENT ON COLUMN public.profiles.full_name IS 'User''s display name';
COMMENT ON COLUMN public.profiles.avatar_url IS 'URL to user''s avatar image in storage';
COMMENT ON COLUMN public.profiles.username IS 'Unique username for the user';
COMMENT ON COLUMN public.profiles.anonymous_mode IS 'Whether user wants to remain anonymous';

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Allow authenticated users to read all profiles (for displaying usernames, avatars, etc.)
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- Allow authenticated users to insert/update their own profile
GRANT INSERT, UPDATE ON public.profiles TO authenticated;
