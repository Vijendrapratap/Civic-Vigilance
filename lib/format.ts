export function formatCount(n?: number) {
  const v = n ?? 0;
  if (v < 1000) return String(v);
  if (v < 10000) return (v / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  if (v < 1000000) return Math.round(v / 1000) + 'K';
  return (v / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
}

