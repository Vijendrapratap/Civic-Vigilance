// Supabase Edge Function: Post Tweet from @CivicVigilance Account
// This function posts tweets to Twitter from the official Civic Vigilance account

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
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
    // Parse request body
    const { text, imageUrl, reporterId, reporterName }: TweetRequest = await req.json();

    // Validate input
    if (!text || !reporterId || !reporterName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: text, reporterId, reporterName' }),
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
        JSON.stringify({ error: 'Twitter API credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Add reporter credit to tweet text
    const tweetText = `${text}\n\nReported by: ${reporterName}`;

    // Post tweet using Twitter API v2
    // We'll use OAuth 1.0a for posting
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
        error: error.message || 'Failed to post tweet'
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
  // For simplicity, we'll use the Twitter API v2
  // You may need to install oauth-1.0a library or implement OAuth 1.0a signing

  // Step 1: Upload media if imageUrl provided
  let mediaId: string | undefined;
  if (imageUrl) {
    // Download image and upload to Twitter
    // This is a simplified version - in production, you'd want error handling
    try {
      const imageResponse = await fetch(imageUrl);
      const imageBlob = await imageResponse.blob();
      const formData = new FormData();
      formData.append('media', imageBlob);

      // Upload to Twitter media endpoint
      // Note: This requires OAuth 1.0a signing
      // For now, we'll skip media upload and just post text
      console.log('Media upload not yet implemented');
    } catch (error) {
      console.error('Error uploading media:', error);
      // Continue without image
    }
  }

  // Step 2: Post tweet
  const tweetData = {
    text: text,
    ...(mediaId && { media: { media_ids: [mediaId] } }),
  };

  // Make authenticated request to Twitter API v2
  // Note: In production, use a proper OAuth 1.0a library
  // For now, using Bearer Token (limited functionality)
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
    throw new Error(`Twitter API error: ${response.status} ${errorData}`);
  }

  const result = await response.json();
  return result.data;
}

/*
 * IMPORTANT: This is a simplified implementation!
 *
 * For production use, you should:
 * 1. Use a proper OAuth 1.0a library for authentication
 * 2. Implement media upload correctly
 * 3. Add rate limiting (Twitter has strict limits)
 * 4. Add retry logic for failed requests
 * 5. Store tweet metadata in your database
 *
 * Recommended library: https://deno.land/x/oauth_1_0a
 */
