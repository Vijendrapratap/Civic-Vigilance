-- CivicVigilance Database Schema
-- Optimized for geospatial queries with PostGIS
-- Run this in your Supabase SQL editor

-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CUSTOM TYPES
-- ============================================================================

CREATE TYPE issue_category AS ENUM (
  'pothole',
  'garbage',
  'streetlight',
  'drainage',
  'water_supply',
  'sewage',
  'traffic_signal',
  'encroachment',
  'stray_animals',
  'parks',
  'other'
);

CREATE TYPE twitter_posting_method AS ENUM (
  'civic_vigilance',
  'personal',
  'none'
);

CREATE TYPE posting_status AS ENUM (
  'pending',
  'posted',
  'failed'
);

CREATE TYPE verification_type AS ENUM (
  'journalist',
  'rwa',
  'ngo',
  'official'
);

CREATE TYPE moderation_status AS ENUM (
  'active',
  'hidden',
  'removed'
);

-- ============================================================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================================================

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Profile
  email TEXT,
  username TEXT UNIQUE NOT NULL,
  anonymous_mode BOOLEAN DEFAULT false,
  display_name TEXT,
  photo_url TEXT,
  bio TEXT,
  city TEXT,
  state TEXT,
  home_location GEOGRAPHY(POINT, 4326), -- PostGIS for home location

  -- Connected accounts
  google_connected BOOLEAN DEFAULT false,
  twitter_connected BOOLEAN DEFAULT false,
  twitter_handle TEXT,
  twitter_user_id TEXT,

  -- Privacy preferences
  privacy_default twitter_posting_method DEFAULT 'civic_vigilance',
  always_ask_twitter_method BOOLEAN DEFAULT false,

  -- Verification
  is_verified BOOLEAN DEFAULT false,
  verification_type verification_type,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT username_length CHECK (char_length(username) >= 3),
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]+$')
);

-- User stats (computed via views, but can be cached here)
CREATE TABLE public.user_stats (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  total_posts INTEGER DEFAULT 0,
  total_upvotes INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  total_shares INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User preferences
CREATE TABLE public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,

  -- Notifications
  notify_nearby BOOLEAN DEFAULT true,
  notify_comments BOOLEAN DEFAULT true,
  notify_upvotes BOOLEAN DEFAULT true,
  notify_replies BOOLEAN DEFAULT true,
  notify_twitter BOOLEAN DEFAULT false,
  notify_digest BOOLEAN DEFAULT true,
  notify_trending BOOLEAN DEFAULT false,
  notify_similar BOOLEAN DEFAULT true,

  -- Privacy
  profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private')),
  show_location BOOLEAN DEFAULT true,

  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ISSUES/REPORTS TABLE
-- ============================================================================

CREATE TABLE public.issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  -- Content
  title TEXT NOT NULL,
  description TEXT,
  category issue_category NOT NULL,
  photos TEXT[] DEFAULT '{}', -- Array of storage URLs

  -- Location (PostGIS for powerful spatial queries)
  location GEOGRAPHY(POINT, 4326) NOT NULL, -- lat/lng as geography
  address TEXT NOT NULL,
  geohash TEXT NOT NULL, -- Keep geohash for backward compatibility

  -- Privacy & Amplification
  privacy twitter_posting_method DEFAULT 'civic_vigilance',
  twitter_handle TEXT, -- Which handle posted
  authorities TEXT[] DEFAULT '{}', -- Array of @handles

  -- Twitter posting metadata
  tweet_id TEXT,
  tweet_url TEXT,

  -- Status
  status posting_status DEFAULT 'pending',

  -- Anonymous username for this post
  anonymous_username TEXT NOT NULL,

  -- Moderation
  flagged BOOLEAN DEFAULT false,
  reviewed BOOLEAN DEFAULT false,
  moderation_status moderation_status DEFAULT 'active',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT title_length CHECK (char_length(title) >= 10),
  CONSTRAINT photos_limit CHECK (array_length(photos, 1) <= 3)
);

-- Issue metrics (separate table for better performance)
CREATE TABLE public.issue_metrics (
  issue_id UUID PRIMARY KEY REFERENCES public.issues(id) ON DELETE CASCADE,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  twitter_impressions INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT non_negative_metrics CHECK (
    upvotes >= 0 AND
    downvotes >= 0 AND
    comments >= 0 AND
    shares >= 0 AND
    twitter_impressions >= 0
  )
);

-- ============================================================================
-- VOTES TABLE
-- ============================================================================

CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  vote SMALLINT NOT NULL CHECK (vote IN (-1, 1)), -- -1 for downvote, 1 for upvote
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- One vote per user per issue
  UNIQUE(issue_id, user_id)
);

-- ============================================================================
-- COMMENTS TABLE
-- ============================================================================

CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  edited BOOLEAN DEFAULT false,

  CONSTRAINT content_length CHECK (char_length(content) >= 1)
);

-- ============================================================================
-- AUTHORITIES TABLE
-- ============================================================================

