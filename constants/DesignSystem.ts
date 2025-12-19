/**
 * CivicVigilance Design System
 * 
 * A modern, elegant design system for a premium civic app experience.
 * Styles derived from "Reddit-style" utility but with "Glassmorphism" and "Civic Blue" branding.
 */

import { Platform } from 'react-native';

export const Colors = {
    // Brand Identity (Vibrant Sky & Deep Slate)
    primary: '#0EA5E9', // Sky-500: Vibrant, trustworthy blue
    primaryDark: '#0369A1', // Sky-700: Readable on light backgrounds
    primaryLight: '#E0F2FE', // Sky-100: Soft backgrounds
    primarySemibold: '#38BDF8', // Sky-400: Bright accents

    // Neutral Base (Slate - Cool & clean)
    background: '#F8FAFC', // Slate-50: Crisp paper-like background
    surface: '#FFFFFF',

    // Text Hierarchy
    textMain: '#0F172A', // Slate-900: Almost black, very sharp
    textSecondary: '#475569', // Slate-600: Refined gray
    textMuted: '#94A3B8', // Slate-400: Low contrast data

    // Semantic Status Colors (Tailored)
    success: '#10B981', // Emerald-500: Modern green
    error: '#EF4444', // Red-500: Clear alert
    warning: '#F59E0B', // Amber-500

    // Transparency & Overlays
    overlay: 'rgba(15, 23, 42, 0.6)', // Slate-900 fade
    glass: 'rgba(255, 255, 255, 0.90)', // High opacity glass
    glassDark: 'rgba(15, 23, 42, 0.90)', // Slate glass

    border: '#E2E8F0', // Slate-200: Subtle separation
};

export const Shadows = {
    // Soft, diffuse shadows for "Floaty" feel
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 4,
    },
    lg: {
        shadowColor: '#2563EB', // Subtle blue tint on large shadows
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 10,
    },
};

export const Typography = {
    // Consistent hierarchy
    h1: { fontSize: 28, fontWeight: '700' as const, color: Colors.textMain, letterSpacing: -0.5 },
    h2: { fontSize: 24, fontWeight: '700' as const, color: Colors.textMain, letterSpacing: -0.3 },
    h3: { fontSize: 20, fontWeight: '600' as const, color: Colors.textMain },
    body: { fontSize: 16, lineHeight: 24, color: Colors.textSecondary },
    bodySm: { fontSize: 14, lineHeight: 20, color: Colors.textSecondary },
    caption: { fontSize: 12, color: Colors.textMuted },

    // Interactive
    button: { fontSize: 16, fontWeight: '600' as const },
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const BorderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    pill: 9999,
};

export const Layout = {
    card: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        ...Shadows.sm,
        borderWidth: 1,
        borderColor: 'rgba(229, 231, 235, 0.5)', // Subtle border
    },
    glassCard: {
        backgroundColor: Colors.glass,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        overflow: 'hidden' as const,
    },
};
