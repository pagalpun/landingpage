import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { 
      event_type, 
      page_url, 
      properties = {},
      session_id,
      user_id 
    } = req.body;

    // Validate required fields
    if (!event_type) {
      return res.status(400).json({ 
        error: 'Missing required field: event_type' 
      });
    }

    // Get client info
    const userAgent = req.headers['user-agent'] || '';
    const referrer = req.headers.referer || '';
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // Extract UTM parameters from properties or URL
    const utmParams = {
      utm_source: properties.utm_source || null,
      utm_medium: properties.utm_medium || null,
      utm_campaign: properties.utm_campaign || null,
      utm_term: properties.utm_term || null,
      utm_content: properties.utm_content || null
    };

    // Insert analytics event into Supabase
    const { data, error } = await supabase
      .from('page_analytics')
      .insert([
        {
          session_id: session_id || generateSessionId(),
          user_id,
          event_type,
          page_url: page_url || referrer,
          user_agent: userAgent,
          ip_address: clientIP,
          referrer,
          utm_params: utmParams,
          custom_properties: properties,
        }
      ]);

    if (error) {
      console.error('Supabase analytics error:', error);
      return res.status(500).json({ 
        error: 'Failed to save analytics data' 
      });
    }

    res.status(201).json({ 
      success: true, 
      message: 'Analytics event recorded' 
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
}

// Generate a simple session ID
function generateSessionId() {
  return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}