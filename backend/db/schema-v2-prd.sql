-- CivicVigilance PRD-Aligned Schema v2
-- This schema removes resolution tracking and adds PRD features:
-- - Username selection (Anonymous_Citizen_XXXX)
-- - 3-tier privacy system
-- - Authority tagging
-- - Multiple photos per report
-- - Engagement metrics (not resolution metrics)

-- ============================================
-- USERS & PROFILES (PRD Section 7.2)
-- ============================================

-- Updated profiles table with username selection
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,

  -- USERNAME SELECTION (PRD 5.1.1)
  username TEXT NOT NULL UNIQUE, -- "Anonymous_Citizen_4738" or custom
  anonymous_mode BOOLEAN NOT NULL DEFAULT true,
  display_name TEXT, -- Real name (optional)

  avatar_url TEXT,
  bio TEXT,
  city TEXT,
  state TEXT,
  home_lat DOUBLE PRECISION,
  home_lng DOUBLE PRECISION,

  -- Connected accounts
  google_connected BOOLEAN DEFAULT false,
  twitter_connected BOOLEAN DEFAULT false,
  twitter_handle TEXT,
  twitter_user_id TEXT,

  -- Privacy & Amplification preferences (PRD 5.2 Stage 3)
  privacy_default TEXT DEFAULT 'civic_vigilance' CHECK (privacy_default IN ('civic_vigilance', 'personal', 'none')),
  always_ask_twitter_method BOOLEAN DEFAULT true,

  -- Verification (v1.5 - PRD 16.5)
  is_verified BOOLEAN DEFAULT false,
  verification_type TEXT CHECK (verification_type IN ('journalist', 'rwa', 'ngo', 'official')),

  -- Statistics (ENGAGEMENT, not resolution - PRD 1.2)
  total_posts INTEGER DEFAULT 0,
  total_upvotes INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  total_shares INTEGER DEFAULT 0,

  -- Notification preferences (PRD 5.7.1)
  notif_nearby BOOLEAN DEFAULT true,
  notif_comments BOOLEAN DEFAULT true,
  notif_upvotes BOOLEAN DEFAULT true,
  notif_replies BOOLEAN DEFAULT true,
  notif_twitter BOOLEAN DEFAULT true,
  notif_digest BOOLEAN DEFAULT true,
  notif_trending BOOLEAN DEFAULT false,
  notif_similar BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Unique constraint on usernames (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_lower_idx ON profiles (LOWER(username));

-- ============================================
-- REPORTS (PRD Section 7.2)
-- ============================================

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Content
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'pothole', 'garbage', 'streetlight', 'drainage', 'water_supply',
    'sewage', 'traffic_signal', 'encroachment', 'stray_animals', 'parks', 'other'
  )),

  -- Multiple photos (up to 3 - PRD 5.2 Stage 1)
  photos JSONB DEFAULT '[]'::jsonb, -- Array of Firebase Storage URLs

  -- Location (full address - PRD 5.2 Stage 2D)
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  address TEXT NOT NULL, -- "Casa Rio Gold Road, Kalyan, Maharashtra, 421204"
  geohash TEXT NOT NULL, -- For geospatial queries

  -- Privacy & Amplification (PRD 5.2 Stage 3 - THE KEY FEATURE)
  privacy TEXT NOT NULL DEFAULT 'civic_vigilance' CHECK (privacy IN ('civic_vigilance', 'personal', 'none')),
  twitter_handle TEXT, -- Which handle posted (for display)
  authorities JSONB DEFAULT '[]'::jsonb, -- Array of @handles

  -- Twitter posting metadata
  tweet_id TEXT,
  tweet_url TEXT,

  -- Posting status (NOT resolution - we don't track if authorities fixed it!)
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'posted', 'failed')),

  -- Anonymous username (PRD 5.1.1)
  anonymous_username TEXT NOT NULL, -- Display name for this post

  -- Engagement metrics (PRD 5.3.2 - what we DO measure)
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  twitter_impressions INTEGER, -- Fetched via API every 6h

  -- Moderation (PRD 5.1)
  flagged BOOLEAN DEFAULT false,
  reviewed BOOLEAN DEFAULT false,
  moderation_status TEXT DEFAULT 'active' CHECK (moderation_status IN ('active', 'hidden', 'removed')),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS reports_created_at_idx ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS reports_user_id_idx ON reports(user_id);
CREATE INDEX IF NOT EXISTS reports_category_idx ON reports(category);
CREATE INDEX IF NOT EXISTS reports_geohash_idx ON reports(geohash);
CREATE INDEX IF NOT EXISTS reports_status_idx ON reports(status);
CREATE INDEX IF NOT EXISTS reports_score_idx ON reports((upvotes - downvotes) DESC);

-- ============================================
-- AUTHORITIES (PRD Section 7.3)
-- ============================================

