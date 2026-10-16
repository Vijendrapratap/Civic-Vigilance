/**
 * App Store Metadata
 *
 * Centralized store for app store descriptions, keywords, and URLs.
 * Used for both Apple App Store and Google Play Store submissions.
 */

export const APP_VERSION = '1.0.0';
export const BUILD_NUMBER = '1';

export const APP_STORE_METADATA = {
  shortDescription:
    'Report civic issues. Amplify your voice. Hold authorities accountable.',

  longDescription: `CivicVigilance empowers citizens to report civic issues like potholes, garbage, broken streetlights, and drainage problems with evidence-backed reports.

KEY FEATURES:

- Photo Evidence: Capture civic issues with your camera, automatically tagged with GPS coordinates
- 3-Tier Privacy: Choose how you want to report:
  - Via @CivicVigilance (identity protected)
  - Via your personal Twitter/X (public credit)
  - App Only (100% private, community-only)
- Smart Authority Matching: Automatically identifies and tags the right government authorities based on your location and issue category
- Social Media Amplification: Reports are posted to Twitter/X, tagging relevant authorities to drive accountability
- Community Engagement: Upvote, comment, and share reports to amplify the most urgent civic issues
- Anonymous Reporting: Report safely with auto-generated anonymous usernames
- Multi-Platform Contact: Reach authorities via Twitter/X, WhatsApp, Email, and Phone
- Nearby Issues: Discover civic issues in your neighborhood sorted by proximity

CivicVigilance operates on a simple principle: "We don't fix potholes. We make them impossible to ignore."

Built for citizens who believe that civic engagement should be easy, safe, and impactful.`,

  keywords: [
    'civic reporting',
    'pothole reporter',
    'city issues',
    'citizen engagement',
    'civic tech',
    'municipal complaints',
    'infrastructure reporting',
    'community voice',
    'public works',
    'city maintenance',
    'urban issues',
    'government accountability',
    'civic participation',
  ],

  supportUrl: 'mailto:support@civicvigilance.com',
  privacyPolicyUrl: 'https://civicvigilance.com/privacy',
  termsOfServiceUrl: 'https://civicvigilance.com/terms',
  marketingUrl: 'https://civicvigilance.com',

  categories: {
    ios: 'Utilities',
    android: 'Social',
  },

  contentRating: '12+',
};
