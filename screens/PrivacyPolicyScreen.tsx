/**
 * Privacy Policy Screen
 *
 * Complete privacy policy for CivicVigilance
 * Covers: DPDP Act 2023 (India), GDPR basics, data retention, Supabase stack
 */

import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function PrivacyPolicyScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color="#23272F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last Updated: February 11, 2026</Text>

        <Text style={styles.intro}>
          CivicVigilance ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and safeguard your information when you use our mobile application ("the App"). By using the App, you consent to the practices described in this policy.
        </Text>

        {/* Section 1 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>

          <Text style={styles.subsectionTitle}>1.1 Account Information</Text>
          <Text style={styles.bulletPoint}>• Email address (from sign-up or Google Sign-In)</Text>
          <Text style={styles.bulletPoint}>• Twitter/X handle (if connected)</Text>
          <Text style={styles.bulletPoint}>• Username (chosen or auto-generated as "Anonymous_Citizen_XXXX")</Text>
          <Text style={styles.bulletPoint}>• Profile photo (optional)</Text>

          <Text style={styles.subsectionTitle}>1.2 Issue Reports</Text>
          <Text style={styles.bulletPoint}>• Photos you upload (evidence of civic issues)</Text>
          <Text style={styles.bulletPoint}>• GPS coordinates of reported issues</Text>
          <Text style={styles.bulletPoint}>• Full address (obtained via reverse geocoding)</Text>
          <Text style={styles.bulletPoint}>• Issue title, description, and category</Text>
          <Text style={styles.bulletPoint}>• Timestamp of report</Text>

          <Text style={styles.subsectionTitle}>1.3 Usage Data</Text>
          <Text style={styles.bulletPoint}>• Votes (upvotes/downvotes)</Text>
          <Text style={styles.bulletPoint}>• Comments on issues</Text>
          <Text style={styles.bulletPoint}>• Share actions</Text>
          <Text style={styles.bulletPoint}>• App interactions for improving user experience</Text>

          <Text style={styles.subsectionTitle}>1.4 Location Data</Text>
          <Text style={styles.bulletPoint}>• Real-time GPS when reporting issues (foreground only)</Text>
          <Text style={styles.bulletPoint}>• Approximate location for "nearby" feed sorting</Text>
          <Text style={styles.bulletPoint}>• Geohash encoding for authority matching</Text>
          <Text style={styles.bulletPoint}>• We NEVER track your location in the background</Text>
        </View>

        {/* Section 2 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>2.1 Core Functionality:</Text>
          </Text>
          <Text style={styles.bulletPoint}>• Display your reports to other users (based on your privacy settings)</Text>
          <Text style={styles.bulletPoint}>• Match reports with relevant civic authorities using geohash</Text>
          <Text style={styles.bulletPoint}>• Enable community engagement (votes, comments, shares)</Text>
          <Text style={styles.bulletPoint}>• Sort feed by nearby/newest/trending</Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>2.2 Twitter/X Posting:</Text>
          </Text>
          <Text style={styles.bulletPoint}>• Post to @CivicVigilance (when you choose "Via @CivicVigilance")</Text>
          <Text style={styles.bulletPoint}>• Post to your Twitter/X account (when you choose "Via My Twitter")</Text>
          <Text style={styles.bulletPoint}>• Tag relevant authority handles for accountability</Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>2.3 Service Improvement:</Text>
          </Text>
          <Text style={styles.bulletPoint}>• Improve app performance and stability</Text>
          <Text style={styles.bulletPoint}>• Understand usage patterns to enhance features</Text>
          <Text style={styles.bulletPoint}>• Identify popular issue categories by region</Text>
        </View>

        {/* Section 3 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Privacy Tiers</Text>

          <Text style={styles.paragraph}>
            CivicVigilance offers three privacy levels for every report:
          </Text>

          <Text style={styles.privacyTier}>
            {'\u{1F6E1}'} <Text style={styles.bold}>Via @CivicVigilance (Identity Protected)</Text>
          </Text>
          <Text style={styles.bulletPoint}>• Your identity is NOT revealed publicly</Text>
          <Text style={styles.bulletPoint}>• Posted from the official @CivicVigilance Twitter/X account</Text>
          <Text style={styles.bulletPoint}>• Visible to public + app community</Text>
          <Text style={styles.bulletPoint}>• Relevant authorities are tagged</Text>

          <Text style={styles.privacyTier}>
            {'\u{1F464}'} <Text style={styles.bold}>Via My Twitter (Public Identity)</Text>
          </Text>
          <Text style={styles.bulletPoint}>• Posted from YOUR personal Twitter/X account</Text>
          <Text style={styles.bulletPoint}>• Your identity is publicly visible</Text>
          <Text style={styles.bulletPoint}>• You get personal credit for the report</Text>
          <Text style={styles.bulletPoint}>• Requires Twitter/X OAuth connection</Text>

          <Text style={styles.privacyTier}>
            {'\u{1F512}'} <Text style={styles.bold}>App Only (100% Private)</Text>
          </Text>
          <Text style={styles.bulletPoint}>• NOT posted to any social media</Text>
          <Text style={styles.bulletPoint}>• Visible only within the app community</Text>
          <Text style={styles.bulletPoint}>• Your anonymous username is shown</Text>
          <Text style={styles.bulletPoint}>• No authority tagging on social media</Text>
        </View>

        {/* Section 4 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Data Sharing</Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>4.1 Public Sharing:</Text>
          </Text>
          <Text style={styles.bulletPoint}>
            • When you choose "Via @CivicVigilance" or "Via My Twitter", your report (photos, location, description) becomes PUBLIC on Twitter/X
          </Text>
          <Text style={styles.bulletPoint}>
            • Other app users can see your reports in the feed (with your chosen privacy level)
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>4.2 Authority Contact:</Text>
          </Text>
          <Text style={styles.bulletPoint}>
            • When you contact authorities via WhatsApp/Email/Phone, you share information directly with them (not through us)
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>4.3 We Do NOT Sell Data:</Text>
          </Text>
          <Text style={styles.bulletPoint}>• We never sell your personal information to third parties</Text>
          <Text style={styles.bulletPoint}>• We do not share data with advertisers</Text>
          <Text style={styles.bulletPoint}>• We do not engage in data brokering of any kind</Text>
        </View>

        {/* Section 5 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Data Storage & Security</Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>5.1 Storage Infrastructure:</Text>
          </Text>
          <Text style={styles.bulletPoint}>• Supabase (PostgreSQL) for data storage and user profiles</Text>
          <Text style={styles.bulletPoint}>• Supabase Storage for photo uploads</Text>
          <Text style={styles.bulletPoint}>• Supabase Auth for authentication and session management</Text>
          <Text style={styles.bulletPoint}>• Local SQLite for offline access and caching</Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>5.2 Security Measures:</Text>
          </Text>
          <Text style={styles.bulletPoint}>• TLS encryption for all data in transit</Text>
          <Text style={styles.bulletPoint}>• Row Level Security (RLS) policies on all database tables</Text>
          <Text style={styles.bulletPoint}>• Secure OAuth 2.0 with PKCE for Twitter/X authentication</Text>
          <Text style={styles.bulletPoint}>• No plain-text password storage</Text>
          <Text style={styles.bulletPoint}>• Regular security reviews of infrastructure</Text>
        </View>

        {/* Section 6 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Third-Party Services</Text>
          <Text style={styles.paragraph}>We integrate with the following services:</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Supabase:</Text> Backend infrastructure, authentication, and storage</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Google Sign-In:</Text> For authentication (privacy policy: google.com/policies/privacy)</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Twitter/X API:</Text> For posting reports and OAuth (privacy policy: twitter.com/privacy)</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Google Maps:</Text> For reverse geocoding and address lookup</Text>
        </View>

        {/* Section 7 - DPDP Act 2023 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. India Digital Personal Data Protection Act 2023 (DPDP Act)</Text>

          <Text style={styles.paragraph}>
            As a service available in India, CivicVigilance complies with the Digital Personal Data Protection Act, 2023. Under this Act:
          </Text>

          <Text style={styles.subsectionTitle}>7.1 Legal Basis for Processing</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Consent:</Text> We process your personal data based on your explicit consent provided at the time of account creation and app usage</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Legitimate Use:</Text> Certain processing is necessary for civic reporting functionality (the core purpose of the App)</Text>

          <Text style={styles.subsectionTitle}>7.2 Rights of Data Principals</Text>
          <Text style={styles.paragraph}>As a Data Principal under the DPDP Act, you have the right to:</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Right to Access:</Text> Request information about what personal data we hold about you</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Right to Correction:</Text> Request correction of inaccurate or incomplete personal data</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Right to Erasure:</Text> Request deletion of your personal data (subject to legal retention requirements)</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Right to Grievance Redressal:</Text> Lodge complaints regarding data processing</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Right to Nominate:</Text> Nominate a person to exercise your rights in case of death or incapacity</Text>

          <Text style={styles.subsectionTitle}>7.3 Data Fiduciary Obligations</Text>
          <Text style={styles.paragraph}>
            CivicVigilance, as a Data Fiduciary, undertakes to:
          </Text>
          <Text style={styles.bulletPoint}>• Process personal data only for the purposes consented to</Text>
          <Text style={styles.bulletPoint}>• Implement reasonable security safeguards</Text>
          <Text style={styles.bulletPoint}>• Notify the Data Protection Board and affected individuals in case of a data breach</Text>
          <Text style={styles.bulletPoint}>• Delete personal data when consent is withdrawn or the purpose is fulfilled</Text>

          <Text style={styles.subsectionTitle}>7.4 Grievance Officer</Text>
          <Text style={styles.paragraph}>
            For any grievances related to your personal data, you may contact our Grievance Officer:
          </Text>
          <Text style={styles.bulletPoint}>• Email: grievance@civicvigilance.com</Text>
          <Text style={styles.bulletPoint}>• Response time: Within 72 hours of receipt</Text>
        </View>

        {/* Section 8 - GDPR */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. International Users & GDPR</Text>
          <Text style={styles.paragraph}>
            For users in the European Economic Area (EEA) or other jurisdictions with similar data protection laws:
          </Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Access:</Text> Request a copy of your personal data</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Rectification:</Text> Correct inaccurate data</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Erasure:</Text> Delete your account and all associated data</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Portability:</Text> Export your data in a machine-readable format</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Restriction:</Text> Limit processing of your data</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Objection:</Text> Object to data processing based on legitimate interests</Text>
        </View>

        {/* Section 9 - Data Retention */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Data Retention</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>9.1 Active Accounts:</Text>
          </Text>
          <Text style={styles.bulletPoint}>• Account data is retained as long as your account is active</Text>
          <Text style={styles.bulletPoint}>• Issue reports remain visible in the app community unless deleted by you</Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>9.2 Account Deletion:</Text>
          </Text>
          <Text style={styles.bulletPoint}>• Upon account deletion, your profile data is removed within 30 days</Text>
          <Text style={styles.bulletPoint}>• Anonymized reports may be retained for civic data purposes</Text>
          <Text style={styles.bulletPoint}>• Tweets already posted to Twitter/X remain on that platform (managed by Twitter/X policies)</Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>9.3 Inactive Accounts:</Text>
          </Text>
          <Text style={styles.bulletPoint}>• Accounts inactive for 24 months may be flagged for deletion</Text>
          <Text style={styles.bulletPoint}>• You will be notified via email before any automatic deletion</Text>
        </View>

        {/* Section 10 - Tracking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Cookies & Tracking</Text>
          <Text style={styles.paragraph}>
            As a mobile application, CivicVigilance does not use browser cookies. However:
          </Text>
          <Text style={styles.bulletPoint}>• We use secure local storage (AsyncStorage) for session management</Text>
          <Text style={styles.bulletPoint}>• We do not use third-party advertising trackers</Text>
          <Text style={styles.bulletPoint}>• We do not engage in cross-app tracking</Text>
          <Text style={styles.bulletPoint}>• Basic usage analytics may be collected to improve app stability (opt-out available in Settings)</Text>
        </View>

        {/* Section 11 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Location Privacy</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>11.1 When We Access Location:</Text>
          </Text>
          <Text style={styles.bulletPoint}>• When taking photos for reports (foreground permission only)</Text>
          <Text style={styles.bulletPoint}>• When sorting feed by "nearby" (foreground permission only)</Text>
          <Text style={styles.bulletPoint}>• We NEVER track your location in the background</Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>11.2 Location Precision:</Text>
          </Text>
          <Text style={styles.bulletPoint}>• Exact GPS coordinates for reports (to help authorities locate issues)</Text>
          <Text style={styles.bulletPoint}>• Geohash encoding (~20km precision) for authority matching</Text>
          <Text style={styles.bulletPoint}>• You can choose to hide location display in your profile settings</Text>
        </View>

        {/* Section 12 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Children's Privacy</Text>
          <Text style={styles.paragraph}>
            CivicVigilance is not intended for users under 13 years of age. We do not knowingly collect personal data from children under 13. If you believe a child has provided us with personal data, please contact us to have it removed.
          </Text>
        </View>

        {/* Section 13 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. Changes to Privacy Policy</Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy periodically. We will notify you of significant changes via:
          </Text>
          <Text style={styles.bulletPoint}>• In-app notification</Text>
          <Text style={styles.bulletPoint}>• Email to your registered address</Text>
          <Text style={styles.bulletPoint}>• @CivicVigilance Twitter/X announcement</Text>
          <Text style={styles.paragraph}>
            Continued use of the App after changes constitutes acceptance of the updated policy.
          </Text>
        </View>

        {/* Section 14 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>14. Contact Us</Text>
          <Text style={styles.paragraph}>
            For privacy concerns, data requests, or grievances:
          </Text>
          <Text style={styles.bulletPoint}>• Privacy inquiries: privacy@civicvigilance.com</Text>
          <Text style={styles.bulletPoint}>• Grievance Officer: grievance@civicvigilance.com</Text>
          <Text style={styles.bulletPoint}>• General support: support@civicvigilance.com</Text>
          <Text style={styles.bulletPoint}>• Twitter/X: @CivicVigilance</Text>
          <Text style={styles.bulletPoint}>• In-app: Settings {'\u2192'} Data & Privacy</Text>
        </View>

        <View style={styles.footer}>
          <Ionicons name="shield-checkmark" size={32} color="#2563EB" style={{ alignSelf: 'center', marginBottom: 12 }} />
          <Text style={styles.footerText}>
            Your privacy matters to us. We are committed to transparency and giving you full control over your personal data.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#23272F',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  intro: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#23272F',
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 12,
  },
  bold: {
    fontWeight: '700',
    color: '#23272F',
  },
  bulletPoint: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 8,
    paddingLeft: 8,
  },
  privacyTier: {
    fontSize: 16,
    color: '#23272F',
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  footer: {
    backgroundColor: '#EFF6FF',
    padding: 20,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#2563EB',
    lineHeight: 20,
    textAlign: 'center',
  },
});
