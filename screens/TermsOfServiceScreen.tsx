/**
 * Terms of Service Screen
 *
 * Displays the complete terms of service for CivicVigilance
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
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color="#23272F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last Updated: November 20, 2025</Text>

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
            By accessing and using CivicVigilance ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. User Accounts</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>3.1 Account Creation:</Text> You may create an account using Google Sign-In or Twitter OAuth.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>3.2 Username Selection:</Text> You can choose a custom username or use our auto-generated anonymous username (Anonymous_Citizen_XXXX).
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>3.3 Account Security:</Text> You are responsible for maintaining the confidentiality of your account credentials.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>3.4 Test Account:</Text> We provide test@civic.com for testing purposes. Do not use for actual civic reporting.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Privacy & Posting Options</Text>
          <Text style={styles.paragraph}>
            CivicVigilance offers three privacy tiers for posting civic issues:
          </Text>
          <Text style={styles.bulletPoint}>
            🛡️ <Text style={styles.bold}>Via @CivicVigilance:</Text> Your identity is protected. Issues are posted from our official Twitter account.
          </Text>
          <Text style={styles.bulletPoint}>
            👤 <Text style={styles.bold}>Via My Twitter:</Text> Issues are posted from your personal Twitter account (requires Twitter connection).
          </Text>
          <Text style={styles.bulletPoint}>
            🔒 <Text style={styles.bold}>App Only:</Text> 100% private. Issues are visible only within the app community.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Content Guidelines</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>5.1 Acceptable Use:</Text> You may report genuine civic issues including potholes, garbage, broken infrastructure, etc.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>5.2 Prohibited Content:</Text> You may NOT post:
          </Text>
          <Text style={styles.bulletPoint}>• Hateful, abusive, or threatening content</Text>
          <Text style={styles.bulletPoint}>• Personal attacks or harassment</Text>
          <Text style={styles.bulletPoint}>• False or misleading information</Text>
          <Text style={styles.bulletPoint}>• Spam or promotional content</Text>
          <Text style={styles.bulletPoint}>• Content violating laws or regulations</Text>
          <Text style={styles.bulletPoint}>• Private information of others without consent</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>5.3 Moderation:</Text> We reserve the right to remove content that violates these guidelines.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Authority Tagging</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>6.1 Smart Matching:</Text> Our algorithm automatically suggests relevant authorities based on your location and issue category.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>6.2 Multi-Platform Contact:</Text> You can contact authorities via Twitter, WhatsApp, Email, Phone, and other platforms.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>6.3 No Guarantee:</Text> We cannot guarantee authority responses. CivicVigilance is an amplification tool, not a direct service channel.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Intellectual Property</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>7.1 Your Content:</Text> You retain ownership of photos and text you post. By posting, you grant CivicVigilance a license to display and amplify your content.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>7.2 Our Content:</Text> CivicVigilance logos, trademarks, and app design are our intellectual property.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Disclaimers</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>8.1 No Resolution Tracking:</Text> We DO NOT track whether authorities fix reported issues. We amplify, not track.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>8.2 No Service Guarantees:</Text> We do not guarantee that authorities will respond or take action.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>8.3 Location Accuracy:</Text> GPS coordinates are approximate. Verify location details before reporting.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>8.4 Third-Party Platforms:</Text> We are not responsible for Twitter, WhatsApp, or other third-party platform policies.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            CivicVigilance is provided "as is" without warranties. We are not liable for:
          </Text>
          <Text style={styles.bulletPoint}>• Issues not being resolved by authorities</Text>
          <Text style={styles.bulletPoint}>• Inaccurate GPS or address data</Text>
          <Text style={styles.bulletPoint}>• Third-party platform failures (Twitter API, etc.)</Text>
          <Text style={styles.bulletPoint}>• Content posted by other users</Text>
          <Text style={styles.bulletPoint}>• Any damages arising from use of the Service</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Changes to Terms</Text>
          <Text style={styles.paragraph}>
            We may update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Termination</Text>
          <Text style={styles.paragraph}>
            We reserve the right to suspend or terminate accounts that violate these Terms or our Community Guidelines.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Contact Us</Text>
          <Text style={styles.paragraph}>
            For questions about these Terms, contact us at:
          </Text>
          <Text style={styles.bulletPoint}>• Email: legal@civicvigilance.com</Text>
          <Text style={styles.bulletPoint}>• Twitter: @CivicVigilance</Text>
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
