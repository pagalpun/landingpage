-- Create waitlist_signups table
CREATE TABLE IF NOT EXISTS waitlist_signups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  instagram_handle text NOT NULL,
  goals text NOT NULL,
  source text DEFAULT 'landing-page',
  ip_address inet,
  user_agent text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'onboarded', 'declined')),
  priority_score integer DEFAULT 0,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist_signups(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist_signups(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist_signups(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_priority ON waitlist_signups(priority_score DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Create policy for insert (anyone can sign up)
CREATE POLICY "Anyone can insert waitlist signup" 
ON waitlist_signups FOR INSERT 
WITH CHECK (true);

-- Create policy for select (only service role can view all)
CREATE POLICY "Service role can view all waitlist signups" 
ON waitlist_signups FOR SELECT 
USING (auth.role() = 'service_role');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_waitlist_signups_updated_at 
    BEFORE UPDATE ON waitlist_signups 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create a view for analytics (optional)
CREATE OR REPLACE VIEW waitlist_analytics AS
SELECT 
    DATE(created_at) as signup_date,
    COUNT(*) as daily_signups,
    COUNT(CASE WHEN priority_score > 5 THEN 1 END) as high_priority_signups,
    AVG(LENGTH(goals)) as avg_goals_length
FROM waitlist_signups 
GROUP BY DATE(created_at)
ORDER BY signup_date DESC;