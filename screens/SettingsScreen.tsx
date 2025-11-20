/**
 * Settings Screen
 *
 * Comprehensive settings with all user preferences:
 * - Account settings
 * - Privacy preferences
 * - Notification settings
 * - Connected accounts
 * - About & Legal
 */

import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const navigation = useNavigation<any>();

  // Mock user data (replace with actual user state)
  const [user, setUser] = useState({
    username: 'TestCitizen_2024',
    email: 'test@civic.com',
    anonymousMode: false,
    twitterConnected: false,
    privacyDefault: 'civic_vigilance' as 'civic_vigilance' | 'personal' | 'none',
    notifications: {
      nearby: true,
      comments: true,
      upvotes: true,
      replies: true,
      twitter: false,
      digest: true,
      trending: false,
      similar: true,
    },
    profileVisibility: 'public' as 'public' | 'private',
    showLocation: true,
  });

  const toggleNotification = (key: keyof typeof user.notifications) => {
    setUser({
      ...user,
      notifications: {
        ...user.notifications,
        [key]: !user.notifications[key],
      },
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement logout logic
            console.log('[Settings] Logout');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your reports, comments, and data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement account deletion
            console.log('[Settings] Delete account');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color="#23272F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.settingRow} onPress={() => console.log('Edit profile')}>
            <View style={styles.settingLeft}>
              <Ionicons name="person-outline" size={22} color="#4B5563" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Username</Text>
                <Text style={styles.settingValue}>{user.username}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="mail-outline" size={22} color="#4B5563" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Email</Text>
                <Text style={styles.settingValue}>{user.email}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="eye-off-outline" size={22} color="#4B5563" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Anonymous Mode</Text>
                <Text style={styles.settingSubtext}>Hide your real identity</Text>
              </View>
            </View>
            <Switch
              value={user.anonymousMode}
              onValueChange={(val) => setUser({ ...user, anonymousMode: val })}
              trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
            />
          </View>
        </View>

        {/* Connected Accounts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Accounts</Text>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="logo-google" size={22} color="#EA4335" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Google</Text>
                <Text style={styles.settingConnected}>Connected</Text>
              </View>
            </View>
            <Ionicons name="checkmark-circle" size={24} color="#34D399" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => console.log('Connect Twitter')}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="logo-twitter" size={22} color="#1DA1F2" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Twitter</Text>
                <Text style={styles.settingDisconnected}>
                  {user.twitterConnected ? 'Connected' : 'Not Connected'}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="shield-outline" size={22} color="#4B5563" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Default Privacy</Text>
                <Text style={styles.settingValue}>
                  {user.privacyDefault === 'civic_vigilance' && 'Via @CivicVigilance'}
                  {user.privacyDefault === 'personal' && 'Via My Twitter'}
                  {user.privacyDefault === 'none' && 'App Only'}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="eye-outline" size={22} color="#4B5563" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Profile Visibility</Text>
                <Text style={styles.settingValue}>{user.profileVisibility}</Text>
              </View>
            </View>
            <Switch
              value={user.profileVisibility === 'public'}
              onValueChange={(val) =>
                setUser({ ...user, profileVisibility: val ? 'public' : 'private' })
              }
              trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="location-outline" size={22} color="#4B5563" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Show Location</Text>
                <Text style={styles.settingSubtext}>Display city/state on profile</Text>
              </View>
            </View>
            <Switch
              value={user.showLocation}
              onValueChange={(val) => setUser({ ...user, showLocation: val })}
              trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
            />
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="location" size={22} color="#4B5563" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Nearby Issues</Text>
                <Text style={styles.settingSubtext}>Issues within 2km</Text>
              </View>
            </View>
            <Switch
              value={user.notifications.nearby}
              onValueChange={() => toggleNotification('nearby')}
              trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="chatbubble-outline" size={22} color="#4B5563" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Comments</Text>
                <Text style={styles.settingSubtext}>On your posts</Text>
              </View>
            </View>
            <Switch
              value={user.notifications.comments}
              onValueChange={() => toggleNotification('comments')}
              trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="arrow-up-outline" size={22} color="#4B5563" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Upvotes</Text>
                <Text style={styles.settingSubtext}>When someone upvotes you</Text>
              </View>
            </View>
            <Switch
              value={user.notifications.upvotes}
              onValueChange={() => toggleNotification('upvotes')}
              trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="return-down-forward-outline" size={22} color="#4B5563" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Replies</Text>
                <Text style={styles.settingSubtext}>To your comments</Text>
              </View>
            </View>
            <Switch
              value={user.notifications.replies}
              onValueChange={() => toggleNotification('replies')}
              trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="logo-twitter" size={22} color="#1DA1F2" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Twitter Engagement</Text>
                <Text style={styles.settingSubtext}>Retweets, likes on Twitter</Text>
              </View>
            </View>
            <Switch
              value={user.notifications.twitter}
              onValueChange={() => toggleNotification('twitter')}
              trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="mail-open-outline" size={22} color="#4B5563" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Weekly Digest</Text>
                <Text style={styles.settingSubtext}>Summary email every week</Text>
              </View>
            </View>
            <Switch
              value={user.notifications.digest}
              onValueChange={() => toggleNotification('digest')}
              trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="flame-outline" size={22} color="#4B5563" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Trending Issues</Text>
                <Text style={styles.settingSubtext}>In your city</Text>
              </View>
            </View>
            <Switch
              value={user.notifications.trending}
              onValueChange={() => toggleNotification('trending')}
              trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="duplicate-outline" size={22} color="#4B5563" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Similar Issues</Text>
                <Text style={styles.settingSubtext}>Nearby similar reports</Text>
              </View>
            </View>
            <Switch
              value={user.notifications.similar}
              onValueChange={() => toggleNotification('similar')}
              trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
            />
          </View>
        </View>

        {/* About & Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About & Legal</Text>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => navigation.navigate('TermsOfService')}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="document-text-outline" size={22} color="#4B5563" />
              <Text style={styles.settingLabel}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="shield-checkmark-outline" size={22} color="#4B5563" />
              <Text style={styles.settingLabel}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="information-circle-outline" size={22} color="#4B5563" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Version</Text>
                <Text style={styles.settingValue}>1.0.0 (Build 1)</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>

          <TouchableOpacity style={styles.settingRowDanger} onPress={handleLogout}>
            <View style={styles.settingLeft}>
              <Ionicons name="log-out-outline" size={22} color="#DC2626" />
              <Text style={styles.settingLabelDanger}>Logout</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRowDanger} onPress={handleDeleteAccount}>
            <View style={styles.settingLeft}>
              <Ionicons name="trash-outline" size={22} color="#DC2626" />
              <Text style={styles.settingLabelDanger}>Delete Account</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
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
  },
  section: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingRowDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FEE2E2',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#23272F',
  },
  settingLabelDanger: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
  settingValue: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  settingSubtext: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  settingConnected: {
    fontSize: 14,
    color: '#059669',
    marginTop: 2,
    fontWeight: '500',
  },
  settingDisconnected: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
});
