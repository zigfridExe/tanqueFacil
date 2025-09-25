import { StyleSheet } from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | Record<string, any> };

/**
 * Cria estilos tipados com melhor inferência de tipos
 */
export function createStyles<T extends NamedStyles<T>>(styles: T): T {
  return StyleSheet.create(styles);
}

/**
 * Combina múltiplos estilos, útil para estilos condicionais
 */
export function combineStyles<T extends (ViewStyle | TextStyle | Record<string, any>)[]>(
  ...styles: T
): T[number] {
  return Object.assign({}, ...styles);
}
