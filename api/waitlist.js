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
    const { email, instagram, goals, source = 'landing-page' } = req.body;

    // Validate required fields
    if (!email || !instagram || !goals) {
      return res.status(400).json({ 
        error: 'Missing required fields: email, instagram, goals' 
      });
    }

    // Clean Instagram handle (remove @ if present)
    const cleanInstagram = instagram.replace('@', '');

    // Get client info for tracking
    const userAgent = req.headers['user-agent'] || '';
    const referrer = req.headers.referer || '';
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Insert into Supabase
    const { data, error } = await supabase
      .from('waitlist_signups')
      .insert([
        {
          email: email.toLowerCase().trim(),
          instagram_handle: cleanInstagram,
          goals: goals.trim(),
          source,
          ip_address: clientIP,
          user_agent: userAgent,
          referrer,
          status: 'pending',
          priority_score: goals.length > 100 ? 10 : 5, // Higher priority for detailed responses
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      
      // Handle unique constraint violation (duplicate email)
      if (error.code === '23505') {
        return res.status(409).json({ 
          error: 'Email already registered for waitlist' 
        });
      }
      
      return res.status(500).json({ 
        error: 'Failed to save signup data' 
      });
    }

    // Return success
    res.status(201).json({ 
      success: true, 
      message: 'Successfully joined waitlist!',
      id: data[0].id 
    });

  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
}