-- Row Level Security (RLS) Policies for CivicVigilance
-- Ensures users can only access data they're authorized to see

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_twitter_posts ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Users can view all PUBLIC profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.users FOR SELECT
  USING (true);

-- Users can insert their own profile (via trigger from auth.users)
CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- USER_STATS TABLE POLICIES
-- ============================================================================

-- Anyone can view user stats (for leaderboards, profiles, etc.)
CREATE POLICY "User stats are viewable by everyone"
  ON public.user_stats FOR SELECT
  USING (true);

-- System can update user stats (stats are auto-computed)
CREATE POLICY "System can update user stats"
  ON public.user_stats FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- USER_PREFERENCES TABLE POLICIES
-- ============================================================================

-- Users can view only their own preferences
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update only their own preferences
CREATE POLICY "Users can update own preferences"
  ON public.user_preferences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- ISSUES TABLE POLICIES
-- ============================================================================

-- Anyone can view ACTIVE (not hidden/removed) issues
CREATE POLICY "Active issues are viewable by everyone"
  ON public.issues FOR SELECT
  USING (moderation_status = 'active');

-- Users can view their own issues (even if hidden/removed)
CREATE POLICY "Users can view own issues"
  ON public.issues FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can create issues
CREATE POLICY "Authenticated users can create issues"
  ON public.issues FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own issues
CREATE POLICY "Users can update own issues"
  ON public.issues FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own issues
CREATE POLICY "Users can delete own issues"
  ON public.issues FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- ISSUE_METRICS TABLE POLICIES
-- ============================================================================

-- Anyone can view issue metrics (public engagement data)
CREATE POLICY "Issue metrics are viewable by everyone"
  ON public.issue_metrics FOR SELECT
  USING (true);

-- System/triggers can update metrics
CREATE POLICY "System can update issue metrics"
  ON public.issue_metrics FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- VOTES TABLE POLICIES
-- ============================================================================

-- Users can view all votes (for displaying vote counts)
CREATE POLICY "Votes are viewable by everyone"
  ON public.votes FOR SELECT
  USING (true);

-- Authenticated users can insert votes
CREATE POLICY "Authenticated users can vote"
  ON public.votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own votes (change vote)
CREATE POLICY "Users can update own votes"
  ON public.votes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own votes (remove vote)
CREATE POLICY "Users can delete own votes"
  ON public.votes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- COMMENTS TABLE POLICIES
-- ============================================================================

-- Anyone can view comments on active issues
CREATE POLICY "Comments are viewable by everyone"
  ON public.comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.issues
      WHERE id = comments.issue_id
      AND moderation_status = 'active'
    )
  );

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can comment"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update own comments"
  ON public.comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- AUTHORITIES TABLE POLICIES
-- ============================================================================

-- Anyone can view active authorities (needed for reporting flow)
CREATE POLICY "Active authorities are viewable by everyone"
  ON public.authorities FOR SELECT
  USING (status = 'active');

-- Only admins can modify authorities (handled via service role)
-- No INSERT/UPDATE/DELETE policies for regular users

-- ============================================================================
-- NOTIFICATIONS TABLE POLICIES
-- ============================================================================

-- Users can view only their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

-- System can create notifications for users
CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- PENDING_TWITTER_POSTS TABLE POLICIES
-- ============================================================================

-- Users can view their own pending posts
CREATE POLICY "Users can view own pending posts"
  ON public.pending_twitter_posts FOR SELECT
  USING (auth.uid() = user_id);

-- System can create pending posts
CREATE POLICY "System can create pending posts"
  ON public.pending_twitter_posts FOR INSERT
  WITH CHECK (true);

-- System can update pending posts (processing, errors, etc.)
CREATE POLICY "System can update pending posts"
  ON public.pending_twitter_posts FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- STORAGE POLICIES (for image uploads)
-- ============================================================================

-- Create storage bucket for issue photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('issue-photos', 'issue-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone can view issue photos (public bucket)
CREATE POLICY "Issue photos are publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'issue-photos');

-- Authenticated users can upload issue photos
CREATE POLICY "Authenticated users can upload issue photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'issue-photos'
    AND auth.role() = 'authenticated'
  );

-- Users can delete their own photos
-- (Use naming convention: {user_id}/{timestamp}.jpg)
CREATE POLICY "Users can delete own photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'issue-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
