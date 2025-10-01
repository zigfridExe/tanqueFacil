// Declarações de tipos globais para o TypeScript

// Módulos de componentes
/// <reference types="react-native" />

declare module 'react-native' {
  export * from 'react-native/types/index';
  
  // Adiciona uma declaração explícita para o Text
  export const Text: React.ComponentType<React.ComponentProps<typeof import('react-native').Text>>;
}

declare module '@/components/reports/ConsumptionTrendReport' {
  import { ReactNode } from 'react';
  const Component: () => ReactNode;
  export default Component;
}

declare module '@/components/reports/CostsReport' {
  import { ReactNode } from 'react';
  const Component: () => ReactNode;
  export default Component;
}

declare module '@/components/reports/PerformanceReport' {
  import { ReactNode } from 'react';
  const Component: () => ReactNode;
  export default Component;
}

declare module '@/components/ThemedText' {
  import { ReactNode } from 'react';
  import { TextProps } from 'react-native';
  
  interface ThemedTextProps extends TextProps {
    children: ReactNode;
    style?: any;
    lightColor?: string;
    darkColor?: string;
  }
  
  const ThemedText: React.FC<ThemedTextProps>;
  
  export { ThemedText };
  export default ThemedText;
}

declare module '@/components/ThemedView' {
  import { ReactNode } from 'react';
  import { ViewProps } from 'react-native';
  
  interface ThemedViewProps extends ViewProps {
    children: ReactNode;
    style?: any;
    lightColor?: string;
    darkColor?: string;
  }
  
  const ThemedView: React.FC<ThemedViewProps>;
  
  export { ThemedView };
  export default ThemedView;
}

declare module '@/constants/Colors' {
  export const Colors: {
    light: {
      text: string;
      background: string;
      tint: string;
      icon: string;
      tabIconDefault: string;
      tabIconSelected: string;
      card: string;
    };
    dark: {
      text: string;
      background: string;
      tint: string;
      icon: string;
      tabIconDefault: string;
      tabIconSelected: string;
      card: string;
    };
  };
  
  export default Colors;
}

// Extensões de tipos para módulos existentes
declare module 'expo-router' {
  export * from 'expo-router/build';
  export { Link } from 'expo-router/build/link/Link';
}

// Tipos para o React Native
declare module 'react-native' {
  import * as React from 'react';
  
  // Tipos básicos de estilo
  export interface FlexStyle {
    flex?: number;
    flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
    alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
    flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  }
  
  export interface ViewStyle extends FlexStyle {
    backgroundColor?: string;
    borderRadius?: number;
    borderWidth?: number;
    borderColor?: string;
    padding?: number;
    paddingHorizontal?: number;
    paddingVertical?: number;
    margin?: number;
    marginHorizontal?: number;
    marginVertical?: number;
    width?: number | string;
    height?: number | string;
  }
  
  export interface TextStyle extends ViewStyle {
    color?: string;
    fontSize?: number;
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    fontFamily?: string;
    textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  }
  
  // Tipos de propriedades dos componentes
  export interface ViewProps {
    children?: React.ReactNode;
    styles?: ViewStyle | ViewStyle[];
    // Outras props comuns do View
    [key: string]: any;
  }
  
  export interface ScrollViewProps extends ViewProps {
    contentContainerStyle?: ViewStyle | ViewStyle[];
    showsVerticalScrollIndicator?: boolean;
    // Outras props específicas do ScrollView
  }
  
  export interface TouchableOpacityProps extends ViewProps {
    onPress?: () => void;
    activeOpacity?: number;
    // Outras props específicas do TouchableOpacity
  }
  
  // Componentes
  export const View: React.FC<ViewProps>;
  export const ScrollView: React.FC<ScrollViewProps>;
  export const TouchableOpacity: React.FC<TouchableOpacityProps>;
  
  // Outros utilitários
  export const StyleSheet: {
    create: <T extends {}>(styles: T) => T;
  };
  
  export const Alert: {
    alert: (title: string, message?: string, buttons?: any[], options?: any) => void;
  };
  
  // Re-exportação de tipos do React Native
  export * from 'react-native';
}