CREATE TABLE IF NOT EXISTS authorities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_local TEXT,

  -- Twitter
  twitter_handle TEXT NOT NULL,
  twitter_verified BOOLEAN DEFAULT false,
  twitter_active BOOLEAN DEFAULT true,
  twitter_last_checked TIMESTAMP WITH TIME ZONE,

  -- Jurisdiction (geohash-based - PRD 7.3)
  jurisdiction_type TEXT CHECK (jurisdiction_type IN ('national', 'state', 'city', 'ward', 'department')),
  jurisdiction_level INTEGER, -- 1=national, 2=state, 3=city, 4=ward
  country TEXT DEFAULT 'India',
  state TEXT,
  city TEXT,
  ward INTEGER,
  zone TEXT,
  geohashes JSONB DEFAULT '[]'::jsonb, -- Array of geohash prefixes

  -- Issue categories this authority handles
  issue_categories JSONB DEFAULT '[]'::jsonb,

  -- Priority (1=primary, 2=secondary, 3=fallback)
  priority INTEGER DEFAULT 2,

  -- Contact info
  contact_email TEXT,
  contact_phone TEXT,
  contact_website TEXT,

  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  verified_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS authorities_city_idx ON authorities(city);
CREATE INDEX IF NOT EXISTS authorities_state_idx ON authorities(state);
CREATE INDEX IF NOT EXISTS authorities_status_idx ON authorities(status);

-- ============================================
-- VOTES (unchanged - already good)
-- ============================================

CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  value SMALLINT NOT NULL CHECK (value IN (-1, 1)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, report_id)
);

CREATE INDEX IF NOT EXISTS votes_report_id_idx ON votes(report_id);

-- Trigger to update report vote counters
CREATE OR REPLACE FUNCTION update_report_vote_counters() RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    IF (NEW.value = 1) THEN
      UPDATE reports SET upvotes = upvotes + 1 WHERE id = NEW.report_id;
    ELSE
      UPDATE reports SET downvotes = downvotes + 1 WHERE id = NEW.report_id;
    END IF;
  ELSIF (TG_OP = 'UPDATE') THEN
    IF (OLD.value <> NEW.value) THEN
      IF (NEW.value = 1) THEN
        UPDATE reports SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id = NEW.report_id;
      ELSE
        UPDATE reports SET upvotes = upvotes - 1, downvotes = downvotes + 1 WHERE id = NEW.report_id;
      END IF;
    END IF;
  ELSIF (TG_OP = 'DELETE') THEN
    IF (OLD.value = 1) THEN
      UPDATE reports SET upvotes = upvotes - 1 WHERE id = OLD.report_id;
    ELSE
      UPDATE reports SET downvotes = downvotes - 1 WHERE id = OLD.report_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS votes_aggregate ON votes;
CREATE TRIGGER votes_aggregate AFTER INSERT OR UPDATE OR DELETE ON votes
FOR EACH ROW EXECUTE FUNCTION update_report_vote_counters();

-- ============================================
-- COMMENTS (updated with nested support)
-- ============================================

CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  edited BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS comments_report_id_idx ON comments(report_id);
CREATE INDEX IF NOT EXISTS comments_parent_id_idx ON comments(parent_id);

-- ============================================
-- PENDING TWITTER POSTS (offline queue)
-- ============================================

CREATE TABLE IF NOT EXISTS pending_twitter_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  method TEXT NOT NULL CHECK (method IN ('civic_vigilance', 'personal')),
  tweet_text TEXT NOT NULL,
  image_url TEXT,
  authorities JSONB DEFAULT '[]'::jsonb,
  attempts INTEGER DEFAULT 0,
  last_attempt_at TIMESTAMP WITH TIME ZONE,
  error TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'success', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS pending_twitter_status_idx ON pending_twitter_posts(status);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE authorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_twitter_posts ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Profiles viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Reports
CREATE POLICY "Reports viewable by everyone (except removed)" ON reports FOR SELECT USING (moderation_status != 'removed');
CREATE POLICY "Authenticated can create reports" ON reports FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own reports" ON reports FOR UPDATE USING (auth.uid() = user_id);

-- Votes
CREATE POLICY "Authenticated can vote" ON votes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update own votes" ON votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Votes viewable by everyone" ON votes FOR SELECT USING (true);

-- Comments
CREATE POLICY "Comments viewable by everyone" ON comments FOR SELECT USING (true);
CREATE POLICY "Authenticated can add comments" ON comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);

-- Authorities
CREATE POLICY "Authorities viewable by everyone" ON authorities FOR SELECT USING (status = 'active');

-- Pending Twitter Posts
CREATE POLICY "Users can view own pending posts" ON pending_twitter_posts FOR SELECT USING (auth.uid() = user_id);
