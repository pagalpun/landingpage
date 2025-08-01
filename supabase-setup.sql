-- Create waitlist_signups table
CREATE TABLE IF NOT EXISTS waitlist_signups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  instagram_handle text NOT NULL UNIQUE,
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

-- Create policy for insert (anonymous users can sign up)
CREATE POLICY "Anonymous users can insert waitlist signup" 
ON waitlist_signups FOR INSERT 
TO anon
WITH CHECK (true);

-- Create policy for authenticated users to insert
CREATE POLICY "Authenticated users can insert waitlist signup" 
ON waitlist_signups FOR INSERT 
TO authenticated
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

-- Create page_analytics table
CREATE TABLE IF NOT EXISTS page_analytics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  user_id text,
  event_type text NOT NULL,
  page_url text,
  user_agent text,
  ip_address inet,
  referrer text,
  utm_params jsonb,
  custom_properties jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Create indexes for analytics table
CREATE INDEX IF NOT EXISTS idx_analytics_session ON page_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON page_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON page_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_utm ON page_analytics USING GIN (utm_params);

-- Enable RLS for analytics table
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;

-- Create policy for analytics insert (anyone can track)
CREATE POLICY "Anyone can insert analytics data" 
ON page_analytics FOR INSERT 
WITH CHECK (true);

-- Create policy for analytics select (only service role can view)
CREATE POLICY "Service role can view analytics data" 
ON page_analytics FOR SELECT 
USING (auth.role() = 'service_role');

-- Create a view for waitlist analytics
CREATE OR REPLACE VIEW waitlist_analytics AS
SELECT 
    DATE(created_at) as signup_date,
    COUNT(*) as daily_signups,
    COUNT(CASE WHEN priority_score > 5 THEN 1 END) as high_priority_signups,
    AVG(LENGTH(goals)) as avg_goals_length
FROM waitlist_signups 
GROUP BY DATE(created_at)
ORDER BY signup_date DESC;

-- Create a view for page analytics
CREATE OR REPLACE VIEW page_analytics_summary AS
SELECT 
    DATE(created_at) as date,
    event_type,
    COUNT(*) as event_count,
    COUNT(DISTINCT session_id) as unique_sessions,
    COUNT(DISTINCT ip_address) as unique_visitors
FROM page_analytics 
GROUP BY DATE(created_at), event_type
ORDER BY date DESC, event_count DESC;

-- Create a view for conversion funnel
CREATE OR REPLACE VIEW conversion_funnel AS
WITH funnel_data AS (
    SELECT 
        DATE(created_at) as date,
        session_id,
        MAX(CASE WHEN event_type = 'page_view' THEN 1 ELSE 0 END) as viewed_page,
        MAX(CASE WHEN event_type = 'form_field_focus' THEN 1 ELSE 0 END) as engaged_form,
        MAX(CASE WHEN event_type = 'waitlist_signup_success' THEN 1 ELSE 0 END) as completed_signup
    FROM page_analytics 
    GROUP BY DATE(created_at), session_id
)
SELECT 
    date,
    SUM(viewed_page) as page_views,
    SUM(engaged_form) as form_engagements,
    SUM(completed_signup) as signups,
    ROUND(100.0 * SUM(engaged_form) / NULLIF(SUM(viewed_page), 0), 2) as engagement_rate,
    ROUND(100.0 * SUM(completed_signup) / NULLIF(SUM(engaged_form), 0), 2) as conversion_rate
FROM funnel_data 
GROUP BY date
ORDER BY date DESC;