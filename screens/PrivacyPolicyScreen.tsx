/**
 * Privacy Policy Screen
 *
 * Displays the complete privacy policy for CivicVigilance
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
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color="#23272F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last Updated: November 20, 2025</Text>

        <Text style={styles.intro}>
          CivicVigilance is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>

          <Text style={styles.subsectionTitle}>1.1 Account Information</Text>
          <Text style={styles.bulletPoint}>• Email address (from Google Sign-In)</Text>
          <Text style={styles.bulletPoint}>• Twitter handle (if connected)</Text>
          <Text style={styles.bulletPoint}>• Username (chosen or auto-generated)</Text>
          <Text style={styles.bulletPoint}>• Profile photo (optional)</Text>

          <Text style={styles.subsectionTitle}>1.2 Issue Reports</Text>
          <Text style={styles.bulletPoint}>• Photos you upload</Text>
          <Text style={styles.bulletPoint}>• GPS coordinates of reported issues</Text>
          <Text style={styles.bulletPoint}>• Full address (obtained via reverse geocoding)</Text>
          <Text style={styles.bulletPoint}>• Issue title, description, and category</Text>
          <Text style={styles.bulletPoint}>• Timestamp of report</Text>

          <Text style={styles.subsectionTitle}>1.3 Usage Data</Text>
          <Text style={styles.bulletPoint}>• Votes (upvotes/downvotes)</Text>
          <Text style={styles.bulletPoint}>• Comments on issues</Text>
          <Text style={styles.bulletPoint}>• Share actions</Text>
          <Text style={styles.bulletPoint}>• App interactions and analytics</Text>

          <Text style={styles.subsectionTitle}>1.4 Location Data</Text>
          <Text style={styles.bulletPoint}>• Real-time GPS when reporting issues</Text>
          <Text style={styles.bulletPoint}>• Approximate location for "nearby" feed sorting</Text>
          <Text style={styles.bulletPoint}>• Geohash encoding for authority matching</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>2.1 Core Functionality:</Text>
          </Text>
          <Text style={styles.bulletPoint}>• Display your reports to other users (based on privacy settings)</Text>
          <Text style={styles.bulletPoint}>• Match reports with relevant authorities using geohash</Text>
          <Text style={styles.bulletPoint}>• Enable community engagement (votes, comments, shares)</Text>
          <Text style={styles.bulletPoint}>• Sort feed by nearby/newest/trending</Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>2.2 Twitter Posting:</Text>
          </Text>
          <Text style={styles.bulletPoint}>• Post to @CivicVigilance (when you choose "Via @CivicVigilance")</Text>
          <Text style={styles.bulletPoint}>• Post to your Twitter (when you choose "Via My Twitter")</Text>
          <Text style={styles.bulletPoint}>• Tag relevant authority handles</Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>2.3 Analytics:</Text>
          </Text>
          <Text style={styles.bulletPoint}>• Improve app performance</Text>
          <Text style={styles.bulletPoint}>• Understand usage patterns</Text>
          <Text style={styles.bulletPoint}>• Identify popular issue categories</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Privacy Tiers</Text>

          <Text style={styles.paragraph}>
            CivicVigilance offers three privacy levels:
          </Text>

          <Text style={styles.privacyTier}>
            🛡️ <Text style={styles.bold}>Via @CivicVigilance (Identity Protected)</Text>
          </Text>
          <Text style={styles.bulletPoint}>• Your identity is NOT revealed</Text>
          <Text style={styles.bulletPoint}>• Posted from @CivicVigilance Twitter account</Text>
          <Text style={styles.bulletPoint}>• Visible to public + app community</Text>
          <Text style={styles.bulletPoint}>• Authorities are tagged on Twitter</Text>

          <Text style={styles.privacyTier}>
            👤 <Text style={styles.bold}>Via My Twitter (Public Identity)</Text>
          </Text>
          <Text style={styles.bulletPoint}>• Posted from YOUR Twitter account</Text>
          <Text style={styles.bulletPoint}>• Your identity is public</Text>
          <Text style={styles.bulletPoint}>• You get credit for the report</Text>
          <Text style={styles.bulletPoint}>• Requires Twitter OAuth connection</Text>

          <Text style={styles.privacyTier}>
            🔒 <Text style={styles.bold}>App Only (100% Private)</Text>
          </Text>
          <Text style={styles.bulletPoint}>• NOT posted to any social media</Text>
          <Text style={styles.bulletPoint}>• Visible only within app community</Text>
          <Text style={styles.bulletPoint}>• Your anonymous username is shown</Text>
          <Text style={styles.bulletPoint}>• No authority tagging on Twitter</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Data Sharing</Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>4.1 Public Sharing:</Text>
          </Text>
          <Text style={styles.bulletPoint}>
            • When you choose "Via @CivicVigilance" or "Via My Twitter", your report (photos, location, description) becomes PUBLIC on Twitter
          </Text>
          <Text style={styles.bulletPoint}>
            • Other app users can see your reports in the feed (with your chosen privacy level)
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>4.2 Authority Contact:</Text>
          </Text>
          <Text style={styles.bulletPoint}>
            • When you contact authorities via WhatsApp/Email/Phone, you are sharing information directly with them (not through us)
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>4.3 We Do NOT Sell Data:</Text>
          </Text>
          <Text style={styles.bulletPoint}>
            • We never sell your personal information to third parties
          </Text>
          <Text style={styles.bulletPoint}>
            • We do not share data with advertisers
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Data Storage & Security</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>5.1 Storage:</Text>
          </Text>
          <Text style={styles.bulletPoint}>• Firebase (Google Cloud) for authentication</Text>
          <Text style={styles.bulletPoint}>• Firestore for reports and comments</Text>
          <Text style={styles.bulletPoint}>• Firebase Storage for photos</Text>
          <Text style={styles.bulletPoint}>• Local SQLite for offline access</Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>5.2 Security Measures:</Text>
          </Text>
          <Text style={styles.bulletPoint}>• End-to-end encryption for data in transit</Text>
          <Text style={styles.bulletPoint}>• Secure OAuth 2.0 for Twitter authentication</Text>
          <Text style={styles.bulletPoint}>• Regular security audits</Text>
          <Text style={styles.bulletPoint}>• No plain-text password storage (OAuth only)</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Third-Party Services</Text>
          <Text style={styles.paragraph}>
            We integrate with:
          </Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Google Sign-In:</Text> For authentication (privacy policy: google.com/policies/privacy)</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Twitter API:</Text> For posting and OAuth (privacy policy: twitter.com/privacy)</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Google Maps:</Text> For geocoding and address lookup</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Firebase Analytics:</Text> For app performance tracking</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Your Rights</Text>
          <Text style={styles.paragraph}>
            You have the right to:
          </Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Access:</Text> Request a copy of your data</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Delete:</Text> Delete your account and all associated data</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Modify:</Text> Update your profile and preferences</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Export:</Text> Download your reports and comments</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Opt-Out:</Text> Disable notifications and analytics</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Location Privacy</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>8.1 When We Access Location:</Text>
          </Text>
          <Text style={styles.bulletPoint}>• When taking photos for reports (foreground permission)</Text>
          <Text style={styles.bulletPoint}>• When sorting feed by "nearby" (foreground permission)</Text>
          <Text style={styles.bulletPoint}>• We NEVER track your location in the background</Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>8.2 Location Precision:</Text>
          </Text>
          <Text style={styles.bulletPoint}>• Exact GPS coordinates for reports (to help authorities find issues)</Text>
          <Text style={styles.bulletPoint}>• Geohash encoding (precision: ~20km) for authority matching</Text>
          <Text style={styles.bulletPoint}>• You can choose to hide location in settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Children's Privacy</Text>
          <Text style={styles.paragraph}>
            CivicVigilance is not intended for users under 13 years old. We do not knowingly collect data from children.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Changes to Privacy Policy</Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy periodically. We will notify you of significant changes via:
          </Text>
          <Text style={styles.bulletPoint}>• In-app notification</Text>
          <Text style={styles.bulletPoint}>• Email to registered address</Text>
          <Text style={styles.bulletPoint}>• @CivicVigilance Twitter announcement</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Contact Us</Text>
          <Text style={styles.paragraph}>
            For privacy concerns or data requests:
          </Text>
          <Text style={styles.bulletPoint}>• Email: privacy@civicvigilance.com</Text>
          <Text style={styles.bulletPoint}>• Twitter: @CivicVigilance</Text>
          <Text style={styles.bulletPoint}>• In-app: Settings → Privacy → Contact Us</Text>
        </View>

        <View style={styles.footer}>
          <Ionicons name="shield-checkmark" size={32} color="#2563EB" style={{ alignSelf: 'center', marginBottom: 12 }} />
          <Text style={styles.footerText}>
            Your privacy matters to us. We are committed to transparency and giving you control over your data.
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
