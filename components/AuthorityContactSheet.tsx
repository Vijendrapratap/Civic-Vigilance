/**
 * Authority Contact Sheet Component
 *
 * Displays all available contact methods for an authority:
 * - Twitter, WhatsApp, Instagram, Facebook, Telegram
 * - Email, Phone, Toll-Free, Website
 *
 * Shows verification badges and allows one-tap contact actions
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Authority } from '../types';
import { getAuthorityContactOptions, ContactOption } from '../lib/authorityContactManager';

interface Props {
  authority: Authority;
  onClose?: () => void;
}

export default function AuthorityContactSheet({ authority, onClose }: Props) {
  const contactOptions = getAuthorityContactOptions(authority);

  const handleContactPress = (option: ContactOption) => {
    Alert.alert(
      `Contact via ${option.platform}`,
      `Open ${option.label}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open',
          onPress: () => {
            try {
              option.action();
            } catch (error) {
              console.error('[ContactSheet] Error opening contact:', error);
              Alert.alert('Error', `Could not open ${option.platform}`);
            }
          },
        },
      ]
    );
  };

  const getPlatformColor = (platform: string): string => {
    const colors: Record<string, string> = {
      twitter: '#1DA1F2',
      whatsapp: '#25D366',
      instagram: '#E4405F',
      facebook: '#1877F2',
      telegram: '#0088CC',
      email: '#EA4335',
      phone: '#34A853',
      website: '#6B7280',
    };
    return colors[platform] || '#6B7280';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="shield-checkmark" size={24} color="#2563EB" />
          <View style={styles.headerText}>
            <Text style={styles.authorityName}>{authority.name}</Text>
            {authority.nameLocal && (
              <Text style={styles.authorityNameLocal}>{authority.nameLocal}</Text>
            )}
          </View>
        </View>
        {onClose && (
          <TouchableOpacity onPress={onClose} hitSlop={8}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      {/* Jurisdiction Info */}
      <View style={styles.jurisdiction}>
        <Ionicons name="location-outline" size={16} color="#6B7280" />
        <Text style={styles.jurisdictionText}>
          {authority.jurisdiction.city && `${authority.jurisdiction.city}, `}
          {authority.jurisdiction.state}
        </Text>
      </View>

      {/* Response Metrics (if available) */}
      {authority.responseMetrics && (
        <View style={styles.metrics}>
          <View style={styles.metricItem}>
            <Ionicons name="time-outline" size={16} color="#34D399" />
            <Text style={styles.metricText}>
              Avg. Response: {authority.responseMetrics.averageResponseTime}h
            </Text>
          </View>
          {authority.responseMetrics.totalIssuesAddressed && (
            <View style={styles.metricItem}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#34D399" />
              <Text style={styles.metricText}>
                {authority.responseMetrics.totalIssuesAddressed.toLocaleString()} issues addressed
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Contact Options */}
      <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Contact Methods</Text>

        {contactOptions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="alert-circle-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>No contact information available</Text>
          </View>
        ) : (
          contactOptions.map((option, index) => (
            <TouchableOpacity
              key={`${option.platform}-${index}`}
              style={[
                styles.optionCard,
                { borderLeftColor: getPlatformColor(option.platform) },
              ]}
              onPress={() => handleContactPress(option)}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${getPlatformColor(option.platform)}15` },
                  ]}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={24}
                    color={getPlatformColor(option.platform)}
                  />
                </View>
                <View style={styles.optionText}>
                  <View style={styles.optionLabelRow}>
                    <Text style={styles.optionLabel}>{option.label}</Text>
                    {option.verified && (
                      <View style={styles.verifiedBadge}>
                        <Ionicons name="checkmark-circle" size={14} color="#34D399" />
                        <Text style={styles.verifiedText}>Verified</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.optionPlatform}>{option.platform.toUpperCase()}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
        <Text style={styles.footerText}>
          Tap any option to contact the authority directly
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  headerText: {
    flex: 1,
  },
  authorityName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#23272F',
    marginBottom: 4,
  },
  authorityNameLocal: {
    fontSize: 14,
    color: '#6B7280',
  },
  jurisdiction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
  },
  jurisdictionText: {
    fontSize: 14,
    color: '#4B5563',
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ECFDF5',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricText: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#23272F',
    padding: 16,
    paddingBottom: 12,
  },
  optionsList: {
    flex: 1,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#23272F',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  optionPlatform: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 13,
    color: '#6B7280',
  },
});
