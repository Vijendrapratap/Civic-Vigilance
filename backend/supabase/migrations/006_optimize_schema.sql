-- Migration: Schema optimizations and fixes
-- Improves performance, adds missing indexes, and fixes data integrity issues

-- ============================================================================
-- STORAGE BUCKET FOR AVATARS
-- ============================================================================

-- Create storage bucket for user avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- IMPROVE INDEXES FOR BETTER QUERY PERFORMANCE
-- ============================================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_city_state ON public.profiles(city, state);
CREATE INDEX IF NOT EXISTS idx_profiles_anonymous_mode ON public.profiles(anonymous_mode) WHERE anonymous_mode = false;

-- Issues - Add composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_issues_user_category ON public.issues(user_id, category);
CREATE INDEX IF NOT EXISTS idx_issues_status_created ON public.issues(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_issues_category_created ON public.issues(category, created_at DESC);

-- Votes - Add covering index
CREATE INDEX IF NOT EXISTS idx_votes_issue_user ON public.votes(issue_id, user_id);

-- Comments - Improve query performance
CREATE INDEX IF NOT EXISTS idx_comments_issue_created ON public.comments(issue_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);

-- Notifications - Add compound index for common query
CREATE INDEX IF NOT EXISTS idx_notifications_user_read_created ON public.notifications(user_id, read, created_at DESC);

-- ============================================================================
-- ADD MISSING COLUMNS TO ISSUE_METRICS
-- ============================================================================

DO $$
BEGIN
  -- Add views column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = 'public'
                 AND table_name = 'issue_metrics'
                 AND column_name = 'views') THEN
    ALTER TABLE public.issue_metrics ADD COLUMN views INTEGER DEFAULT 0;
  END IF;
END $$;

-- ============================================================================
-- IMPROVE VOTE TRIGGER PERFORMANCE
-- ============================================================================

-- Update vote counts in issue_metrics when votes change
CREATE OR REPLACE FUNCTION update_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment the appropriate counter
    IF NEW.vote = 1 THEN
      UPDATE public.issue_metrics
      SET upvotes = upvotes + 1, updated_at = NOW()
      WHERE issue_id = NEW.issue_id;
    ELSIF NEW.vote = -1 THEN
      UPDATE public.issue_metrics
      SET downvotes = downvotes + 1, updated_at = NOW()
      WHERE issue_id = NEW.issue_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle vote change (upvote to downvote or vice versa)
    IF OLD.vote != NEW.vote THEN
      UPDATE public.issue_metrics
      SET
        upvotes = upvotes + CASE WHEN NEW.vote = 1 THEN 1 ELSE -1 END,
        downvotes = downvotes + CASE WHEN NEW.vote = -1 THEN 1 ELSE -1 END,
        updated_at = NOW()
      WHERE issue_id = NEW.issue_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement the appropriate counter
    IF OLD.vote = 1 THEN
      UPDATE public.issue_metrics
      SET upvotes = GREATEST(0, upvotes - 1), updated_at = NOW()
      WHERE issue_id = OLD.issue_id;
    ELSIF OLD.vote = -1 THEN
      UPDATE public.issue_metrics
      SET downvotes = GREATEST(0, downvotes - 1), updated_at = NOW()
      WHERE issue_id = OLD.issue_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop old trigger if exists and create new one
DROP TRIGGER IF EXISTS on_vote_change ON public.votes;
CREATE TRIGGER on_vote_change
  AFTER INSERT OR UPDATE OR DELETE ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION update_vote_counts();

-- ============================================================================
-- UPDATE USER STATS TRIGGERS
-- ============================================================================

-- Update user stats when they create an issue
CREATE OR REPLACE FUNCTION update_user_stats_on_issue()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.user_stats
    SET total_posts = total_posts + 1, updated_at = NOW()
    WHERE user_id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.user_stats
    SET total_posts = GREATEST(0, total_posts - 1), updated_at = NOW()
    WHERE user_id = OLD.user_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_issue_user_stats ON public.issues;
CREATE TRIGGER on_issue_user_stats
  AFTER INSERT OR DELETE ON public.issues
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats_on_issue();

-- Update user stats when they get upvotes
CREATE OR REPLACE FUNCTION update_user_stats_on_vote()
RETURNS TRIGGER AS $$
DECLARE
  issue_owner UUID;
BEGIN
  -- Get the owner of the issue being voted on
  SELECT user_id INTO issue_owner FROM public.issues WHERE id = NEW.issue_id;

  IF TG_OP = 'INSERT' AND NEW.vote = 1 THEN
    UPDATE public.user_stats
    SET total_upvotes = total_upvotes + 1, updated_at = NOW()
    WHERE user_id = issue_owner;
  ELSIF TG_OP = 'DELETE' AND OLD.vote = 1 THEN
    UPDATE public.user_stats
    SET total_upvotes = GREATEST(0, total_upvotes - 1), updated_at = NOW()
    WHERE user_id = issue_owner;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_vote_user_stats ON public.votes;
CREATE TRIGGER on_vote_user_stats
  AFTER INSERT OR DELETE ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats_on_vote();

