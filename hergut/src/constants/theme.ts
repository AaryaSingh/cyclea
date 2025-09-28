export const theme = {
  colors: {
    // Primary pastel colors
    primary: '#FFB6C1', // Light Pink
    primaryDark: '#FF91A4', // Medium Pink
    secondary: '#B19CD9', // Light Purple
    secondaryDark: '#9B7ED1', // Medium Purple
    
    // Accent colors
    accent: '#FFD1DC', // Very Light Pink
    accent2: '#E6E6FA', // Lavender
    accent3: '#F0E68C', // Khaki
    
    // Neutral colors
    white: '#FFFFFF',
    black: '#2C2C2C',
    gray: '#F5F5F5',
    grayDark: '#E0E0E0',
    grayText: '#666666',
    
    // Status colors
    success: '#98FB98', // Pale Green
    warning: '#FFE4B5', // Moccasin
    error: '#FFB6C1', // Light Pink (soft error)
    info: '#B0E0E6', // Powder Blue
    
    // Background colors
    background: '#FEFEFE',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    
    // Text colors
    text: '#2C2C2C',
    textSecondary: '#666666',
    textLight: '#999999',
  },
  
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    light: 'System',
  },
  
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 50,
  },
  
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

export type Theme = typeof theme;
