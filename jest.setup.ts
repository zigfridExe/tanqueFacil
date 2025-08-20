// Setup global para evitar que o runtime do Expo tente resolver imports nativos durante os testes
// Neutraliza o acesso ao __ExpoImportMetaRegistry utilizado internamente pelo Expo
;(globalThis as any).__ExpoImportMetaRegistry = new Proxy(
  {},
  {
    get: () => ({}),
    set: () => true,
    has: () => true,
  }
);

// Garantir que o mock de expo seja carregado mesmo se algum submódulo escapar do mapper
jest.mock('expo', () => ({}));
