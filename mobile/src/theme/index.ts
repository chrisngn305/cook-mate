import { colors } from './colors';
import { typography } from './typography';
import { spacing, borderRadius, elevation, layout } from './spacing';

export { colors } from './colors';
export { typography } from './typography';
export { spacing, borderRadius, elevation, layout } from './spacing';

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  elevation,
  layout,
} as const; 