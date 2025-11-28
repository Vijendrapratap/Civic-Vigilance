-- ============================================================================
-- FIX: "Database error saving new user"
-- ============================================================================
-- Run this in Supabase SQL Editor to fix signup issues
-- Dashboard: https://supabase.com/dashboard/project/endrnbacxyjpxvgxhpjj/sql

-- Drop the existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the trigger function with SECURITY DEFINER
-- This allows the function to bypass RLS policies when creating the profile
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER
SECURITY DEFINER  -- Key fix: bypasses RLS
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

-- Verify the fix
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
