/**
 * Terms of Service Screen
 *
 * Complete terms of service for CivicVigilance
 * Covers: Indian jurisdiction, DPDP Act 2023, age requirements, indemnification
 */

import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function TermsOfServiceScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color="#23272F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last Updated: February 11, 2026</Text>

        <Text style={styles.intro}>
          Welcome to CivicVigilance. By using our service, you agree to these terms. Please read them carefully.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Our Philosophy</Text>
          <Text style={styles.paragraph}>
            CivicVigilance operates on a simple principle: <Text style={styles.bold}>"We don't fix potholes. We make them impossible to ignore."</Text>
          </Text>
          <Text style={styles.paragraph}>
            We are a civic amplification platform, not a resolution tracking service. We empower citizens to raise their voice and hold authorities accountable through social media amplification.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By accessing and using CivicVigilance ("the Service"), you accept and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Age Requirement</Text>
          <Text style={styles.paragraph}>
            You must be at least <Text style={styles.bold}>13 years of age</Text> to create an account and use CivicVigilance. If you are under 18, you represent that you have your parent's or legal guardian's consent to use the Service.
          </Text>
          <Text style={styles.paragraph}>
            We do not knowingly collect personal information from children under 13. If we discover that a child under 13 has provided us with personal data, we will delete that information promptly.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. User Accounts</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>4.1 Account Creation:</Text> You may create an account using email/password, Google Sign-In, or use the app in guest/demo mode with limited functionality.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>4.2 Username Selection:</Text> You can choose a custom username or use our auto-generated anonymous username (Anonymous_Citizen_XXXX).
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>4.3 Account Security:</Text> You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately of any unauthorized access.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>4.4 One Account Per Person:</Text> Each individual may maintain only one active account. Creating multiple accounts to circumvent bans or restrictions is prohibited.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Privacy & Posting Options</Text>
          <Text style={styles.paragraph}>
            CivicVigilance offers three privacy tiers for posting civic issues:
          </Text>
          <Text style={styles.bulletPoint}>
            {'\u{1F6E1}'} <Text style={styles.bold}>Via @CivicVigilance:</Text> Your identity is protected. Issues are posted from our official Twitter/X account.
          </Text>
          <Text style={styles.bulletPoint}>
            {'\u{1F464}'} <Text style={styles.bold}>Via My Twitter:</Text> Issues are posted from your personal Twitter/X account (requires Twitter/X connection).
          </Text>
          <Text style={styles.bulletPoint}>
            {'\u{1F512}'} <Text style={styles.bold}>App Only:</Text> 100% private. Issues are visible only within the app community.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Content Guidelines</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>6.1 Acceptable Use:</Text> You may report genuine civic issues including potholes, garbage, broken infrastructure, drainage problems, and similar public interest matters.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>6.2 Prohibited Content:</Text> You may NOT post:
          </Text>
          <Text style={styles.bulletPoint}>• Hateful, abusive, or threatening content</Text>
          <Text style={styles.bulletPoint}>• Personal attacks or harassment of individuals</Text>
          <Text style={styles.bulletPoint}>• False or deliberately misleading information</Text>
          <Text style={styles.bulletPoint}>• Spam, promotional, or commercial content</Text>
          <Text style={styles.bulletPoint}>• Content violating applicable laws or regulations</Text>
          <Text style={styles.bulletPoint}>• Private information of others without their consent</Text>
          <Text style={styles.bulletPoint}>• Obscene or sexually explicit material</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>6.3 Moderation:</Text> We reserve the right to remove content that violates these guidelines and to suspend or terminate accounts of repeat offenders.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Content Ownership & License</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>7.1 Your Content:</Text> You retain full ownership of photos and text you post through CivicVigilance.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>7.2 License Grant:</Text> By posting content, you grant CivicVigilance a non-exclusive, worldwide, royalty-free license to display, distribute, reproduce, and amplify your content in connection with the Service. This includes posting your reports to Twitter/X as per your chosen privacy tier.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>7.3 License Termination:</Text> This license ends when you delete your content or your account, except for content already shared publicly on third-party platforms (e.g., Twitter/X).
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>7.4 Our Content:</Text> CivicVigilance logos, trademarks, and app design are our intellectual property and may not be used without written permission.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Authority Tagging</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>8.1 Smart Matching:</Text> Our algorithm automatically suggests relevant authorities based on your location and issue category.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>8.2 Multi-Platform Contact:</Text> You can contact authorities via Twitter/X, WhatsApp, Email, Phone, and other platforms.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>8.3 No Guarantee:</Text> We cannot guarantee authority responses or action on reported issues. CivicVigilance is an amplification tool, not a direct government service channel.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Disclaimers</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>9.1 No Resolution Tracking:</Text> We DO NOT track whether authorities fix reported issues. We amplify citizen voices, not track resolutions.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>9.2 No Service Guarantees:</Text> We do not guarantee that authorities will respond to or take action on any report.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>9.3 Location Accuracy:</Text> GPS coordinates are approximate. Verify location details before reporting.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>9.4 Third-Party Platforms:</Text> We are not responsible for policies, outages, or changes on Twitter/X, WhatsApp, Google, or other third-party platforms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            CivicVigilance is provided "AS IS" and "AS AVAILABLE" without warranties of any kind. To the maximum extent permitted by applicable law, we are not liable for:
          </Text>
          <Text style={styles.bulletPoint}>• Issues not being resolved by authorities</Text>
          <Text style={styles.bulletPoint}>• Inaccurate GPS or address data</Text>
          <Text style={styles.bulletPoint}>• Third-party platform failures or policy changes</Text>
          <Text style={styles.bulletPoint}>• Content posted by other users</Text>
          <Text style={styles.bulletPoint}>• Any indirect, incidental, special, or consequential damages arising from use of the Service</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Indemnification</Text>
          <Text style={styles.paragraph}>
            You agree to indemnify and hold harmless CivicVigilance, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable legal fees) arising from:
          </Text>
          <Text style={styles.bulletPoint}>• Your use of the Service</Text>
          <Text style={styles.bulletPoint}>• Your violation of these Terms</Text>
          <Text style={styles.bulletPoint}>• Your violation of any third-party rights</Text>
          <Text style={styles.bulletPoint}>• Any content you post through the Service</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Governing Law & Jurisdiction</Text>
          <Text style={styles.paragraph}>
            These Terms shall be governed by and construed in accordance with the laws of India, including but not limited to:
          </Text>
          <Text style={styles.bulletPoint}>• The Information Technology Act, 2000</Text>
          <Text style={styles.bulletPoint}>• The Digital Personal Data Protection Act, 2023</Text>
          <Text style={styles.bulletPoint}>• The Indian Contract Act, 1872</Text>
          <Text style={styles.paragraph}>
            Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in India.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. Dispute Resolution</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>13.1 Informal Resolution:</Text> Before initiating formal proceedings, you agree to first contact us at legal@civicvigilance.com to attempt to resolve any dispute informally within 30 days.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>13.2 Arbitration:</Text> If informal resolution fails, disputes shall be resolved through binding arbitration under the Arbitration and Conciliation Act, 1996 (India). The arbitration shall be conducted in English, and the seat of arbitration shall be in India.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>14. Changes to Terms</Text>
          <Text style={styles.paragraph}>
            We may update these Terms at any time. We will notify you of material changes via in-app notification or email. Continued use of the Service after changes constitutes acceptance of the new Terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>15. Termination</Text>
          <Text style={styles.paragraph}>
            We reserve the right to suspend or terminate accounts that violate these Terms or our Community Guidelines. You may delete your account at any time through Settings. Upon termination, your right to use the Service ceases immediately.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>16. Contact Us</Text>
          <Text style={styles.paragraph}>
            For questions about these Terms, contact us at:
          </Text>
          <Text style={styles.bulletPoint}>• Email: legal@civicvigilance.com</Text>
          <Text style={styles.bulletPoint}>• Support: support@civicvigilance.com</Text>
          <Text style={styles.bulletPoint}>• Twitter/X: @CivicVigilance</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using CivicVigilance, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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
  footer: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    textAlign: 'center',
  },
});
