/**
 * Twitter API v2 Integration
 * Handles posting to Twitter from both @CivicVigilance account and user's personal account
 * As per PDF section 2.3.5 and 2.3.7
 */

import { TwitterPostingMethod, Authority } from '../types';

const TWITTER_API_BASE = 'https://api.twitter.com/2';
const CIVIC_VIGILANCE_HANDLE = process.env.EXPO_PUBLIC_CIVIC_VIGILANCE_TWITTER_HANDLE || '@CivicVigilance';

export interface TweetData {
  text: string;
  imageUrl?: string;
  authorities: string[]; // Twitter handles to tag
}

export interface TweetResponse {
  success: boolean;
  tweetId?: string;
  tweetUrl?: string;
  error?: string;
}

/**
 * Compose tweet text for a civic report
 * Following PDF specifications for tweet format
 */
export function composeTweetText(params: {
  category: string;
  description?: string;
  address: string;
  lat: number;
  lng: number;
  authorities: string[];
  reporterName?: string; // For Civic Vigilance posts
  timestamp: Date;
}): string {
  const { category, description, address, lat, lng, authorities, reporterName, timestamp } = params;

  // Category emoji mapping (from PDF)
  const categoryEmojis: Record<string, string> = {
    pothole: '🚧',
    garbage: '🗑️',
    streetlight: '💡',
    drainage: '🌊',
    water_supply: '💧',
    sewage: '🚰',
    traffic_signal: '🚦',
    encroachment: '🚧',
    stray_animals: '🐕',
    parks: '🌳',
    other: '⚠️',
  };

  const emoji = categoryEmojis[category] || '⚠️';
  const categoryTitle = category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  const dateStr = timestamp.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // Build tweet text
  let tweet = `${emoji} ${categoryTitle} reported on ${dateStr}\n\n`;
  tweet += `📍 ${address}\n`;
  tweet += `🗺 GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}\n`;
  tweet += `https://maps.google.com/?q=${lat},${lng}\n\n`;

  // Tag authorities
  if (authorities.length > 0) {
    tweet += authorities.map((h) => (h.startsWith('@') ? h : `@${h}`)).join(' ') + '\n\n';
  }

  tweet += 'Please take immediate action.\n\n';

  // Add reporter credit if posting from Civic Vigilance account
  if (reporterName) {
    tweet += `Reported by: ${reporterName} via Civic Vigilance\n\n`;
  }

  tweet += '#CivicVigilance';

  return tweet;
}

/**
 * Post tweet from Civic Vigilance official account
 * This is a server-side operation - needs to be called from Firebase Cloud Function
 */
export async function postFromCivicVigilanceAccount(
  tweetData: TweetData,
  reporterId: string,
  reporterName: string
): Promise<TweetResponse> {
  try {
    // This should be called via Cloud Function that has the Civic Vigilance credentials
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || '';

    const response = await fetch(`${apiUrl}/postTweetFromCivicAccount`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: tweetData.text,
        imageUrl: tweetData.imageUrl,
        reporterId,
        reporterName,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to post tweet: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      success: true,
      tweetId: data.tweetId,
      tweetUrl: data.tweetUrl,
    };
  } catch (error: any) {
    console.error('Error posting from Civic Vigilance account:', error);
    return {
      success: false,
      error: error.message || 'Failed to post tweet',
    };
  }
}

/**
 * Post tweet from user's personal Twitter account
 * Uses OAuth 2.0 tokens stored for the user
 */
export async function postFromPersonalAccount(
  tweetData: TweetData,
  userTwitterToken: string
): Promise<TweetResponse> {
  try {
    // Call Cloud Function to post from user's account
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || '';

    const response = await fetch(`${apiUrl}/postTweetFromUserAccount`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userTwitterToken}`,
      },
      body: JSON.stringify({
        text: tweetData.text,
        imageUrl: tweetData.imageUrl,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to post tweet: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      success: true,
      tweetId: data.tweetId,
      tweetUrl: data.tweetUrl,
    };
  } catch (error: any) {
    console.error('Error posting from personal account:', error);
    return {
      success: false,
      error: error.message || 'Failed to post tweet',
    };
  }
}

/**
 * Connect user's Twitter account using OAuth 2.0
 * Returns authorization URL for user to authenticate
 */
export async function getTwitterAuthUrl(userId: string): Promise<string> {
  try {
    const clientId = process.env.EXPO_PUBLIC_TWITTER_CLIENT_ID;
    const redirectUri = process.env.EXPO_PUBLIC_TWITTER_REDIRECT_URI || 'civicvigilance://oauth/twitter';

    if (!clientId) {
      throw new Error('Twitter Client ID not configured');
    }

    // Generate PKCE code verifier and challenge
    const codeVerifier = generateRandomString(128);
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Store code verifier for later use
    await storeCodeVerifier(userId, codeVerifier);

    // Build OAuth URL
    const state = generateRandomString(32);
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'tweet.read tweet.write users.read offline.access',
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
  } catch (error: any) {
    console.error('Error generating Twitter auth URL:', error);
    throw error;
  }
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeTwitterCode(userId: string, code: string): Promise<{
  accessToken: string;
  refreshToken: string;
  handle: string;
  twitterUserId: string;
}> {
  try {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || '';

    const response = await fetch(`${apiUrl}/exchangeTwitterCode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        code,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to exchange code: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      handle: data.handle,
      twitterUserId: data.twitterUserId,
    };
  } catch (error: any) {
    console.error('Error exchanging Twitter code:', error);
    throw error;
  }
}

/**
 * Disconnect user's Twitter account
 */
export async function disconnectTwitterAccount(userId: string): Promise<void> {
  try {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || '';

    const response = await fetch(`${apiUrl}/disconnectTwitter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to disconnect Twitter: ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Error disconnecting Twitter:', error);
    throw error;
  }
}

// Helper functions

function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  // For React Native, we need to use a library or call a Cloud Function
  // This is a placeholder - implement with crypto library
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);

  // In production, use proper SHA-256 hashing
  // For now, return base64url encoded verifier as placeholder
  return btoa(verifier).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function storeCodeVerifier(userId: string, verifier: string): Promise<void> {
  // Store in AsyncStorage temporarily
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  await AsyncStorage.setItem(`twitter_code_verifier_${userId}`, verifier);
}

/**
 * Queue a Twitter post for later processing (offline support)
 */
export async function queueTwitterPost(params: {
  reportId: string;
  userId: string;
  method: 'civic_vigilance' | 'personal';
  tweetText: string;
  imageUrl?: string;
  authorities: string[];
}): Promise<void> {
  // This would be stored in Firestore pendingTwitterPosts collection
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || '';

  await fetch(`${apiUrl}/queueTwitterPost`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
}
