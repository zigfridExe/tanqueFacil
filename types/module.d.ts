// Tipos para os aliases de módulo
declare module '@/hooks/useThemeColor' {
  import { ColorSchemeName } from 'react-native';
  
  export function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: string
  ): string;
}

declare module '@/hooks/useColorScheme' {
  export function useColorScheme(): ColorSchemeName;
}

declare module '@/constants/Colors' {
  export const Colors: {
    light: {
      background: string;
      text: string;
      tint: string;
      // Adicione outras cores conforme necessário
    };
    dark: {
      background: string;
      text: string;
      tint: string;
      // Adicione outras cores conforme necessário
    };
  };
}
