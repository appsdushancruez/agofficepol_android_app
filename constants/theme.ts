/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Professional color palette
const primaryDarkTeal = '#11486b'; // Primary color for headers, primary buttons
const secondaryEarthyGreen = '#478356'; // Secondary color for accents
const errorDeepRed = '#ac2b49'; // Error states and warnings
const accentRustOrange = '#da6328'; // Secondary actions and highlights
const ctaBrightOrange = '#ffa425'; // Primary CTAs, highlights, and active states

// Light variants for backgrounds and gradients
const primaryLight = '#E8F0F5'; // Light variant of dark teal
const secondaryLight = '#E8F3EB'; // Light variant of earthy green
const accentLight = '#FFF4ED'; // Light variant of bright orange

// Dark mode variants
const primaryDarkMode = '#1a5a7a'; // Slightly lighter for dark mode
const secondaryDarkMode = '#5a9a6a'; // Slightly lighter for dark mode

const tintColorLight = primaryDarkTeal;
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#1A1A1A',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    // Primary colors
    primary: primaryDarkTeal,
    secondary: secondaryEarthyGreen,
    accent: accentRustOrange,
    cta: ctaBrightOrange,
    error: errorDeepRed,
    // Light variants for backgrounds
    primaryLight,
    secondaryLight,
    accentLight,
    // Legacy support (mapped to new colors)
    whatsappGreen: primaryDarkTeal,
    whatsappGreenDark: primaryDarkTeal,
    whatsappGreenLight: primaryLight,
    whatsappGreenAccent: secondaryEarthyGreen,
    welcomeBackground: '#F8FAFB', // Light neutral background
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    outline: '#E0E0E0',
    outlineVariant: secondaryLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#121212',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    // Primary colors
    primary: primaryDarkMode,
    secondary: secondaryDarkMode,
    accent: accentRustOrange,
    cta: ctaBrightOrange,
    error: errorDeepRed,
    // Light variants for backgrounds
    primaryLight: '#1a2a35',
    secondaryLight: '#1a2a1f',
    accentLight: '#2a1a15',
    // Legacy support (mapped to new colors)
    whatsappGreen: primaryDarkMode,
    whatsappGreenDark: primaryDarkMode,
    whatsappGreenLight: '#1a2a35',
    whatsappGreenAccent: secondaryDarkMode,
    welcomeBackground: '#0f1a1f',
    surface: '#1E1E1E',
    surfaceVariant: '#2C2C2C',
    outline: '#404040',
    outlineVariant: '#1a2a1f',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
