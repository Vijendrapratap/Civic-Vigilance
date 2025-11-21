/**
 * Authority Database Seed Data
 * PRD Section 7.3 - Authority Database with Geohash Matching
 *
 * This file contains curated authority data for 6 launch cities:
 * - Bangalore (Karnataka)
 * - Mumbai (Maharashtra)
 * - Delhi NCR
 * - Chennai (Tamil Nadu)
 * - Hyderabad (Telangana)
 * - Kalyan (Maharashtra)
 *
 * Data Structure:
 * - Twitter handles for each authority
 * - Geohash prefixes for jurisdiction mapping
 * - Category-specific routing
 * - Priority levels (1=primary, 2=secondary, 3=fallback)
 */

import { Authority, IssueCategory } from '../types';
import { encodeGeohash } from './geohash';

// Geohash reference for major Indian cities:
// Bangalore: tdr1 (12.9716°N, 77.5946°E)
// Mumbai: te7p (19.0760°N, 72.8777°E)
// Delhi: ttnr (28.7041°N, 77.1025°E)
// Chennai: tfh3 (13.0827°N, 80.2707°E)
// Hyderabad: tep8 (17.3850°N, 78.4867°E)
// Kalyan: te7q (19.2403°N, 73.1305°E)

export const AUTHORITIES_SEED_DATA: Omit<Authority, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // ========================================
  // BANGALORE (Karnataka)
  // ========================================
  {
    name: 'BBMP (Bruhat Bengaluru Mahanagara Palike)',
    nameLocal: 'ಬೃಹತ್ ಬೆಂಗಳೂರು ಮಹಾನಗರ ಪಾಲಿಕೆ',
    socialMedia: {
      twitter: {
        handle: '@BBMPCOMM',
        verified: true,
        active: true,
        lastChecked: new Date(),
        url: 'https://twitter.com/BBMPCOMM',
      },
      facebook: {
        handle: 'BBMP.Bengaluru',
        verified: true,
        active: true,
        lastChecked: new Date(),
        url: 'https://facebook.com/BBMP.Bengaluru',
      },
      whatsapp: {
        number: '+918022660000',
        businessVerified: true,
        active: true,
        lastChecked: new Date(),
      },
    },
    jurisdiction: {
      type: 'city',
      level: 3,
      country: 'India',
      state: 'Karnataka',
      city: 'Bangalore',
      geohashes: ['tdr1'], // Bangalore area
    },
    issueCategories: [
      'pothole',
      'garbage',
      'streetlight',
      'drainage',
      'water_supply',
      'sewage',
      'parks',
      'other',
    ],
    priority: 1,
    contactInfo: {
      website: 'https://bbmp.gov.in',
      phone: '080-22660000',
      tollFree: '1800-425-2368',
      email: 'commissioner@bbmp.gov.in',
      mobileApp: 'https://play.google.com/store/apps/details?id=com.bbmp.sarathi',
    },
    responseMetrics: {
      averageResponseTime: 48, // hours
      totalIssuesAddressed: 12450,
      lastActive: new Date(),
    },
    status: 'active',
  },
  {
    name: 'Bangalore Traffic Police',
    socialMedia: {
      twitter: {
        handle: '@BlrCityTraffic',
        verified: true,
        active: true,
        lastChecked: new Date(),
        url: 'https://twitter.com/BlrCityTraffic',
      },
      facebook: {
        handle: 'BangaloreTrafficPolice',
        verified: true,
        active: true,
        lastChecked: new Date(),
        url: 'https://facebook.com/BangaloreTrafficPolice',
      },
      instagram: {
        handle: '@blrcitytraffic',
        verified: true,
        active: true,
        lastChecked: new Date(),
        url: 'https://instagram.com/blrcitytraffic',
      },
      whatsapp: {
        number: '+918022868550',
        businessVerified: true,
        active: true,
        lastChecked: new Date(),
      },
    },
    jurisdiction: {
      type: 'department',
      level: 3,
      country: 'India',
      state: 'Karnataka',
      city: 'Bangalore',
      geohashes: ['tdr1'],
    },
    issueCategories: ['traffic_signal', 'pothole', 'encroachment'],
    priority: 1,
    contactInfo: {
      phone: '080-22868550',
      tollFree: '103',
      website: 'https://traffic.karnataka.gov.in',
      email: 'blrtrafficpol@gmail.com',
    },
    responseMetrics: {
      averageResponseTime: 24,
      totalIssuesAddressed: 8900,
      lastActive: new Date(),
    },
    status: 'active',
  },
  {
    name: 'BWSSB (Bangalore Water Supply)',
    socialMedia: {
      twitter: {
        handle: '@BWSSB_Official',
        verified: false,
        active: true,
        lastChecked: new Date(),
        url: 'https://twitter.com/BWSSB_Official',
      },
      whatsapp: {
        number: '+918025533555',
        businessVerified: false,
        active: true,
        lastChecked: new Date(),
      },
    },
    jurisdiction: {
      type: 'department',
      level: 3,
      country: 'India',
      state: 'Karnataka',
      city: 'Bangalore',
      geohashes: ['tdr1'],
    },
    issueCategories: ['water_supply', 'sewage'],
    priority: 1,
    status: 'active',
  },

  // ========================================
  // MUMBAI (Maharashtra)
  // ========================================
  {
    name: 'BMC (Brihanmumbai Municipal Corporation)',
    nameLocal: 'बृहन्मुंबई महानगरपालिका',
    twitter: {
      handle: '@mybmc',
      verified: true,
      active: true,
      lastChecked: new Date(),
    },
    jurisdiction: {
      type: 'city',
      level: 3,
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai',
      geohashes: ['te7p'], // Mumbai area
    },
    issueCategories: [
      'pothole',
      'garbage',
      'streetlight',
      'drainage',
      'sewage',
      'parks',
      'encroachment',
      'other',
    ],
    priority: 1,
    contactInfo: {
      website: 'https://portal.mcgm.gov.in',
      phone: '1916',
    },
    status: 'active',
  },
  {
    name: 'Mumbai Traffic Police',
    twitter: {
      handle: '@MTPHereToHelp',
      verified: true,
      active: true,
      lastChecked: new Date(),
    },
    jurisdiction: {
      type: 'department',
      level: 3,
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai',
      geohashes: ['te7p'],
    },
    issueCategories: ['traffic_signal', 'pothole', 'encroachment'],
    priority: 1,
    status: 'active',
  },

  // ========================================
  // KALYAN (Maharashtra) - PRD Example City
  // ========================================
  {
    name: 'Kalyan Dombivli Municipal Corporation',
    nameLocal: 'कल्याण डोंबिवली महानगरपालिका',
    twitter: {
      handle: '@kdmc_kalyan',
      verified: false,
      active: true,
      lastChecked: new Date(),
    },
    jurisdiction: {
      type: 'city',
      level: 3,
      country: 'India',
      state: 'Maharashtra',
      city: 'Kalyan',
      geohashes: ['te7q'], // Kalyan area (19.24°N, 73.13°E)
    },
    issueCategories: [
      'pothole',
      'garbage',
      'streetlight',
      'drainage',
      'water_supply',
      'sewage',
      'parks',
      'stray_animals',
      'other',
    ],
    priority: 1,
    contactInfo: {
      website: 'https://kdmc.gov.in',
      phone: '0251-2200505',
    },
    status: 'active',
  },
  {
    name: 'Thane Police (Kalyan Division)',
    twitter: {
      handle: '@KalyanPolice',
      verified: false,
      active: true,
      lastChecked: new Date(),
    },
    jurisdiction: {
      type: 'department',
      level: 3,
      country: 'India',
      state: 'Maharashtra',
      city: 'Kalyan',
      geohashes: ['te7q'],
    },
    issueCategories: ['traffic_signal', 'encroachment'],
    priority: 2,
    status: 'active',
  },

  // ========================================
  // DELHI NCR
  // ========================================
  {
    name: 'MCD (Municipal Corporation of Delhi)',
    twitter: {
      handle: '@MCD_Delhi',
      verified: true,
      active: true,
      lastChecked: new Date(),
    },
    jurisdiction: {
      type: 'city',
      level: 3,
      country: 'India',
      state: 'Delhi',
      city: 'Delhi',
      geohashes: ['ttnr'], // Delhi area
    },
    issueCategories: [
      'pothole',
      'garbage',
      'streetlight',
      'drainage',
      'parks',
      'stray_animals',
      'other',
    ],
    priority: 1,
    contactInfo: {
      website: 'https://mcdonline.nic.in',
      phone: '1800-11-6688',
    },
    status: 'active',
  },
  {
    name: 'Delhi Traffic Police',
    twitter: {
      handle: '@dtptraffic',
      verified: true,
      active: true,
      lastChecked: new Date(),
    },
    jurisdiction: {
      type: 'department',
      level: 3,
      country: 'India',
      state: 'Delhi',
      city: 'Delhi',
      geohashes: ['ttnr'],
    },
    issueCategories: ['traffic_signal', 'pothole', 'encroachment'],
    priority: 1,
    status: 'active',
  },
  {
    name: 'Delhi Jal Board',
    twitter: {
      handle: '@DelhiJalBoard',
      verified: true,
      active: true,
      lastChecked: new Date(),
    },
    jurisdiction: {
      type: 'department',
      level: 3,
      country: 'India',
      state: 'Delhi',
      city: 'Delhi',
      geohashes: ['ttnr'],
    },
    issueCategories: ['water_supply', 'sewage'],
    priority: 1,
    status: 'active',
  },

  // ========================================
  // CHENNAI (Tamil Nadu)
  // ========================================
  {
    name: 'Greater Chennai Corporation',
    nameLocal: 'பெரும் சென்னை மாநகராட்சி',
    twitter: {
      handle: '@chennaicorp',
      verified: true,
      active: true,
      lastChecked: new Date(),
    },
    jurisdiction: {
      type: 'city',
      level: 3,
      country: 'India',
      state: 'Tamil Nadu',
      city: 'Chennai',
      geohashes: ['tfh3'], // Chennai area
    },
    issueCategories: [
      'pothole',
      'garbage',
      'streetlight',
      'drainage',
      'water_supply',
      'sewage',
      'parks',
      'other',
    ],
    priority: 1,
    contactInfo: {
      website: 'https://chennaicorporation.gov.in',
      phone: '044-25619200',
    },
    status: 'active',
  },
  {
    name: 'Chennai Traffic Police',
    twitter: {
      handle: '@ChennaiTPNews',
      verified: false,
      active: true,
      lastChecked: new Date(),
    },
    jurisdiction: {
      type: 'department',
      level: 3,
      country: 'India',
      state: 'Tamil Nadu',
      city: 'Chennai',
      geohashes: ['tfh3'],
    },
    issueCategories: ['traffic_signal', 'pothole'],
    priority: 1,
    status: 'active',
  },

  // ========================================
  // HYDERABAD (Telangana)
  // ========================================
  {
    name: 'GHMC (Greater Hyderabad Municipal Corporation)',
    nameLocal: 'గ్రేటర్ హైదరాబాద్ మునిసిపల్ కార్పొరేషన్',
    twitter: {
      handle: '@GHMCOnline',
      verified: true,
      active: true,
      lastChecked: new Date(),
    },
    jurisdiction: {
      type: 'city',
      level: 3,
      country: 'India',
      state: 'Telangana',
      city: 'Hyderabad',
      geohashes: ['tep8'], // Hyderabad area
    },
    issueCategories: [
      'pothole',
      'garbage',
      'streetlight',
      'drainage',
      'water_supply',
      'sewage',
      'parks',
      'other',
    ],
    priority: 1,
    contactInfo: {
      website: 'https://ghmc.gov.in',
      phone: '040-21111111',
    },
    status: 'active',
  },
  {
    name: 'Hyderabad Traffic Police',
    twitter: {
      handle: '@HYDTP',
      verified: true,
      active: true,
      lastChecked: new Date(),
    },
    jurisdiction: {
      type: 'department',
      level: 3,
      country: 'India',
      state: 'Telangana',
      city: 'Hyderabad',
      geohashes: ['tep8'],
    },
    issueCategories: ['traffic_signal', 'pothole', 'encroachment'],
    priority: 1,
    status: 'active',
  },

  // ========================================
  // STATE & NATIONAL LEVEL (Fallbacks)
  // ========================================
  {
    name: 'MyGov India',
    twitter: {
      handle: '@mygovindia',
      verified: true,
      active: true,
      lastChecked: new Date(),
    },
    jurisdiction: {
      type: 'national',
      level: 1,
      country: 'India',
      geohashes: [], // National - no specific geohash
    },
    issueCategories: [
      'pothole',
      'garbage',
      'streetlight',
      'drainage',
      'water_supply',
      'sewage',
      'traffic_signal',
      'encroachment',
      'stray_animals',
      'parks',
      'other',
    ],
    priority: 3, // Fallback only
    contactInfo: {
      website: 'https://www.mygov.in',
    },
    status: 'active',
  },
];

/**
 * Get total count of authorities in database
 */
export function getAuthoritiesCount(): number {
  return AUTHORITIES_SEED_DATA.length;
}

/**
 * Get authorities by city
 */
export function getAuthoritiesByCity(city: string): typeof AUTHORITIES_SEED_DATA {
  return AUTHORITIES_SEED_DATA.filter(
    (auth) => auth.jurisdiction.city?.toLowerCase() === city.toLowerCase()
  );
}

/**
 * Get authorities by state
 */
export function getAuthoritiesByState(state: string): typeof AUTHORITIES_SEED_DATA {
  return AUTHORITIES_SEED_DATA.filter(
    (auth) => auth.jurisdiction.state?.toLowerCase() === state.toLowerCase()
  );
}
