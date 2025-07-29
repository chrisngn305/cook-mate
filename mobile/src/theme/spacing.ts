export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 50,
} as const;

export const elevation = {
  none: 0,
  low: 2,
  medium: 4,
  high: 8,
} as const;

export const layout = {
  containerPadding: spacing.lg,
  sectionSpacing: spacing.xxl,
  cardSpacing: spacing.md,
} as const; 