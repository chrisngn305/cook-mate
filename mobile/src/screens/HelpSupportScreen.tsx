import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { colors, typography, spacing, borderRadius } from '../theme';

type FaqItem = {
  q: string;
  a: string;
};

const SUPPORT_EMAIL = 'support@example.com';
const DOCS_URL = 'https://example.com/docs';
const ISSUES_URL = 'https://example.com/issues';
const COMMUNITY_URL = 'https://example.com/community';

const faqs: FaqItem[] = [
  {
    q: 'I cannot log in, what should I do?',
    a: 'Make sure your email and password are correct. If you forgot your password, use the "Forgot Password" flow from the login screen.',
  },
  {
    q: 'Why don’t I see recipes?',
    a: 'Check your internet connection and try again. You can also pull to refresh on the Recipes tab.',
  },
  {
    q: 'How do I contact support?',
    a: `Tap "Email support" below. This will open your email app addressed to ${SUPPORT_EMAIL}.`,
  },
];

export default function HelpSupportScreen() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const version = Constants.expoConfig?.version || Constants.manifest2?.extra?.version || '1.0.0';

  const openUrl = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  const emailSupport = () => {
    const subject = encodeURIComponent('Cook Mate Support');
    const body = encodeURIComponent(`
App Version: ${version}
Platform: mobile

Describe your issue here...
`);
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Help & Support</Text>
        </View>

        {/* Quick actions */}
        <View style={styles.cardRow}>
          <TouchableOpacity style={styles.quickAction} onPress={emailSupport}>
            <Ionicons name="mail-outline" size={22} color={colors.primary} />
            <Text style={styles.quickActionText}>Email support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickAction} onPress={() => openUrl(DOCS_URL)} disabled>
            <Ionicons name="book-outline" size={22} color={colors.primary} />
            <Text style={styles.quickActionText}>Open docs</Text>
          </TouchableOpacity>
        </View>

        {/* Links */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.linkRow} onPress={() => openUrl(ISSUES_URL)} disabled>
            <View style={styles.linkLeft}>
              <Ionicons name="bug-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.linkText}>Report an issue</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.thinDivider} />

          <TouchableOpacity style={styles.linkRow} onPress={() => openUrl(COMMUNITY_URL)} disabled>
            <View style={styles.linkLeft}>
              <Ionicons name="people-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.linkText}>Join the community</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* FAQ */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqs.map((item, idx) => {
            const isOpen = expandedIndex === idx;
            return (
              <View key={idx}>
                <TouchableOpacity
                  style={styles.faqHeader}
                  onPress={() => setExpandedIndex(isOpen ? null : idx)}
                >
                  <Text style={styles.faqQuestion}>{item.q}</Text>
                  <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textSecondary} />
                </TouchableOpacity>
                {isOpen && <Text style={styles.faqAnswer}>{item.a}</Text>}
                {idx < faqs.length - 1 && <View style={styles.divider} />}
              </View>
            );
          })}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Cook Mate • v{version}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  cardRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  quickAction: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  linkText: {
    ...typography.body,
    color: colors.text,
  },
  thinDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    opacity: 0.6,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.5,
    marginVertical: spacing.md,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  faqQuestion: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  faqAnswer: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
    paddingTop: spacing.xs,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  footerText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});

