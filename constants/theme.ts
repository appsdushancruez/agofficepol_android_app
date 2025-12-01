/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Modern Android Material Design 3 inspired colors
const whatsappGreen = '#25D366'; // Primary green
const whatsappGreenDark = '#128C7E'; // Dark green
const whatsappGreenLight = '#DCF8C6'; // Light green
const whatsappGreenAccent = '#34C759'; // Accent green
const tintColorLight = whatsappGreen;
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#1A1A1A',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    whatsappGreen,
    whatsappGreenDark,
    whatsappGreenLight,
    whatsappGreenAccent,
    welcomeBackground: '#F5FDF7', // Modern light green background
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    outline: '#E0E0E0',
    outlineVariant: '#C8E6C9',
  },
  dark: {
    text: '#ECEDEE',
    background: '#121212',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    whatsappGreen,
    whatsappGreenDark,
    whatsappGreenLight,
    whatsappGreenAccent,
    welcomeBackground: '#1B3A2E',
    surface: '#1E1E1E',
    surfaceVariant: '#2C2C2C',
    outline: '#404040',
    outlineVariant: '#2D4A3E',
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
