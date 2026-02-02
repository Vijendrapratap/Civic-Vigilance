/**
 * CivicVigilance Design System
 * 
 * A modern, elegant design system for a premium civic app experience.
 * Styles derived from "Reddit-style" utility but with "Glassmorphism" and "Civic Blue" branding.
 */

import { Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const Colors = {
    // Brand Identity (Vibrant Sky & Deep Slate)
    primary: '#0EA5E9', // Sky-500: Vibrant, trustworthy blue
    primaryDark: '#0284C7', // Sky-600: Deeper interaction state
    primaryLight: '#E0F2FE', // Sky-100: Soft backgrounds
    primarySemibold: '#38BDF8', // Sky-400: Bright accents

    // Gradient Stops (for LinearGradient usage)
    gradientPrimaryStart: '#0EA5E9',
    gradientPrimaryEnd: '#2563EB', // Blue-600

    // Neutral Base (Slate - Cool & clean)
    background: '#F8FAFC', // Slate-50: Crisp paper-like background
    surface: '#FFFFFF',
    surfaceHighlight: '#F1F5F9', // Slate-100: Hover/Active states

    // Text Hierarchy
    textMain: '#0F172A', // Slate-900: Almost black, very sharp
    textSecondary: '#475569', // Slate-600: Refined gray
    textMuted: '#94A3B8', // Slate-400: Low contrast data
    textInverse: '#FFFFFF',

    // Semantic Status Colors (Tailored)
    success: '#10B981', // Emerald-500: Modern green
    error: '#EF4444', // Red-500: Clear alert
    warning: '#F59E0B', // Amber-500
    info: '#3B82F6', // Blue-500

    // Transparency & Overlays
    overlay: 'rgba(15, 23, 42, 0.4)', // Slate-900 fade
    glass: 'rgba(255, 255, 255, 0.85)', // High opacity glass
    glassBorder: 'rgba(255, 255, 255, 0.5)',
    glassDark: 'rgba(15, 23, 42, 0.85)', // Slate glass

    border: '#E2E8F0', // Slate-200: Subtle separation
    borderDark: '#CBD5E1', // Slate-300: Inputs/Cards
};

export const Shadows = {
    // Soft, diffuse shadows for "Floaty" feel
    sm: {
        shadowColor: '#64748B', // Slate-500 equivalent
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    md: {
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: '#0EA5E9', // Subtle blue tint on large shadows
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    hover: {
        shadowColor: '#0EA5E9',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    }
};

export const Typography = {
    // Consistent hierarchy
    h1: { fontSize: 32, fontWeight: '800' as const, color: Colors.textMain, letterSpacing: -0.8, lineHeight: 40 },
    h2: { fontSize: 24, fontWeight: '700' as const, color: Colors.textMain, letterSpacing: -0.5, lineHeight: 32 },
    h3: { fontSize: 20, fontWeight: '600' as const, color: Colors.textMain, letterSpacing: -0.3, lineHeight: 28 },
    h4: { fontSize: 18, fontWeight: '600' as const, color: Colors.textMain, lineHeight: 24 },

    body: { fontSize: 16, lineHeight: 24, color: Colors.textSecondary },
    bodySm: { fontSize: 14, lineHeight: 20, color: Colors.textSecondary },
    caption: { fontSize: 12, lineHeight: 16, color: Colors.textMuted },

    // Interactive
    button: { fontSize: 16, fontWeight: '600' as const, letterSpacing: 0.3 },
    link: { fontSize: 14, fontWeight: '500' as const, color: Colors.primary },
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
