
-- Create Instagram posts table
CREATE TABLE IF NOT EXISTS instagram_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS instagram_posts_created_at_idx ON instagram_posts(created_at);

-- Add RLS policies
ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;

-- Policy for public access (read-only)
CREATE POLICY instagram_posts_select_policy
  ON instagram_posts
  FOR SELECT
  USING (true);

-- Policy for authenticated users (full access)
CREATE POLICY instagram_posts_all_policy
  ON instagram_posts
  FOR ALL
  TO authenticated
  USING (true);
