import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { initDatabase } from '../database/database';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [dbInitialized, setDbInitialized] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    async function setup() {
      try {
        const result = await initDatabase();
        if (result.success) {
          console.log('Banco de dados inicializado com sucesso!');
          setDbInitialized(true);
        } else {
          console.error('Falha ao inicializar o banco de dados:', result.message);
          // Você pode querer mostrar uma tela de erro aqui
        }
      } catch (error) {
        console.error('Erro crítico ao inicializar o banco de dados:', error);
      }
    }

    setup();
  }, []);

  if (!loaded || !dbInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

