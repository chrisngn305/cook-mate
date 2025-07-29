import { Platform } from 'react-native';

export const typography = {
  h1: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  h2: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
} as const;

export type TypographyKey = keyof typeof typography; 