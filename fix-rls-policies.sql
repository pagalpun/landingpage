-- Fix RLS policies for waitlist_signups table

-- First, let's see what policies exist
-- SELECT schemaname, tablename, policyname, roles, cmd, qual FROM pg_policies WHERE tablename = 'waitlist_signups';

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Anyone can insert waitlist signup" ON waitlist_signups;
DROP POLICY IF EXISTS "Anonymous users can insert waitlist signup" ON waitlist_signups;
DROP POLICY IF EXISTS "Authenticated users can insert waitlist signup" ON waitlist_signups;
DROP POLICY IF EXISTS "Service role can view all waitlist signups" ON waitlist_signups;

-- Disable RLS temporarily to ensure we can recreate policies
ALTER TABLE waitlist_signups DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Create a single, simple policy that allows public access for INSERT
CREATE POLICY "Public can insert waitlist signups"
ON waitlist_signups
FOR INSERT
TO public
WITH CHECK (true);

-- Create a policy for service role to SELECT
CREATE POLICY "Service role can select waitlist signups"
ON waitlist_signups
FOR SELECT
TO service_role
USING (true);

-- Grant necessary permissions to anon role
GRANT INSERT ON waitlist_signups TO anon;
GRANT USAGE ON SCHEMA public TO anon;

-- Test query to verify the policy works (run this after the above)
-- INSERT INTO waitlist_signups (email, instagram_handle, goals) 
-- VALUES ('test@example.com', 'testuser', 'test goals');