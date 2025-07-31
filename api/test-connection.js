import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Check if environment variables are present
    const hasUrl = !!supabaseUrl;
    const hasKey = !!supabaseServiceKey;
    
    if (!hasUrl || !hasKey) {
      return res.status(500).json({
        error: 'Missing environment variables',
        debug: {
          hasUrl,
          hasKey,
          urlLength: supabaseUrl ? supabaseUrl.length : 0,
          keyLength: supabaseServiceKey ? supabaseServiceKey.length : 0,
        }
      });
    }

    // Try to create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Test connection by trying to count records in waitlist_signups
    const { data, error, count } = await supabase
      .from('waitlist_signups')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return res.status(500).json({
        error: 'Supabase connection failed',
        debug: {
          hasUrl,
          hasKey,
          supabaseError: error.message,
          supabaseCode: error.code,
          supabaseDetails: error.details,
        }
      });
    }

    // Connection successful
    res.status(200).json({
      success: true,
      message: 'Supabase connection working',
      debug: {
        hasUrl,
        hasKey,
        recordCount: count,
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('Test connection error:', error);
    res.status(500).json({
      error: 'Internal server error',
      debug: {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseServiceKey,
        errorMessage: error.message,
        errorStack: error.stack,
      }
    });
  }
}