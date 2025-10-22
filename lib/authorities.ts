/**
 * Authority Database and Mapping System
 * As per PDF section 2.9 - Authority Database & Mapping System
 *
 * This module handles intelligent matching of GPS coordinates to relevant
 * government authority Twitter handles for tagging in reports.
 */

import { db } from './firebase';
import { collection, query, where, getDocs, limit as firestoreLimit } from 'firebase/firestore';
import { Authority, IssueCategory } from '../types';
import { encodeGeohash, getNeighbors } from './geohash';

/**
 * Category to department mapping (from PDF)
 */
const CATEGORY_DEPARTMENT_MAP: Record<IssueCategory, string[]> = {
  pothole: ['Roads', 'Public Works', 'Traffic Police'],
  garbage: ['Sanitation', 'Waste Management'],
  streetlight: ['Electrical', 'Public Works'],
  drainage: ['Sewerage Board', 'Public Works'],
  water_supply: ['Water Board', 'Public Works'],
  sewage: ['Sewerage Board', 'Public Works'],
  traffic_signal: ['Traffic Police', 'Public Works'],
  encroachment: ['Town Planning', 'Municipal Corporation'],
  stray_animals: ['Animal Welfare', 'Health Department'],
  parks: ['Horticulture', 'Parks Department'],
  other: ['Municipal Corporation'],
};

/**
 * Sample authority data for demonstration
 * In production, this would be populated from Firestore
 */
const SAMPLE_AUTHORITIES: Partial<Authority>[] = [
  {
    id: 'bbmp_ward_23',
    name: 'BBMP Ward 23 Office',
    nameLocal: 'ಬಿಬಿಎಂಪಿ ವಾರ್ಡ್ 23',
    twitter: {
      handle: '@BBMP_Ward23',
      verified: true,
      active: true,
      lastChecked: new Date(),
    },
    jurisdiction: {
      type: 'ward',
      level: 4,
      country: 'India',
      state: 'Karnataka',
      city: 'Bangalore',
      ward: 23,
      zone: 'East Zone',
      geohashes: ['tdnu20', 'tdnu21'],
    },
    issueCategories: ['pothole', 'garbage', 'streetlight', 'drainage', 'water_supply'],
    priority: 1,
  },
  {
    id: 'bbmp_comm',
    name: 'BBMP Official Account',
    twitter: {
      handle: '@BBMPCOMM',
      verified: true,
      active: true,
      lastChecked: new Date(),
    },
    jurisdiction: {
      type: 'city',
      level: 3,
      country: 'India',
      state: 'Karnataka',
      city: 'Bangalore',
      geohashes: ['tdnu'],
    },
    issueCategories: ['pothole', 'garbage', 'streetlight', 'drainage', 'water_supply', 'sewage'],
    priority: 2,
  },
  {
    id: 'blr_city_police',
    name: 'Bangalore Traffic Police',
    twitter: {
      handle: '@BlrCityPolice',
      verified: true,
      active: true,
      lastChecked: new Date(),
    },
    jurisdiction: {
      type: 'department',
      level: 3,
      country: 'India',
      state: 'Karnataka',
      city: 'Bangalore',
      geohashes: ['tdnu'],
    },
    issueCategories: ['pothole', 'traffic_signal', 'encroachment'],
    priority: 3,
  },
];

/**
 * Find relevant authorities for a report based on GPS coordinates and category
 * Implements the algorithm from PDF section 2.9.2
 */
