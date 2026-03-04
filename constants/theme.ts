import { Platform } from 'react-native';

const tintColorLight = '#09090B'; // Pitch Black
const tintColorDark = '#D9F845'; // Neon Volt Green

export const Colors = {
  light: {
    text: '#09090B',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#71717A',
    tabIconDefault: '#A1A1AA',
    tabIconSelected: tintColorLight,
    card: '#F4F4F5',
    border: '#E4E4E7',
  },
  dark: {
    text: '#FAFAFA',
    background: '#09090B', // Pitch Black
    tint: tintColorDark,
    icon: '#A1A1AA',
    tabIconDefault: '#52525B',
    tabIconSelected: tintColorDark,
    card: '#18181B', // Matte Zinc
    border: '#27272A',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
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
