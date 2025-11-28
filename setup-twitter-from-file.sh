#!/bin/bash

# Twitter Credentials Setup - Load from File
# This script reads credentials from twitter-credentials.txt and stores them in Supabase

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Civic Vigilance - Twitter Credentials Setup              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if credentials file exists
if [ ! -f "twitter-credentials.txt" ]; then
    echo "❌ Error: twitter-credentials.txt not found!"
    echo ""
    echo "Please create the file with your Twitter credentials."
    exit 1
fi

echo "📋 Loading credentials from twitter-credentials.txt..."
echo ""

# Source the credentials file
source <(grep -v '^#' twitter-credentials.txt | grep '=' | sed 's/^/export /')

# Validate all credentials are set
MISSING=0

if [ -z "$TWITTER_CLIENT_ID" ]; then
    echo "❌ TWITTER_CLIENT_ID is missing"
    MISSING=1
fi

if [ -z "$TWITTER_CLIENT_SECRET" ]; then
    echo "❌ TWITTER_CLIENT_SECRET is missing"
    MISSING=1
fi

if [ -z "$TWITTER_API_KEY" ]; then
    echo "⚠️  TWITTER_API_KEY is missing - you'll need this for posting"
    echo "   Get it from: https://developer.twitter.com/en/portal/dashboard"
fi

if [ -z "$TWITTER_API_SECRET" ]; then
    echo "⚠️  TWITTER_API_SECRET is missing - you'll need this for posting"
fi

if [ -z "$TWITTER_BEARER_TOKEN" ]; then
    echo "⚠️  TWITTER_BEARER_TOKEN is missing - you'll need this for posting"
fi

if [ -z "$TWITTER_ACCESS_TOKEN" ]; then
    echo "⚠️  TWITTER_ACCESS_TOKEN is missing - you'll need this for posting"
fi

if [ -z "$TWITTER_ACCESS_TOKEN_SECRET" ]; then
    echo "⚠️  TWITTER_ACCESS_TOKEN_SECRET is missing - you'll need this for posting"
fi

if [ $MISSING -eq 1 ]; then
    echo ""
    echo "Please fill in all required credentials in twitter-credentials.txt"
    exit 1
fi

echo ""
echo "✅ Client ID and Secret found"
echo ""

# Check if Supabase project is linked
if [ ! -f ".supabase/config.toml" ]; then
    echo "⚠️  Supabase project not linked"
    echo ""
    echo "Linking to project: endrnbacxyjpxvgxhpjj"
    echo ""

    # Login first if needed
    npx supabase login

    # Link project
    npx supabase link --project-ref endrnbacxyjpxvgxhpjj
fi

echo "🔐 Storing secrets in Supabase..."
echo ""

# Store OAuth credentials
npx supabase secrets set TWITTER_CLIENT_ID="$TWITTER_CLIENT_ID"
npx supabase secrets set TWITTER_CLIENT_SECRET="$TWITTER_CLIENT_SECRET"

# Store API credentials (if provided)
if [ -n "$TWITTER_API_KEY" ]; then
    npx supabase secrets set TWITTER_API_KEY="$TWITTER_API_KEY"
fi

if [ -n "$TWITTER_API_SECRET" ]; then
    npx supabase secrets set TWITTER_API_SECRET="$TWITTER_API_SECRET"
fi

if [ -n "$TWITTER_BEARER_TOKEN" ]; then
    npx supabase secrets set TWITTER_BEARER_TOKEN="$TWITTER_BEARER_TOKEN"
fi

if [ -n "$TWITTER_ACCESS_TOKEN" ]; then
    npx supabase secrets set TWITTER_ACCESS_TOKEN="$TWITTER_ACCESS_TOKEN"
fi

if [ -n "$TWITTER_ACCESS_TOKEN_SECRET" ]; then
    npx supabase secrets set TWITTER_ACCESS_TOKEN_SECRET="$TWITTER_ACCESS_TOKEN_SECRET"
fi

echo ""
echo "✅ Secrets stored successfully!"
echo ""

# Verify secrets
echo "📝 Verifying secrets..."
npx supabase secrets list

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Twitter credentials configured!                           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "Next steps:"
echo ""
echo "1. If you haven't added all API credentials yet:"
echo "   - Fill in the missing values in twitter-credentials.txt"
echo "   - Run this script again: ./setup-twitter-from-file.sh"
echo ""
echo "2. Deploy Edge Functions:"
echo "   ./deploy-twitter-functions.sh"
echo ""
echo "3. Test your app:"
echo "   npm start"
echo ""
echo "4. IMPORTANT - Security:"
echo "   Delete twitter-credentials.txt after setup is complete!"
echo "   rm twitter-credentials.txt"
echo ""
