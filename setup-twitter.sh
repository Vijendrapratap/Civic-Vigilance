#!/bin/bash

# Twitter Integration Setup Script for Supabase
# This script helps you configure Twitter API credentials

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Civic Vigilance - Twitter Setup for Supabase             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Using npx supabase (no global install needed)
echo "✅ Using Supabase CLI via npx"
echo ""

# Check if project is linked
if [ ! -f ".supabase/config.toml" ]; then
    echo "⚠️  Project not linked to Supabase"
    echo ""
    echo "Please link your project first:"
    echo "  supabase link --project-ref YOUR_PROJECT_REF"
    echo ""
    echo "Find your project ref in Supabase Dashboard → Settings → General"
    exit 1
fi

echo "✅ Project is linked"
echo ""

echo "📋 Twitter API Setup"
echo ""
echo "You'll need to get these credentials from:"
echo "  https://developer.twitter.com/en/portal/dashboard"
echo ""

# Prompt for Twitter credentials
read -p "Enter Twitter API Key (Consumer Key): " TWITTER_API_KEY
read -p "Enter Twitter API Secret (Consumer Secret): " TWITTER_API_SECRET
read -p "Enter Twitter Bearer Token: " TWITTER_BEARER_TOKEN
read -p "Enter Twitter Access Token (@CivicVigilance account): " TWITTER_ACCESS_TOKEN
read -p "Enter Twitter Access Token Secret: " TWITTER_ACCESS_TOKEN_SECRET

echo ""
echo "🔐 Storing secrets in Supabase..."
echo ""

# Set secrets
npx supabase secrets set TWITTER_API_KEY="$TWITTER_API_KEY"
npx supabase secrets set TWITTER_API_SECRET="$TWITTER_API_SECRET"
npx supabase secrets set TWITTER_BEARER_TOKEN="$TWITTER_BEARER_TOKEN"
npx supabase secrets set TWITTER_ACCESS_TOKEN="$TWITTER_ACCESS_TOKEN"
npx supabase secrets set TWITTER_ACCESS_TOKEN_SECRET="$TWITTER_ACCESS_TOKEN_SECRET"

echo ""
echo "✅ Secrets stored successfully!"
echo ""

# List secrets to verify
echo "📝 Verifying secrets..."
npx supabase secrets list

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Twitter credentials configured!                           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "Next steps:"
echo "  1. Deploy Edge Functions:"
echo "     ./deploy-twitter-functions.sh"
echo ""
echo "  2. Update your .env file:"
echo "     EXPO_PUBLIC_API_URL=https://YOUR_PROJECT_REF.supabase.co/functions/v1"
echo ""
echo "  3. Test the app:"
echo "     npm start"
echo ""
