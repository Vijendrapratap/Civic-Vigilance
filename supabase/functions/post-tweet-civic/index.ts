// Supabase Edge Function: Post Tweet from @CivicVigilance Account
// This function posts tweets to Twitter from the official Civic Vigilance account

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') || 'https://civicvigilance.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TweetRequest {
  text: string;
  imageUrl?: string;
  reporterId: string;
  reporterName: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the user is authenticated via Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { text, imageUrl, reporterId, reporterName }: TweetRequest = await req.json();

    // Validate input
    if (!text || !reporterId || !reporterName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: text, reporterId, reporterName' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate tweet text length
    const tweetText = `${text}\n\nReported by: ${reporterName}`;
    if (tweetText.length > 280) {
      return new Response(
        JSON.stringify({ error: 'Tweet text exceeds 280 character limit' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Twitter credentials from Supabase secrets
    const TWITTER_API_KEY = Deno.env.get('TWITTER_API_KEY')!;
    const TWITTER_API_SECRET = Deno.env.get('TWITTER_API_SECRET')!;
    const TWITTER_ACCESS_TOKEN = Deno.env.get('TWITTER_ACCESS_TOKEN')!;
    const TWITTER_ACCESS_TOKEN_SECRET = Deno.env.get('TWITTER_ACCESS_TOKEN_SECRET')!;

    if (!TWITTER_API_KEY || !TWITTER_API_SECRET || !TWITTER_ACCESS_TOKEN || !TWITTER_ACCESS_TOKEN_SECRET) {
      console.error('Twitter credentials not configured');
      return new Response(
        JSON.stringify({ error: 'Service temporarily unavailable' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Post tweet using Twitter API v2
    const tweetResponse = await postTweet(
      tweetText,
      imageUrl,
      TWITTER_API_KEY,
      TWITTER_API_SECRET,
      TWITTER_ACCESS_TOKEN,
      TWITTER_ACCESS_TOKEN_SECRET
    );

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        tweetId: tweetResponse.id,
        tweetUrl: `https://twitter.com/CivicVigilance/status/${tweetResponse.id}`,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error posting tweet:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to post tweet. Please try again later.',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to post tweet to Twitter API
async function postTweet(
  text: string,
  imageUrl: string | undefined,
  apiKey: string,
  apiSecret: string,
  accessToken: string,
  accessTokenSecret: string
) {
  // Step 1: Upload media if imageUrl provided
  let mediaId: string | undefined;
  if (imageUrl) {
    try {
      // Validate URL before fetching
      const url = new URL(imageUrl);
      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('Invalid image URL protocol');
      }

      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) throw new Error('Failed to download image');

      const contentType = imageResponse.headers.get('content-type') || '';
      if (!contentType.startsWith('image/')) {
        throw new Error('URL does not point to an image');
      }

      const imageBlob = await imageResponse.blob();

      // Size check (5MB max for Twitter)
      if (imageBlob.size > 5 * 1024 * 1024) {
        console.error('Image too large for Twitter upload');
      }

      const formData = new FormData();
      formData.append('media', imageBlob);

      // Note: Full media upload requires OAuth 1.0a signing
      console.log('Media upload not yet implemented - posting text only');
    } catch (error) {
      console.error('Error processing media:', error);
      // Continue without image
    }
  }

  // Step 2: Post tweet
  const tweetData = {
    text: text,
    ...(mediaId && { media: { media_ids: [mediaId] } }),
  };

  // Make authenticated request to Twitter API v2
  const bearerToken = Deno.env.get('TWITTER_BEARER_TOKEN');

  const response = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tweetData),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Twitter API error:', errorData);
    throw new Error('Failed to post tweet');
  }

  const result = await response.json();
  return result.data;
}
