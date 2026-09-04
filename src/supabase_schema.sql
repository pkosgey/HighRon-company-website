-- HighRon Tech Space - Supabase Database Schema
-- Run this in your Supabase Dashboard -> SQL Editor -> New Query

-- 1. Create community_messages table
CREATE TABLE IF NOT EXISTS public.community_messages (
    id TEXT PRIMARY KEY,
    user_name TEXT NOT NULL,
    user_email TEXT,
    channel TEXT NOT NULL DEFAULT 'general',
    text TEXT NOT NULL,
    avatar TEXT,
    timestamp TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS and add public access policies for community_messages
ALTER TABLE public.community_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read community_messages" ON public.community_messages;
CREATE POLICY "Allow public read community_messages" ON public.community_messages FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert community_messages" ON public.community_messages;
CREATE POLICY "Allow public insert community_messages" ON public.community_messages FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update community_messages" ON public.community_messages;
CREATE POLICY "Allow public update community_messages" ON public.community_messages FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public delete community_messages" ON public.community_messages;
CREATE POLICY "Allow public delete community_messages" ON public.community_messages FOR DELETE USING (true);

-- 2. Create community_channels table
CREATE TABLE IF NOT EXISTS public.community_channels (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS and add public access policies for community_channels
ALTER TABLE public.community_channels ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read community_channels" ON public.community_channels;
CREATE POLICY "Allow public read community_channels" ON public.community_channels FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert community_channels" ON public.community_channels;
CREATE POLICY "Allow public insert community_channels" ON public.community_channels FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update community_channels" ON public.community_channels;
CREATE POLICY "Allow public update community_channels" ON public.community_channels FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public delete community_channels" ON public.community_channels;
CREATE POLICY "Allow public delete community_channels" ON public.community_channels FOR DELETE USING (true);

-- Insert default channels if not present
INSERT INTO public.community_channels (name) VALUES ('general'), ('tech'), ('security'), ('random')
ON CONFLICT (name) DO NOTHING;

-- 3. Create community_resources table
CREATE TABLE IF NOT EXISTS public.community_resources (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'learning',
    type TEXT NOT NULL DEFAULT 'guide',
    rating NUMERIC DEFAULT 5.0,
    learners INT DEFAULT 1,
    duration TEXT DEFAULT '45m',
    description TEXT,
    content TEXT,
    video_url TEXT,
    ai_verified BOOLEAN DEFAULT true,
    posted_by TEXT DEFAULT 'Admin Ronald',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS and add public access policies for community_resources
ALTER TABLE public.community_resources ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read community_resources" ON public.community_resources;
CREATE POLICY "Allow public read community_resources" ON public.community_resources FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert community_resources" ON public.community_resources;
CREATE POLICY "Allow public insert community_resources" ON public.community_resources FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update community_resources" ON public.community_resources;
CREATE POLICY "Allow public update community_resources" ON public.community_resources FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public delete community_resources" ON public.community_resources;
CREATE POLICY "Allow public delete community_resources" ON public.community_resources FOR DELETE USING (true);
