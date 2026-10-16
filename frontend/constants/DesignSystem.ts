/**
 * CivicVigilance Design System
 * 
 * A modern, elegant design system for a premium civic app experience.
 * Styles derived from "Reddit-style" utility but with "Glassmorphism" and "Civic Blue" branding.
 */

import { Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const colors = {
    // Brand Colors
    primaryTeal: '#27A590',   // The main action color (Camera button, "View Post" button)
    trustBlue: '#1254A1',     // Used for the "Civic Impact Score" card and top headers
    twitterBlue: '#1DA1F2',   // Specific to X/Twitter amplification status

    // Status & Feedback Colors
    statusResolved: '#D4F0DF', // Light green background for "Resolved" or "Fixed" tags
    textResolved: '#1A7D40',   // Dark green text for "Resolved"
    statusPending: '#FDF1D6',  // Light amber background for "Pending"
    textPending: '#A3680A',    // Dark amber text for "Pending"
    statusReview: '#D6E4FF',   // Light blue background for "In Review"
    textReview: '#104494',     // Dark blue text for "In Review"

    // Backgrounds & Surfaces
    backgroundMain: '#F8F9FA', // The slight off-white app background
    surfaceWhite: '#FFFFFF',   // Pure white for report cards, modal popups, and bottom tabs
    divider: '#E5E7EB',        // Light grey for separating comments and settings list items
};

export const textColors = {
    // Heading & High Emphasis
    display: '#111827',       // Almost black. Use for: "Deep Pothole on 5th...", "Alex Citizen", Modal titles

    // Body & Medium Emphasis
    bodyPrimary: '#374151',   // Dark slate. Use for: Discussion thread comments, report descriptions, settings titles

    // Subtext & Low Emphasis
    bodySecondary: '#6B7280', // Medium grey. Use for: "2h ago", "Sector 4", "@alex_vigilant", settings subtext

    // Interactive & Special
    actionText: '#27A590',    // Teal text. Use for: The "Share" button, "View All" links
    whiteText: '#FFFFFF',     // Use for: Text inside the solid Teal buttons or the Blue Impact card
};

export const Colors = {
    // Brand Identity (Mapped to new colors for compatibility)
    primary: colors.primaryTeal,
    primaryDark: '#1E8271',
    primaryLight: '#E6F4F1',
    primarySemibold: colors.primaryTeal,

    // Gradient Stops (for LinearGradient usage)
    gradientPrimaryStart: colors.trustBlue,
    gradientPrimaryEnd: '#0B3B75',

    // Neutral Base
    background: colors.backgroundMain,
    surface: colors.surfaceWhite,
    surfaceHighlight: '#F3F4F6',

    // Text Hierarchy
    textMain: textColors.display,
    textSecondary: textColors.bodyPrimary,
    textMuted: textColors.bodySecondary,
    textInverse: textColors.whiteText,

    // Semantic Status Colors (Tailored)
    success: colors.statusResolved,
    error: '#EF4444',
    errorLight: '#FEF2F2',
    errorBorder: '#FCA5A5',
    warning: colors.statusPending,
    info: colors.statusReview,

    // Transparency & Overlays
    overlay: 'rgba(17, 24, 39, 0.4)',
    glass: 'rgba(255, 255, 255, 0.85)',
    glassBorder: 'rgba(255, 255, 255, 0.5)',
    glassDark: 'rgba(17, 24, 39, 0.85)',

    border: colors.divider,
    borderDark: '#D1D5DB',
};

const unifiedShadow = {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
};

export const Shadows = {
    // Soft, diffused drop shadows unified so all cards appear to float at the exact same depth
    card: unifiedShadow,
    sm: unifiedShadow,
    md: unifiedShadow,
    lg: unifiedShadow,
    hover: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 10,
    }
};

export const Typography = {
    // Consistent hierarchy
    h1: { fontSize: 32, fontWeight: '800' as const, color: textColors.display, letterSpacing: -0.8, lineHeight: 40 },
    h2: { fontSize: 24, fontWeight: '700' as const, color: textColors.display, letterSpacing: -0.5, lineHeight: 32 },
    h3: { fontSize: 20, fontWeight: '600' as const, color: textColors.display, letterSpacing: -0.3, lineHeight: 28 },
    h4: { fontSize: 18, fontWeight: '600' as const, color: textColors.display, lineHeight: 24 },

    body: { fontSize: 16, lineHeight: 24, color: textColors.bodyPrimary },
    bodySm: { fontSize: 14, lineHeight: 20, color: textColors.bodySecondary },
    caption: { fontSize: 12, lineHeight: 16, color: textColors.bodySecondary },

    // Interactive
    button: { fontSize: 16, fontWeight: '600' as const, letterSpacing: 0.3 },
    link: { fontSize: 14, fontWeight: '500' as const, color: colors.primaryTeal },
};

export const Spacing = {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    screenPadding: 20,
};

export const BorderRadius = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    pill: 9999,
};

export const Layout = {
    card: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.xl, // More rounded for modern feel
        padding: Spacing.md,
        ...Shadows.sm,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    glassCard: {
        backgroundColor: Colors.glass,
        borderRadius: BorderRadius.xl,
        borderWidth: 1,
        borderColor: Colors.glassBorder,
        overflow: 'hidden' as const,
    },
    modal: {
        backgroundColor: Colors.surface,
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        padding: Spacing.lg,
        ...Shadows.lg,
    },
    fullWidth: width - (Spacing.screenPadding * 2),
};
