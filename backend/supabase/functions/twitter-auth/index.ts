// Supabase Edge Function: Twitter OAuth Handler
// Exchanges OAuth authorization code for access tokens

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') || 'https://civicvigilance.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AuthRequest {
  userId: string;
  code: string;
  codeVerifier: string;
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

    // Parse request
    const { userId, code, codeVerifier }: AuthRequest = await req.json();

    if (!userId || !code || !codeVerifier) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: userId, code, codeVerifier' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Twitter credentials
    const clientId = Deno.env.get('TWITTER_CLIENT_ID')!;
    const clientSecret = Deno.env.get('TWITTER_CLIENT_SECRET')!;
    const redirectUri = Deno.env.get('TWITTER_REDIRECT_URI') || 'civicvigilance://oauth/twitter';

    // Exchange code for access token using OAuth 2.0
    // Use the actual code_verifier from the client (PKCE flow)
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('Token exchange error:', error);
      throw new Error('Failed to exchange authorization code');
    }

    const tokens = await tokenResponse.json();

    // Get user's Twitter profile
    const profileResponse = await fetch('https://api.twitter.com/2/users/me', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    });

    if (!profileResponse.ok) {
      throw new Error('Failed to fetch Twitter profile');
    }

    const profile = await profileResponse.json();

    // Store tokens in database using service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    await supabase
      .from('users')
      .update({
        twitter_connected: true,
        twitter_handle: profile.data.username,
        twitter_user_id: profile.data.id,
        twitter_access_token: tokens.access_token,
        twitter_access_token_secret: tokens.refresh_token,
      })
      .eq('id', userId);

    // Return success (do not expose tokens to the client)
    return new Response(
      JSON.stringify({
        success: true,
        handle: profile.data.username,
        twitterUserId: profile.data.id,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in Twitter auth:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Twitter authentication failed. Please try again.',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
