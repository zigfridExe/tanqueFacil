import { View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  useSafeArea?: boolean;
};

export function ThemedView({ style, lightColor, darkColor, useSafeArea = false, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  if (useSafeArea) {
    return <SafeAreaView style={[{ backgroundColor }, style]} {...otherProps} />;
  }

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