-- Update user stats when they comment
CREATE OR REPLACE FUNCTION update_user_stats_on_comment()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.user_stats
    SET total_comments = total_comments + 1, updated_at = NOW()
    WHERE user_id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.user_stats
    SET total_comments = GREATEST(0, total_comments - 1), updated_at = NOW()
    WHERE user_id = OLD.user_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_comment_user_stats ON public.comments;
CREATE TRIGGER on_comment_user_stats
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats_on_comment();

-- ============================================================================
-- MATERIALIZED VIEW FOR TRENDING ISSUES
-- ============================================================================

-- Create a materialized view for trending issues (refreshed periodically)
CREATE MATERIALIZED VIEW IF NOT EXISTS trending_issues AS
SELECT
  i.id,
  i.title,
  i.category,
  i.created_at,
  i.location,
  i.address,
  m.upvotes,
  m.comments,
  m.shares,
  m.twitter_impressions,
  -- Trending score: weighted combination of recent engagement
  (
    m.upvotes * 2 +
    m.comments * 3 +
    m.shares * 5 +
    COALESCE(m.twitter_impressions / 100, 0) +
    -- Recency boost (issues from last 7 days get bonus)
    CASE
      WHEN i.created_at > NOW() - INTERVAL '7 days' THEN 10
      WHEN i.created_at > NOW() - INTERVAL '30 days' THEN 5
      ELSE 0
    END
  ) as trending_score
FROM public.issues i
JOIN public.issue_metrics m ON i.id = m.issue_id
WHERE i.moderation_status = 'active'
ORDER BY trending_score DESC;

-- Index on the materialized view
CREATE INDEX IF NOT EXISTS idx_trending_score ON trending_issues(trending_score DESC);
CREATE INDEX IF NOT EXISTS idx_trending_category ON trending_issues(category, trending_score DESC);

-- Function to refresh trending issues
CREATE OR REPLACE FUNCTION refresh_trending_issues()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY trending_issues;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- HELPER FUNCTION: Get User with Stats
-- ============================================================================

CREATE OR REPLACE FUNCTION get_user_with_stats(user_id UUID)
RETURNS TABLE (
  id UUID,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  city TEXT,
  state TEXT,
  is_verified BOOLEAN,
  verification_type verification_type,
  total_posts INTEGER,
  total_upvotes INTEGER,
  total_comments INTEGER,
  total_shares INTEGER,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    p.username,
    p.full_name,
    p.avatar_url,
    p.bio,
    p.city,
    p.state,
    u.is_verified,
    u.verification_type,
    COALESCE(s.total_posts, 0) as total_posts,
    COALESCE(s.total_upvotes, 0) as total_upvotes,
    COALESCE(s.total_comments, 0) as total_comments,
    COALESCE(s.total_shares, 0) as total_shares,
    u.created_at
  FROM public.users u
  LEFT JOIN public.profiles p ON u.id = p.id
  LEFT JOIN public.user_stats s ON u.id = s.user_id
  WHERE u.id = user_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- HELPER FUNCTION: Get Issue with Full Details
-- ============================================================================

CREATE OR REPLACE FUNCTION get_issue_with_details(issue_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  username TEXT,
  user_avatar TEXT,
  title TEXT,
  description TEXT,
  category issue_category,
  photos TEXT[],
  location GEOGRAPHY,
  address TEXT,
  geohash TEXT,
  privacy twitter_posting_method,
  anonymous_username TEXT,
  upvotes INTEGER,
  downvotes INTEGER,
  comments INTEGER,
  shares INTEGER,
  twitter_impressions INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.id,
    i.user_id,
    p.username,
    p.avatar_url as user_avatar,
    i.title,
    i.description,
    i.category,
    i.photos,
    i.location,
    i.address,
    i.geohash,
    i.privacy,
    i.anonymous_username,
    m.upvotes,
    m.downvotes,
    m.comments,
    m.shares,
    m.twitter_impressions,
    i.created_at,
    i.updated_at
  FROM public.issues i
  LEFT JOIN public.profiles p ON i.user_id = p.id
  LEFT JOIN public.issue_metrics m ON i.id = m.issue_id
  WHERE i.id = issue_id
  AND i.moderation_status = 'active';
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- CLEANUP ORPHANED RECORDS
-- ============================================================================

-- Delete orphaned user_stats (where user doesn't exist)
DELETE FROM public.user_stats
WHERE user_id NOT IN (SELECT id FROM public.users);

-- Delete orphaned user_preferences (where user doesn't exist)
DELETE FROM public.user_preferences
WHERE user_id NOT IN (SELECT id FROM public.users);

-- Delete orphaned issue_metrics (where issue doesn't exist)
DELETE FROM public.issue_metrics
WHERE issue_id NOT IN (SELECT id FROM public.issues);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON MATERIALIZED VIEW trending_issues IS 'Cached trending issues with weighted scoring. Refresh periodically using refresh_trending_issues()';
COMMENT ON FUNCTION refresh_trending_issues() IS 'Refreshes the trending_issues materialized view. Should be called every 15-30 minutes';
COMMENT ON FUNCTION get_user_with_stats(UUID) IS 'Returns complete user profile with statistics in a single query';
COMMENT ON FUNCTION get_issue_with_details(UUID) IS 'Returns complete issue details with metrics and user info in a single query';
