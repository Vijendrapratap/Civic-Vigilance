import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import * as Linking from 'expo-linking';

export function composePostText(args: { description: string; address?: string; lat?: number; lng?: number; authorities?: string[]; }) {
  const parts = [args.description];
  if (args.address) parts.push(`Address: ${args.address}`);
  if (args.lat && args.lng) parts.push(`Map: https://maps.google.com/?q=${args.lat},${args.lng}`);
  if (args.authorities && args.authorities.length) parts.push(args.authorities.join(' '));
  return parts.filter(Boolean).join('\n');
}

export async function openTweetComposer(text: string) {
  // Open X/Twitter composer with text (image attachment via share sheet)
  const encoded = encodeURIComponent(text);
  const url = `https://twitter.com/intent/tweet?text=${encoded}`;
  await Linking.openURL(url);
}

export async function shareImageWithText(imageUri: string, text: string) {
  // Falls back to text-only share if Sharing not available
  if (await Sharing.isAvailableAsync()) {
    try {
      await Sharing.shareAsync(imageUri, { dialogTitle: 'Share civic issue', UTI: 'public.png' });
    } catch (e) {
      // no-op; allow text-only fallback
    }
  }
  // Tweet link as a fallback for text
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    await openTweetComposer(text);
  }
}

