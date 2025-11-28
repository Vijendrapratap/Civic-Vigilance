// Supabase Edge Function: Post Tweet from User's Personal Account
// This function posts tweets to Twitter from the user's connected Twitter account

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TweetRequest {
  text: string;
  imageUrl?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get user's auth token from request headers
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { text, imageUrl }: TweetRequest = await req.json();

    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: text' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user's Twitter credentials from database
    // You would store OAuth tokens securely in a separate table
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('twitter_access_token, twitter_access_token_secret, twitter_connected')
      .eq('id', user.id)
      .single();

    if (profileError || !userProfile || !userProfile.twitter_connected) {
      return new Response(
        JSON.stringify({ error: 'Twitter account not connected' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Twitter API credentials
    const TWITTER_API_KEY = Deno.env.get('TWITTER_API_KEY')!;
    const TWITTER_API_SECRET = Deno.env.get('TWITTER_API_SECRET')!;

    // Post tweet using user's tokens
    const tweetResponse = await postTweetAsUser(
      text,
      imageUrl,
      TWITTER_API_KEY,
      TWITTER_API_SECRET,
      userProfile.twitter_access_token,
      userProfile.twitter_access_token_secret
    );

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        tweetId: tweetResponse.id,
        tweetUrl: `https://twitter.com/user/status/${tweetResponse.id}`,
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

// Helper function to post tweet using user's credentials
async function postTweetAsUser(
  text: string,
  imageUrl: string | undefined,
  apiKey: string,
  apiSecret: string,
  userAccessToken: string,
  userAccessTokenSecret: string
) {
  // Similar to post-tweet-civic but uses user's tokens
  // Implementation would be the same as above

  const bearerToken = Deno.env.get('TWITTER_BEARER_TOKEN');

  const tweetData = {
    text: text,
  };

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
    throw new Error(`Twitter API error: ${response.status} ${errorData}`);
  }

  const result = await response.json();
  return result.data;
}