CREATE TABLE public.authorities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_local TEXT,

  -- Social media platforms (stored as JSONB for flexibility)
  social_media JSONB DEFAULT '{}'::jsonb,

  -- Jurisdiction
  jurisdiction_type TEXT NOT NULL CHECK (jurisdiction_type IN ('national', 'state', 'city', 'ward', 'department')),
  jurisdiction_level INTEGER NOT NULL CHECK (jurisdiction_level BETWEEN 1 AND 4),
  country TEXT NOT NULL DEFAULT 'IN',
  state TEXT,
  city TEXT,
  ward INTEGER,
  zone TEXT,
  geohashes TEXT[] DEFAULT '{}', -- Array of geohash prefixes
  coverage_area GEOGRAPHY(POLYGON, 4326), -- Optional: precise coverage polygon

  -- Issue categories this authority handles
  issue_categories issue_category[] DEFAULT '{}',

  -- Priority (1=primary, 2=secondary, 3=fallback)
  priority INTEGER DEFAULT 2 CHECK (priority BETWEEN 1 AND 3),

  -- Contact info (JSONB for flexibility)
  contact_info JSONB DEFAULT '{}'::jsonb,

  -- Response metrics (optional)
  response_metrics JSONB DEFAULT '{}'::jsonb,

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  verified_by TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PENDING TWITTER POSTS QUEUE
-- ============================================================================

CREATE TABLE public.pending_twitter_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  method twitter_posting_method NOT NULL CHECK (method != 'none'),
  tweet_text TEXT NOT NULL,
  image_url TEXT,
  authorities TEXT[] DEFAULT '{}',
  attempts INTEGER DEFAULT 0,
  last_attempt_at TIMESTAMPTZ,
  error TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'success', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Users
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_created_at ON public.users(created_at DESC);

-- Issues - Critical for performance!
CREATE INDEX idx_issues_user_id ON public.issues(user_id);
CREATE INDEX idx_issues_category ON public.issues(category);
CREATE INDEX idx_issues_status ON public.issues(status);
CREATE INDEX idx_issues_created_at ON public.issues(created_at DESC);
CREATE INDEX idx_issues_geohash ON public.issues USING GIN (geohash gin_trgm_ops); -- For geohash prefix matching
CREATE INDEX idx_issues_location ON public.issues USING GIST (location); -- PostGIS spatial index (CRITICAL!)
CREATE INDEX idx_issues_moderation_status ON public.issues(moderation_status) WHERE moderation_status = 'active';

-- Votes
CREATE INDEX idx_votes_issue_id ON public.votes(issue_id);
CREATE INDEX idx_votes_user_id ON public.votes(user_id);

-- Comments
CREATE INDEX idx_comments_issue_id ON public.comments(issue_id);
CREATE INDEX idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX idx_comments_created_at ON public.comments(created_at ASC);

-- Authorities
CREATE INDEX idx_authorities_geohashes ON public.authorities USING GIN (geohashes);
CREATE INDEX idx_authorities_issue_categories ON public.authorities USING GIN (issue_categories);
CREATE INDEX idx_authorities_coverage_area ON public.authorities USING GIST (coverage_area);

-- Notifications
CREATE INDEX idx_notifications_user_id_read ON public.notifications(user_id, read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- Pending Twitter Posts
CREATE INDEX idx_pending_twitter_status ON public.pending_twitter_posts(status) WHERE status IN ('pending', 'processing');

-- ============================================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON public.issues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create user_stats and user_preferences on user creation
CREATE OR REPLACE FUNCTION create_user_metadata()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_stats (user_id) VALUES (NEW.id);
  INSERT INTO public.user_preferences (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_user_created AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION create_user_metadata();

-- Auto-create issue_metrics on issue creation
CREATE OR REPLACE FUNCTION create_issue_metrics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.issue_metrics (issue_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_issue_created AFTER INSERT ON public.issues
  FOR EACH ROW EXECUTE FUNCTION create_issue_metrics();

-- Update issue_metrics.comments count on comment insert/delete
CREATE OR REPLACE FUNCTION update_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.issue_metrics
    SET comments = comments + 1, updated_at = NOW()
    WHERE issue_id = NEW.issue_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.issue_metrics
    SET comments = GREATEST(0, comments - 1), updated_at = NOW()
    WHERE issue_id = OLD.issue_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_comment_change AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_comment_count();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Get nearby issues within radius (in meters)
CREATE OR REPLACE FUNCTION get_nearby_issues(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_meters INTEGER DEFAULT 5000,
  limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  category issue_category,
  distance_meters DOUBLE PRECISION,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.id,
    i.title,
    i.category,
    ST_Distance(
      i.location,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
    ) as distance_meters,
    i.created_at
  FROM public.issues i
  WHERE
    i.moderation_status = 'active'
    AND ST_DWithin(
      i.location,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
      radius_meters
    )
  ORDER BY distance_meters ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Get authorities for a location and category
CREATE OR REPLACE FUNCTION get_authorities_for_issue(
  issue_lat DOUBLE PRECISION,
  issue_lng DOUBLE PRECISION,
  issue_geohash TEXT,
  issue_cat issue_category,
  limit_count INTEGER DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  twitter_handle TEXT,
  priority INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.name,
    a.social_media->>'twitter'->>'handle' as twitter_handle,
    a.priority
  FROM public.authorities a
  WHERE
    a.status = 'active'
    AND issue_cat = ANY(a.issue_categories)
    AND (
      -- Match by geohash prefix
      EXISTS (
        SELECT 1 FROM unnest(a.geohashes) gh
        WHERE issue_geohash LIKE (gh || '%')
      )
      -- OR match by coverage area (if defined)
      OR (
        a.coverage_area IS NOT NULL
        AND ST_Within(
          ST_SetSRID(ST_MakePoint(issue_lng, issue_lat), 4326)::geography,
          a.coverage_area
        )
      )
    )
  ORDER BY a.priority ASC, a.jurisdiction_level DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;
