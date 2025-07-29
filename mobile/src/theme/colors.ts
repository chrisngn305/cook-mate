export const colors = {
  // Primary Colors
  primary: '#4CAF50',
  accent: '#A5D6A7',
  
  // Background Colors
  background: '#F8F8F8',
  surface: '#FFFFFF',
  
  // Text Colors
  text: '#333333',
  textSecondary: '#777777',
  
  // Status Colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Border & Divider Colors
  border: '#E0E0E0',
  divider: '#DDDDDD',
  
  // Tab Colors
  tabActive: '#4CAF50',
  tabInactive: '#DDDDDD',
  
  // Input Colors
  inputBackground: '#FFFFFF',
  inputBorder: '#E0E0E0',
  inputPlaceholder: '#999999',
  
  // Shadow Colors
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
} as const;

export type ColorKey = keyof typeof colors; 