/**
 * Format large numbers with K/M suffixes
 * @param n - Number to format (e.g., 1234 -> "1.2K", 1234567 -> "1.2M")
 * @returns Formatted string
 */
export function formatCount(n?: number): string {
  const v = n ?? 0;
  if (v < 1000) return String(v);
  if (v < 10000) return (v / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  if (v < 1000000) return Math.round(v / 1000) + 'K';
  return (v / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
}

/**
 * Calculate time ago string from a date
 * @param date - Date to calculate from (Date, string, or timestamp)
 * @returns Human-readable time ago string (e.g., "5m ago", "2h ago", "3d ago")
 */
export function getTimeAgo(date: Date | string | number | undefined | null): string {
  if (!date) return 'just now';

  try {
    const now = new Date();
    const itemDate = new Date(date);

    // Check for invalid date
    if (isNaN(itemDate.getTime())) return 'just now';

    const diffMs = now.getTime() - itemDate.getTime();

    // Handle future dates (clock skew)
    if (diffMs < 0) return 'just now';

    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffMs / 604800000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffWeeks < 4) return `${diffWeeks}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  } catch (error) {
    console.error('[format] getTimeAgo error:', error);
    return 'just now';
  }
}

/**
 * Format distance in kilometers with validation
 * @param distance - Distance in km
 * @returns Formatted distance string (e.g., "1.5 km", "< 0.1 km", "> 999 km")
 */
export function formatDistance(distance?: number): string {
  if (distance === undefined || distance === null || isNaN(distance) || !isFinite(distance)) {
    return '';
  }
  if (distance < 0.1) return '< 0.1 km';
  if (distance > 999) return '> 999 km';
  return `${distance.toFixed(1)} km`;
}

