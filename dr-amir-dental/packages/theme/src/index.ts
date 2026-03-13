// ============================================
// Dr. Amir Dental Clinic — Theme Tokens
// All color hex values live HERE and ONLY here.
// ============================================

export const lightTheme = {
  colors: {
    primary: '#0D6EFD',
    background: '#FFFFFF',
    surface: '#E8F4FD',
    textPrimary: '#1A1A2E',
    textSecondary: '#555555',
    navBg: '#FFFFFF',
    border: '#D0D7E3',
    statusOpen: '#27AE60',
    statusClosed: '#C0392B',
    buttonHover: '#0B5ED7',
    footerBg: '#1A1A2E',
    cardShadow: 'rgba(13, 110, 253, 0.08)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    starGold: '#F5A623',
    whatsappGreen: '#25D366',
  },
  fonts: {
    family: "'Inter', sans-serif",
    weights: {
      regular: 400,
      semibold: 600,
      bold: 700,
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
    card: '0 2px 12px rgba(13, 110, 253, 0.08)',
    cardHover: '0 8px 24px rgba(13, 110, 253, 0.15)',
  },
  animation: {
    floatingTeethOpacity: 0.2,
  },
} as const;

export const darkTheme = {
  colors: {
    primary: '#4D9FFF',
    background: '#0F1117',
    surface: '#1A1F2E',
    textPrimary: '#E8EAF0',
    textSecondary: '#9AA0B4',
    navBg: '#141824',
    border: '#2A2F42',
    statusOpen: '#2ECC71',
    statusClosed: '#E74C3C',
    buttonHover: '#6AB0FF',
    footerBg: '#0A0D14',
    cardShadow: 'rgba(77, 159, 255, 0.08)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    starGold: '#F5A623',
    whatsappGreen: '#25D366',
  },
  fonts: lightTheme.fonts,
  spacing: lightTheme.spacing,
  borderRadius: lightTheme.borderRadius,
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.2)',
    md: '0 4px 6px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.3)',
    card: '0 2px 12px rgba(77, 159, 255, 0.08)',
    cardHover: '0 8px 24px rgba(77, 159, 255, 0.15)',
  },
  animation: {
    floatingTeethOpacity: 0.12,
  },
} as const;

export type Theme = typeof lightTheme;
export type ThemeColors = typeof lightTheme.colors;

export const cssVariableMap: Record<keyof ThemeColors, string> = {
  primary: '--color-primary',
  background: '--color-bg',
  surface: '--color-surface',
  textPrimary: '--color-text-primary',
  textSecondary: '--color-text-secondary',
  navBg: '--color-nav-bg',
  border: '--color-border',
  statusOpen: '--color-status-open',
  statusClosed: '--color-status-closed',
  buttonHover: '--color-button-hover',
  footerBg: '--color-footer-bg',
  cardShadow: '--color-card-shadow',
  overlay: '--color-overlay',
  starGold: '--color-star-gold',
  whatsappGreen: '--color-whatsapp-green',
};
