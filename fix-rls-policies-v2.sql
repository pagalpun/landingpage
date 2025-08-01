-- Fix RLS policies for waitlist_signups table - Version 2
-- The issue is that .select() requires SELECT permission for anon role

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Anyone can insert waitlist signup" ON waitlist_signups;
DROP POLICY IF EXISTS "Anonymous users can insert waitlist signup" ON waitlist_signups;
DROP POLICY IF EXISTS "Authenticated users can insert waitlist signup" ON waitlist_signups;
DROP POLICY IF EXISTS "Service role can view all waitlist signups" ON waitlist_signups;
DROP POLICY IF EXISTS "Public can insert waitlist signups" ON waitlist_signups;
DROP POLICY IF EXISTS "Service role can select waitlist signups" ON waitlist_signups;

-- Disable and re-enable RLS
ALTER TABLE waitlist_signups DISABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Create policies that allow public INSERT and SELECT for the inserted row
CREATE POLICY "Public can insert waitlist signups"
ON waitlist_signups
FOR INSERT
TO public
WITH CHECK (true);

-- Allow anon to select their own inserted record (for .select() to work)
CREATE POLICY "Public can select waitlist signups"
ON waitlist_signups
FOR SELECT
TO public
USING (true);

-- Create a separate policy for service role to have full access
CREATE POLICY "Service role has full access"
ON waitlist_signups
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Grant necessary permissions
GRANT INSERT, SELECT ON waitlist_signups TO anon;
GRANT USAGE ON SCHEMA public TO anon;

-- Test with both insert and select
-- INSERT INTO waitlist_signups (email, instagram_handle, goals) 
-- VALUES ('test2@example.com', 'testuser2', 'test goals') RETURNING *;