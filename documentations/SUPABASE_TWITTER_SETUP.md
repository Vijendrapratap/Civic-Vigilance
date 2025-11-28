# Twitter Integration with Supabase Edge Functions

This guide shows you how to set up Twitter posting using Supabase Edge Functions instead of Firebase Cloud Functions.

## ✅ Advantages of Using Supabase for Twitter

1. **All-in-One Solution** - Everything in Supabase (database + functions)
2. **Free Tier** - 500K function invocations/month included
3. **Integrated** - Direct access to your database
4. **TypeScript/Deno** - Modern, secure runtime
5. **Easy Deployment** - Deploy with one command

---

## 📋 What You'll Need

- [x] Supabase project (you have this!)
- [x] Twitter OAuth Client ID (you have this!)
- [ ] Twitter API credentials (we'll get this)
- [ ] Supabase CLI installed

---

## Step 1: Get Twitter API Credentials

You already have the **Client ID** for user OAuth. Now you need credentials for the **@CivicVigilance** account to post tweets.

### A. Apply for Twitter API Access

1. Go to: https://developer.twitter.com/
2. Sign in with your **@CivicVigilance** Twitter account
3. Click **"Apply for Access"** → **Free** tier is fine
4. Answer questions:
   - Purpose: "Civic issue reporting and community engagement"
   - Will you make Twitter content available to government? No
   - Will you display tweets? Yes, within our app

### B. Create a Twitter App

1. Go to: https://developer.twitter.com/en/portal/dashboard
2. Click **"Create App"** or **"Create Project"**
3. App details:
   - **App name**: `CivicVigilance`
   - **Description**: `Civic issue reporting platform`
   - **Website**: Your app website or GitHub
   - **Callback URL**: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/twitter-callback`

### C. Get API Keys

After creating the app:

1. Go to **Keys and Tokens** tab
2. Generate:
   - ✅ **API Key** (Consumer Key)
   - ✅ **API Secret** (Consumer Secret)
   - ✅ **Bearer Token**
   - ✅ **Access Token** (for @CivicVigilance account)
   - ✅ **Access Token Secret**

**SAVE THESE SECURELY!** You'll need them in the next step.

---

## Step 2: Install Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project (get project ref from Supabase dashboard)
supabase link --project-ref YOUR_PROJECT_REF
```

**Your Project Ref:** Find it in Supabase Dashboard → Settings → General → Reference ID

---

## Step 3: Store Twitter Secrets in Supabase

Supabase Secrets are secure, encrypted, and never exposed to clients.

```bash
# Set Twitter API credentials (for @CivicVigilance posting)
supabase secrets set TWITTER_API_KEY=your_api_key_here
supabase secrets set TWITTER_API_SECRET=your_api_secret_here
supabase secrets set TWITTER_ACCESS_TOKEN=your_access_token_here
supabase secrets set TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret_here
supabase secrets set TWITTER_BEARER_TOKEN=your_bearer_token_here

# Verify secrets are set
supabase secrets list
```

---

## Step 4: Create Supabase Edge Functions

I'll create the Edge Functions for you. These will be in the `supabase/functions/` directory.

### Functions we'll create:

1. **`post-tweet-civic`** - Post from @CivicVigilance account
2. **`post-tweet-user`** - Post from user's personal account
3. **`twitter-auth`** - Handle OAuth token exchange
4. **`disconnect-twitter`** - Disconnect user's Twitter

---

## Step 5: Deploy Edge Functions

After I create the functions (next step), deploy them:

```bash
# Deploy all functions
supabase functions deploy post-tweet-civic
supabase functions deploy post-tweet-user
supabase functions deploy twitter-auth
supabase functions deploy disconnect-twitter

# Check deployment status
supabase functions list
```

---

## Step 6: Update Your App Configuration

Update your `.env` file to use Supabase Edge Functions:

```bash
# Replace Firebase URL with Supabase Functions URL
EXPO_PUBLIC_API_URL=https://YOUR_PROJECT_REF.supabase.co/functions/v1
```

The app will now call:
- `https://YOUR_PROJECT_REF.supabase.co/functions/v1/post-tweet-civic`
- `https://YOUR_PROJECT_REF.supabase.co/functions/v1/post-tweet-user`
- etc.

---

## 📊 Pricing & Limits

### Supabase Free Tier Includes:
- **500K Edge Function invocations/month**
- **2GB database**
- **1GB file storage**
- **5GB bandwidth**

For a civic app, this should be plenty! Even with 1000 daily active users posting:
- ~30K issues/month × 1 function call = **30K invocations**
- Well under the 500K limit ✅

---

## 🔐 Security Benefits

1. **Secrets Never Exposed**
   - API keys stored in Supabase Secrets
   - Never sent to client
   - Encrypted at rest

2. **Row Level Security**
   - Functions respect RLS policies
   - Users can only access their own data

3. **HTTPS Only**
   - All function calls over HTTPS
   - Automatic SSL certificates

---

## 🧪 Testing Your Functions

After deployment, test with curl:

```bash
# Test civic account posting
curl -X POST \
  https://YOUR_PROJECT_REF.supabase.co/functions/v1/post-tweet-civic \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Test tweet from Civic Vigilance",
    "reporterId": "user-uuid",
    "reporterName": "Test User"
  }'
```

---

## 📁 File Structure

After setup, your project will have:

```
supabase/
├── migrations/          # Database migrations (already done!)
│   ├── 001_initial_schema.sql
│   ├── 002_row_level_security.sql
│   ├── 003_seed_authorities.sql
│   ├── 004_add_profiles_table.sql
│   ├── 005_update_rls_for_profiles.sql
│   └── 006_optimize_schema.sql
│
└── functions/           # Edge Functions (we'll create these)
    ├── post-tweet-civic/
    │   └── index.ts
    ├── post-tweet-user/
    │   └── index.ts
    ├── twitter-auth/
    │   └── index.ts
    └── disconnect-twitter/
        └── index.ts
```

---

## 🚀 Next Steps

Would you like me to:

1. **Create the Edge Functions** - I'll write the TypeScript code for all 4 functions
2. **Set up automatic deployment** - Configure GitHub Actions for auto-deploy
3. **Add rate limiting** - Prevent abuse of Twitter posting
4. **Add webhook for Twitter events** - Track mentions, replies, etc.

Let me know and I'll create the Edge Functions for you! 🎯

---

## 💡 Quick Start Summary

```bash
# 1. Get Twitter API credentials from developer.twitter.com
# 2. Install Supabase CLI
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# 3. Store secrets
supabase secrets set TWITTER_API_KEY=xxx
supabase secrets set TWITTER_API_SECRET=xxx
supabase secrets set TWITTER_ACCESS_TOKEN=xxx
supabase secrets set TWITTER_ACCESS_TOKEN_SECRET=xxx

# 4. Deploy functions (after I create them)
supabase functions deploy post-tweet-civic
supabase functions deploy post-tweet-user

# 5. Update .env
EXPO_PUBLIC_API_URL=https://YOUR_PROJECT_REF.supabase.co/functions/v1
```

**Estimated Setup Time:** 30-45 minutes

Ready to get started? 🚀
