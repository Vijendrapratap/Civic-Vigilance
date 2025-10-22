/**
 * Geohash utilities for efficient spatial queries
 * Used for authority database geo-matching
 */

const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

export function encodeGeohash(latitude: number, longitude: number, precision: number = 8): string {
  let idx = 0;
  let bit = 0;
  let evenBit = true;
  let geohash = '';

  let latMin = -90,
    latMax = 90;
  let lonMin = -180,
    lonMax = 180;

  while (geohash.length < precision) {
    if (evenBit) {
      // longitude
      const lonMid = (lonMin + lonMax) / 2;
      if (longitude > lonMid) {
        idx |= 1 << (4 - bit);
        lonMin = lonMid;
      } else {
        lonMax = lonMid;
      }
    } else {
      // latitude
      const latMid = (latMin + latMax) / 2;
      if (latitude > latMid) {
        idx |= 1 << (4 - bit);
        latMin = latMid;
      } else {
        latMax = latMid;
      }
    }

    evenBit = !evenBit;

    if (bit < 4) {
      bit++;
    } else {
      geohash += BASE32[idx];
      bit = 0;
      idx = 0;
    }
  }

  return geohash;
}

export function decodeGeohash(geohash: string): { lat: number; lng: number; error: { lat: number; lng: number } } {
  let evenBit = true;
  let latMin = -90,
    latMax = 90;
  let lonMin = -180,
    lonMax = 180;

  for (let i = 0; i < geohash.length; i++) {
    const chr = geohash[i];
    const idx = BASE32.indexOf(chr);

    if (idx === -1) throw new Error('Invalid geohash');

    for (let n = 4; n >= 0; n--) {
      const bitN = (idx >> n) & 1;
      if (evenBit) {
        // longitude
        const lonMid = (lonMin + lonMax) / 2;
        if (bitN === 1) {
          lonMin = lonMid;
        } else {
          lonMax = lonMid;
        }
      } else {
        // latitude
        const latMid = (latMin + latMax) / 2;
        if (bitN === 1) {
          latMin = latMid;
        } else {
          latMax = latMid;
        }
      }
      evenBit = !evenBit;
    }
  }

  const lat = (latMin + latMax) / 2;
  const lng = (lonMin + lonMax) / 2;
  const latError = latMax - latMin;
  const lngError = lonMax - lonMin;

  return {
    lat,
    lng,
    error: { lat: latError, lng: lngError },
  };
}

/**
 * Get neighboring geohashes for radius search
 */
export function getNeighbors(geohash: string): string[] {
  const neighbors: Record<string, Record<string, string>> = {
    right: { even: 'bc01fg45238967deuvhjyznpkmstqrwx', odd: 'p0r21436x8zb9dcf5h7kjnmqesgutwvy' },
    left: { even: '238967debc01fg45kmstqrwxuvhjyznp', odd: '14365h7k9dcfesgujnmqp0r2twvyx8zb' },
    top: { even: 'p0r21436x8zb9dcf5h7kjnmqesgutwvy', odd: 'bc01fg45238967deuvhjyznpkmstqrwx' },
    bottom: { even: '14365h7k9dcfesgujnmqp0r2twvyx8zb', odd: '238967debc01fg45kmstqrwxuvhjyznp' },
  };

  const borders: Record<string, Record<string, string>> = {
    right: { even: 'bcfguvyz', odd: 'prxz' },
    left: { even: '0145hjnp', odd: '028b' },
    top: { even: 'prxz', odd: 'bcfguvyz' },
    bottom: { even: '028b', odd: '0145hjnp' },
  };

  const lastChr = geohash.slice(-1);
  let parent = geohash.slice(0, -1);
  const type = geohash.length % 2 ? 'odd' : 'even';

  // Check if we're at a border
  const getNeighbor = (direction: string): string => {
    if (borders[direction][type].indexOf(lastChr) !== -1 && parent !== '') {
      parent = getNeighbor.call(null, direction);
    }
    return parent + BASE32[neighbors[direction][type].indexOf(lastChr)];
  };

  return [
    getNeighbor('top'),
    getNeighbor('bottom'),
    getNeighbor('right'),
    getNeighbor('left'),
    getNeighbor('top').slice(0, -1) + BASE32[neighbors['right'][type].indexOf(getNeighbor('top').slice(-1))], // top-right
    getNeighbor('top').slice(0, -1) + BASE32[neighbors['left'][type].indexOf(getNeighbor('top').slice(-1))], // top-left
    getNeighbor('bottom').slice(0, -1) + BASE32[neighbors['right'][type].indexOf(getNeighbor('bottom').slice(-1))], // bottom-right
    getNeighbor('bottom').slice(0, -1) + BASE32[neighbors['left'][type].indexOf(getNeighbor('bottom').slice(-1))], // bottom-left
  ];
}

/**
 * Calculate distance between two points using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