export async function findAuthorities(params: {
  lat: number;
  lng: number;
  category: IssueCategory;
  city?: string;
  state?: string;
}): Promise<Authority[]> {
  const { lat, lng, category, city, state } = params;

  try {
    // Step 1: Calculate geohash from coordinates
    const geohash = encodeGeohash(lat, lng, 8);
    const geohashPrefix = geohash.substring(0, 6); // Use 6-char precision for matching

    // Step 2: Query database for authorities
    const authorities: Authority[] = [];

    if (db) {
      // Query Firestore for authorities
      const authoritiesRef = collection(db, 'authorities');

      // Priority 1: Ward-level match
      const wardQuery = query(
        authoritiesRef,
        where('jurisdiction.geohashes', 'array-contains', geohashPrefix),
        where('issueCategories', 'array-contains', category),
        where('status', '==', 'active'),
        firestoreLimit(5)
      );

      const wardSnapshot = await getDocs(wardQuery);
      wardSnapshot.forEach((doc) => {
        const data = doc.data() as Authority;
        authorities.push({ ...data, id: doc.id });
      });

      // Priority 2: City-level match (if ward not found or need secondary)
      if (city && authorities.length < 3) {
        const cityQuery = query(
          authoritiesRef,
          where('jurisdiction.city', '==', city),
          where('jurisdiction.type', '==', 'city'),
          where('issueCategories', 'array-contains', category),
          where('status', '==', 'active'),
          firestoreLimit(2)
        );

        const citySnapshot = await getDocs(cityQuery);
        citySnapshot.forEach((doc) => {
          const data = doc.data() as Authority;
          if (!authorities.find((a) => a.id === doc.id)) {
            authorities.push({ ...data, id: doc.id });
          }
        });
      }

      // Priority 3: Department-specific
      const departments = CATEGORY_DEPARTMENT_MAP[category] || [];
      if (departments.length > 0 && authorities.length < 5) {
        // Query by department type - would need additional field in schema
        // For now, skip or use fallback
      }
    }

    // Fallback to sample data if no Firebase or no results
    if (authorities.length === 0) {
      // Use sample data for demonstration
      const matchingAuthorities = SAMPLE_AUTHORITIES.filter((auth) => {
        if (!auth.issueCategories) return false;
        return auth.issueCategories.includes(category);
      });

      return matchingAuthorities.slice(0, 5) as Authority[];
    }

    // Sort by priority and return max 5
    return authorities.sort((a, b) => (a.priority || 99) - (b.priority || 99)).slice(0, 5);
  } catch (error) {
    console.error('Error finding authorities:', error);

    // Return fallback authorities
    return SAMPLE_AUTHORITIES.slice(0, 3) as Authority[];
  }
}

/**
 * Legacy function for backward compatibility
 */
export function suggestAuthorities(region?: string): string[] {
  // Return sample handles
  return ['@BBMP_Ward23', '@BBMPCOMM', '@BlrCityPolice'];
}

/**
 * Get authority performance metrics
 */
export async function getAuthorityMetrics(authorityId: string): Promise<Authority['metrics'] | null> {
  if (!db) return null;

  try {
    const authDoc = await getDocs(query(collection(db, 'authorities'), where('id', '==', authorityId), firestoreLimit(1)));

    if (authDoc.empty) return null;

    const data = authDoc.docs[0].data() as Authority;
    return data.metrics;
  } catch (error) {
    console.error('Error fetching authority metrics:', error);
    return null;
  }
}

/**
 * Verify if a Twitter handle is active
 * (Would be implemented in Cloud Functions with actual Twitter API calls)
 */
export async function verifyTwitterHandle(handle: string): Promise<boolean> {
  // This should be a Cloud Function call
  try {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || '';
    const response = await fetch(`${apiUrl}/verifyTwitterHandle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    return data.active || false;
  } catch (error) {
    console.error('Error verifying Twitter handle:', error);
    return false;
  }
}

/**
 * Update authority response status when they interact on Twitter
 * (Called from Cloud Functions monitoring Twitter)
 */
export async function recordAuthorityResponse(params: {
  reportId: string;
  authorityId: string;
  responseType: 'reply' | 'like' | 'retweet';
}): Promise<void> {
  // This would update the report in Firestore
  // Implementation depends on Firebase Cloud Functions
  console.log('Authority response recorded:', params);
}
