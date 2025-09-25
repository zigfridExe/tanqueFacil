import 'react-native';

// Estende os tipos do React Native para serem mais flexíveis
declare module 'react-native' {
  interface ViewStyle {
    flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse' | string;
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | string;
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline' | string;
    alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline' | string;
    flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse' | string;
    position?: 'absolute' | 'relative' | string;
    // Adicione outras propriedades conforme necessário
  }

  interface TextStyle extends ViewStyle {
    textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify' | string;
    textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center' | string;
    // Adicione outras propriedades de texto conforme necessário
  }

  interface ImageStyle extends ViewStyle {
    // Adicione propriedades específicas de imagem se necessário
  }
}
