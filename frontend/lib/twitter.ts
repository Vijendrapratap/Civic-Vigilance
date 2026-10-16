/**
 * Twitter/X Integration - Simple deep link approach
 * Composes tweet text for civic reports. Actual sharing is done via
 * shareToTwitter() in lib/sharingEnhanced.ts which opens Twitter intent URL.
 */

import { Authority } from '../types';

export interface TweetData {
  text: string;
  imageUrl?: string;
  authorities: string[]; // Twitter handles to tag
}

/**
 * Compose tweet text for a civic report
 */
export function composeTweetText(params: {
  category: string;
  description?: string;
  address: string;
  lat: number;
  lng: number;
  authorities: string[];
  reporterName?: string;
  timestamp: Date;
}): string {
  const { category, description, address, lat, lng, authorities, reporterName, timestamp } = params;

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

  let tweet = `${emoji} ${categoryTitle} reported on ${dateStr}\n\n`;
  tweet += `📍 ${address}\n`;
  tweet += `🗺 GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}\n`;
  tweet += `https://maps.google.com/?q=${lat},${lng}\n\n`;

  if (authorities.length > 0) {
    tweet += authorities.map((h) => (h.startsWith('@') ? h : `@${h}`)).join(' ') + '\n\n';
  }

  tweet += 'Please take immediate action.\n\n';

  if (reporterName) {
    tweet += `Reported by: ${reporterName} via Civic Vigilance\n\n`;
  }

  tweet += '#CivicVigilance';

  return tweet;
}
