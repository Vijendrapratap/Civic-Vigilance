-- Migration: Fix profile creation trigger to bypass RLS
-- The trigger needs SECURITY DEFINER to create profiles without RLS blocking it

-- ============================================================================
-- FIX: Make trigger function bypass RLS using SECURITY DEFINER
-- ============================================================================

-- Drop the existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the trigger function with SECURITY DEFINER
-- This allows the function to bypass RLS policies when creating the profile
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER
SECURITY DEFINER  -- This is the key fix!
SET search_path = public
AS $$
BEGIN
  -- Insert a basic profile for the new user
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

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION create_profile_for_user() IS
  'Automatically creates a profile entry when a new user signs up. Uses SECURITY DEFINER to bypass RLS.';
