import { Platform } from 'react-native';

export const Colors = {
  light: {
    background: '#E8E8EC',
    displayBackground: '#E8E8EC',
    text: '#2D2D3A',
    textSecondary: '#6B6B7B',
    // Button colors
    clearButton: '#F5A623',
    operatorButton: '#E8DDD0',
    functionButton: '#E8DDD0',
    numberButton: '#F5F5F7',
    equalsButton: '#8B5CF6',
    minusButton: '#C9B896',
    plusButton: '#C9B896',
    // Button text
    buttonText: '#2D2D3A',
    operatorText: '#2D2D3A',
  },
  dark: {
    background: '#1C1C1E',
    displayBackground: '#2C2C2E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    // Button colors
    clearButton: '#F5A623',
    operatorButton: '#3A3A3C',
    functionButton: '#3A3A3C',
    numberButton: '#2C2C2E',
    equalsButton: '#8B5CF6',
    minusButton: '#5C5040',
    plusButton: '#5C5040',
    // Button text
    buttonText: '#FFFFFF',
    operatorText: '#FFFFFF',
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
