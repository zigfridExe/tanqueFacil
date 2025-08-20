// Mock mínimo do pacote 'expo' para ambiente de testes (Jest)
export const Constants = { expoConfig: {}, manifest: {} } as any;
export const Linking = { makeUrl: (path?: string) => `http://localhost/${path || ''}` } as any;
export const SplashScreen = { preventAutoHideAsync: async () => {}, hideAsync: async () => {} } as any;
export const SystemUI = { setBackgroundColorAsync: async () => {} } as any;
export default {};
