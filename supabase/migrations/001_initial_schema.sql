-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES (extends auth.users - user preferences and app state)
-- ============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  categories TEXT[] DEFAULT '{}',
  streak INT DEFAULT 0,
  xp INT DEFAULT 0,
  badges TEXT[] DEFAULT '{}',
  current_league TEXT CHECK (current_league IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  league_xp INT DEFAULT 0,
  has_left_league BOOLEAN DEFAULT FALSE,
  age_range TEXT,
  cycle_status TEXT,
  birth_control TEXT,
  diagnosed_conditions TEXT[],
  medications TEXT,
  gi_priorities TEXT[],
  mental_health_focus TEXT[],
  goals TEXT[],
  education_preference TEXT CHECK (education_preference IN ('quick', 'deep')),
  accessibility_prefs JSONB DEFAULT '{}',
  consent_analytics BOOLEAN DEFAULT TRUE,
  consent_research BOOLEAN DEFAULT FALSE,
  completed_lessons TEXT[] DEFAULT '{}',
  unlocked_lessons TEXT[] DEFAULT '{"intro-hormones", "gut-brain-axis"}',
  is_pregnant BOOLEAN DEFAULT FALSE,
  pregnancy_mode BOOLEAN DEFAULT FALSE,
  adaptive_mode BOOLEAN DEFAULT FALSE
);

-- RLS for profiles: users can only read/write their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- CHECK_INS (daily health check-in data)
-- ============================================================================
CREATE TABLE check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  data JSONB NOT NULL
);

CREATE INDEX idx_check_ins_profile_created ON check_ins(profile_id, created_at DESC);

ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own check-ins"
  ON check_ins FOR ALL
  USING (auth.uid() = profile_id);

-- ============================================================================
-- FOOD_ENTRIES
-- ============================================================================
CREATE TABLE food_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  time TEXT NOT NULL,
  category TEXT NOT NULL,
  cuisine TEXT,
  amount TEXT
);

CREATE INDEX idx_food_entries_profile ON food_entries(profile_id, created_at DESC);

ALTER TABLE food_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own food entries"
  ON food_entries FOR ALL
  USING (auth.uid() = profile_id);

-- ============================================================================
-- PERIOD_DATA (one row per user - upsert pattern)
-- ============================================================================
CREATE TABLE period_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_period_start DATE NOT NULL,
  average_cycle_length INT NOT NULL,
  period_length INT NOT NULL,
  is_irregular BOOLEAN,
  cycle_variability TEXT,
  period_days TEXT[]
);

ALTER TABLE period_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own period data"
  ON period_data FOR ALL
  USING (auth.uid() = profile_id);

CREATE TRIGGER period_data_updated_at
  BEFORE UPDATE ON period_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- COMMUNITY (public read, authenticated write)
-- ============================================================================
CREATE TABLE community_topics (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  members_count INT DEFAULT 0,
  posts_count INT DEFAULT 0,
  description TEXT NOT NULL,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  online_count INT DEFAULT 0
);

-- Topics are readable by all (including anon for landing)
ALTER TABLE community_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read community topics"
  ON community_topics FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can update topic counts"
  ON community_topics FOR UPDATE
  TO authenticated
  USING (true);

-- Seed community topics
INSERT INTO community_topics (id, title, members_count, posts_count, description, color, icon, online_count) VALUES
  ('pcos', 'PCOS Support', 12400, 890, 'Share experiences and management strategies for PCOS', '#F487B6', '🎀', 234),
  ('endo', 'Endometriosis Warriors', 8900, 1240, 'Connect with others managing endometriosis', '#9E6B8E', '💜', 156),
  ('ibs', 'IBS & Gut Health', 15200, 2100, 'Discuss digestive health and cycle-related GI symptoms', '#4FB0AE', '🌿', 389),
  ('ttc', 'Trying to Conceive', 10500, 3400, 'Support for fertility journey and cycle tracking', '#C59FA8', '🤰', 278),
  ('perimenopause', 'Perimenopause & Menopause', 6700, 780, 'Navigate hormonal transitions together', '#FFC0D3', '🌸', 123),
  ('mental-health', 'Mental Health & Hormones', 9200, 1560, 'Discuss PMDD, anxiety, and mood changes', '#69C9C0', '🧠', 198);

-- Community posts
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id TEXT NOT NULL REFERENCES community_topics(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_badge TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  upvotes INT DEFAULT 0,
  views INT DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  flair TEXT
);

CREATE INDEX idx_community_posts_topic ON community_posts(topic_id, created_at DESC);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read community posts"
  ON community_posts FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

-- Comments
CREATE TABLE community_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_badge TEXT,
  parent_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  content TEXT NOT NULL,
  upvotes INT DEFAULT 0
);

CREATE INDEX idx_comments_post ON community_comments(post_id, created_at);
CREATE INDEX idx_comments_parent ON community_comments(parent_id);

ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comments"
  ON community_comments FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON community_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own comments"
  ON community_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

-- Post upvotes (for hasUpvoted tracking)
CREATE TABLE post_upvotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE post_upvotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own post upvotes"
  ON post_upvotes FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX idx_post_upvotes_post ON post_upvotes(post_id);

-- Comment upvotes
CREATE TABLE comment_upvotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID NOT NULL REFERENCES community_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

ALTER TABLE comment_upvotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own comment upvotes"
  ON comment_upvotes FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX idx_comment_upvotes_comment ON comment_upvotes(comment_id);

-- ============================================================================
-- TRIGGER: Create profile on signup
-- ============================================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, categories, streak, xp, badges, current_league, league_xp, has_left_league)
  VALUES (
    NEW.id,
    '{}', 0, 0, '{}', 'bronze', 0, FALSE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Only run if auth.users exists (Supabase has this by default)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
