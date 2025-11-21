/**
 * Username Generation & Validation Utility
 * PRD Section 5.1.1 - Username Selection
 *
 * Features:
 * - Generate Anonymous_Citizen_XXXX usernames
 * - Validate custom usernames
 * - Check uniqueness (requires backend integration)
 */

// Offensive words blocklist (basic - should be expanded)
const OFFENSIVE_WORDS = [
  'admin',
  'moderator',
  'official',
  'government',
  'civic',
  'vigilance',
  // Add more offensive/restricted words
];

/**
 * Generate a random anonymous username
 * Format: Anonymous_Citizen_XXXX (where XXXX is 4 random digits)
 *
 * @returns string - e.g., "Anonymous_Citizen_4738"
 */
export function generateAnonymousUsername(): string {
  const randomDigits = Math.floor(1000 + Math.random() * 9000); // 1000-9999
  return `Anonymous_Citizen_${randomDigits}`;
}

/**
 * Validate username format
 * Rules:
 * - 3-20 characters
 * - Only letters, numbers, underscores
 * - No special characters or spaces
 * - Not in offensive words blocklist
 *
 * @param username - Username to validate
 * @returns object with isValid and error message
 */
export function validateUsername(username: string): { isValid: boolean; error?: string } {
  // Check length
  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters' };
  }
  if (username.length > 20) {
    return { isValid: false, error: 'Username must be 20 characters or less' };
  }

  // Check allowed characters (letters, numbers, underscores only)
  const validPattern = /^[a-zA-Z0-9_]+$/;
  if (!validPattern.test(username)) {
    return {
      isValid: false,
      error: 'Username can only contain letters, numbers, and underscores',
    };
  }

  // Check for offensive/restricted words
  const lowerUsername = username.toLowerCase();
  for (const word of OFFENSIVE_WORDS) {
    if (lowerUsername.includes(word)) {
      return {
        isValid: false,
        error: `Username cannot contain restricted word: "${word}"`,
      };
    }
  }

  return { isValid: true };
}

/**
 * Check if username is unique in the database
 * This function should be called with the appropriate backend
 *
 * @param username - Username to check
 * @param checkFunction - Backend-specific function to check uniqueness
 * @returns Promise<boolean> - true if unique, false if taken
 */
export async function isUsernameUnique(
  username: string,
  checkFunction: (username: string) => Promise<boolean>
): Promise<boolean> {
  try {
    return await checkFunction(username);
  } catch (error) {
    console.error('Error checking username uniqueness:', error);
    return false; // Assume not unique on error (safer)
  }
}

/**
 * Suggest alternative usernames if the chosen one is taken
 * Strategies:
 * 1. Append random 4-digit number
 * 2. Append city name (if available)
 *
 * @param baseUsername - Original username that was taken
 * @param city - Optional city name
 * @returns string[] - Array of suggested alternatives
 */
export function suggestAlternativeUsernames(
  baseUsername: string,
  city?: string
): string[] {
  const suggestions: string[] = [];

  // Strategy 1: Append random digits
  for (let i = 0; i < 3; i++) {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    suggestions.push(`${baseUsername}_${randomDigits}`);
  }

  // Strategy 2: Append city (if provided and result is valid length)
  if (city && (baseUsername + '_' + city).length <= 20) {
    const cityFormatted = city.replace(/\s+/g, '');
    suggestions.push(`${baseUsername}_${cityFormatted}`);
  }

  // Strategy 3: Append sequential numbers
  suggestions.push(`${baseUsername}_1`);
  suggestions.push(`${baseUsername}_2`);

  // Filter to only valid-length suggestions
  return suggestions.filter((s) => s.length >= 3 && s.length <= 20);
}

/**
 * Format username for display
 * - Show verification badge if applicable
 * - Format for UI display
 *
 * @param username - Username to format
 * @param isVerified - Whether user is verified (⭐ badge)
 * @returns string - Formatted username
 */
export function formatUsernameForDisplay(
  username: string,
  isVerified: boolean = false
): string {
  return isVerified ? `${username} ⭐` : username;
}

/**
 * Check if a username is anonymous format
 * @param username - Username to check
 * @returns boolean - true if matches Anonymous_Citizen_XXXX pattern
 */
export function isAnonymousUsername(username: string): boolean {
  return /^Anonymous_Citizen_\d{4}$/.test(username);
}
