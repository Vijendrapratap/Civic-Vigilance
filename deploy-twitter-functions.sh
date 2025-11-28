#!/bin/bash

# Deploy Twitter Edge Functions to Supabase

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Deploying Twitter Edge Functions to Supabase             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Using npx supabase (no global install needed)
echo "✅ Using Supabase CLI via npx"

echo "📦 Deploying functions..."
echo ""

# Deploy each function
echo "🚀 Deploying post-tweet-civic..."
npx supabase functions deploy post-tweet-civic

echo ""
echo "🚀 Deploying post-tweet-user..."
npx supabase functions deploy post-tweet-user

echo ""
echo "🚀 Deploying twitter-auth..."
npx supabase functions deploy twitter-auth

echo ""
echo "🚀 Deploying disconnect-twitter..."
npx supabase functions deploy disconnect-twitter

echo ""
echo "✅ All functions deployed successfully!"
echo ""

# List deployed functions
echo "📋 Deployed functions:"
npx supabase functions list

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Deployment complete!                                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "Your functions are now available at:"
echo "  https://YOUR_PROJECT_REF.supabase.co/functions/v1/post-tweet-civic"
echo "  https://YOUR_PROJECT_REF.supabase.co/functions/v1/post-tweet-user"
echo "  https://YOUR_PROJECT_REF.supabase.co/functions/v1/twitter-auth"
echo "  https://YOUR_PROJECT_REF.supabase.co/functions/v1/disconnect-twitter"
echo ""

echo "Next step: Update your .env file!"
echo ""
