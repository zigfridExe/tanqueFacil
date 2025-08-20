# Testes com Zustand e SQLite: Implantação, Lições Aprendidas e Boas Práticas

## Objetivo
- Validar a store (Zustand) e a camada de serviços (que consomem SQLite) sem depender do runtime nativo do Expo em testes.
- Padronizar aliases e configuração para evitar erros de resolução e diferenças entre bundler/Jest/TypeScript.

## Estrutura e Arquivos Relevantes
- Store
  - `src/store/useVehicleStore.ts`
  - Barrel: `src/store/index.ts`
  - Teste: `__tests__/store/useVehicleStore.test.ts`
- Serviços e Banco
  - Serviço: `services/veiculoService.ts`
  - DB (API assíncrona): `database/database.ts`
  - Teste: `__tests__/database/veiculoService.test.ts`
  - Utilitário (não-teste): `database/test.ts` (IGNORADO no Jest)
- Configuração
  - Jest: `jest.config.js`
  - Setup Jest: `jest.setup.ts`
  - Babel: `babel.config.js`
  - TypeScript: `tsconfig.json`
  - Mocks: `__mocks__/expo.ts`

## Estratégia de Testes
- Store (Zustand)
  - Testes unitários com `@testing-library/react-hooks` (`renderHook` + `act`).
  - Não depende de UI/Expo.
  - Reset de estado no `beforeEach` para evitar flakiness.
- Serviços (SQLite)
  - NÃO chamar `expo-sqlite` nos testes.
  - Mockar o módulo `database/database.ts` (retornar formas esperadas pelo service, ex.: `runAsync`, `getAllAsync`, `getFirstAsync`).
  - Mantemos a API do DB assíncrona para simplificar mocks e isolar nativos.

## Configuração do Jest
Arquivo: `jest.config.js`
- preset: `react-native`
- testEnvironment: `jsdom`
- transform: `babel-jest` para TS/JS/TSX/JSX
- transformIgnorePatterns: compatível com RN/Expo
- moduleNameMapper:
  - `'^@/(.*)$': '<rootDir>/$1'` (alias para RAIZ)
  - `'^@src/(.*)$': '<rootDir>/src/$1'` (alias para `src/`)
  - `'^expo(\\/.*)?$': '<rootDir>/__mocks__/expo.ts'` (neutraliza Expo)
- setupFiles:
  - `'<rootDir>/jest.setup.ts'`
  - `'./node_modules/react-native-gesture-handler/jestSetup.js'`
- setupFilesAfterEnv:
  - `'@testing-library/jest-native/extend-expect'`
- testPathIgnorePatterns:
  - `'<rootDir>/database/test.ts'` (evita rodar utilitário como teste por causa do nome)

## Setup do Jest (Expo neutralizado)
Arquivo: `jest.setup.ts`
- Define `globalThis.__ExpoImportMetaRegistry` como Proxy inerte (evita que o Expo tente resolver nativos).
- `jest.mock('expo', () => ({}))` para impedir carregamento do runtime Expo nos testes.

## Babel e JSX Transform moderno
Arquivo: `babel.config.js`
- Presets:
  - `'babel-preset-expo'`
  - `'@babel/preset-typescript'`
  - `['@babel/preset-react', { runtime: 'automatic' }]` (não requer `import React` em arquivos JSX/TSX)
- Plugins:
  - `module-resolver` com aliases:
    - `@ -> ./` (raiz)
    - `@src -> ./src`

## TypeScript (Paths/Aliases)
Arquivo: `tsconfig.json`
- `baseUrl: "."`
- `paths`:
  - `"@/*": ["./*"]`
  - `"@src/*": ["src/*"]`

## Uso de Aliases no Código
- Camada de domínio (store/services): `@src/...`
  - Ex.: `import { useVehicleStore } from '@src/store'`
- UI/Componentes que vivem na raiz: `@/...`
  - Ex.: `import { Collapsible } from '@/components/Collapsible'`

## Fluxo de Dados (Fonte da Verdade)
- DB é a fonte de verdade.
- Store (Zustand) é cache/estado de UI.
- Hooks sincronizam a store após operações do service (CRUD) usando os dados retornados pelo service.

## Erros Comuns e Correções Rápidas
- "Unable to resolve …/store/useVehicleStore": caminho incorreto
  - Usar `@src/store` (ou ajustar aliases/paths).
- "Cannot find module 'babel-plugin-module-resolver'"
  - Instalar: `npm i -D babel-plugin-module-resolver` (usar `--legacy-peer-deps` em caso de conflito no npm).
- "Outdated JSX transform" / "Property 'React' doesn't exist"
  - Garantir `['@babel/preset-react', { runtime: 'automatic' }]` e reiniciar Metro com `-c`.
- `requireNativeModule is not a function` (em Jest)
  - Evitar qualquer import real de `expo-sqlite` nos testes; mockar `database/database.ts`.
  - Ignorar `database/test.ts` no Jest (não é suíte de teste).

## Comandos Úteis
- Rodar todos os testes:
  - `npm test -- --watchAll=false --runInBand --verbose`
- Rodar teste da store:
  - `npx jest __tests__/store/useVehicleStore.test.ts --runInBand --verbose`
- Rodar teste do service:
  - `npx jest __tests__/database/veiculoService.test.ts --runInBand --verbose`
- Reiniciar bundler com cache limpo (após mudar Babel/aliases):
  - `npx expo start -c`

## Boas Práticas para Acelerar Solução
- **Aliases consistentes** entre TS, Babel/Metro e Jest (ajustar os três sempre juntos).
- **Separar domínios**: `@src` para código de domínio (store/services), `@` para raiz/UI.
- **Isolar nativos em testes**: mockar `expo` no setup do Jest e mockar o módulo `database/database.ts` nos testes de service.
- **API assíncrona no DB**: usar métodos `runAsync/getAllAsync/getFirstAsync` para simplificar mocks e padronizar.
- **Naming**: evitar arquivos com `test` no nome fora de `__tests__` ou mapear em `testPathIgnorePatterns`.
- **Reset de estado nos testes**: limpar Zustand no `beforeEach`.

## Checklist Rápido
- [ ] `jest.config.js` com mappers `@` e `@src`, mock de `expo`, ignorar `database/test.ts`.
- [ ] `jest.setup.ts` com `__ExpoImportMetaRegistry` + `jest.mock('expo')`.
- [ ] `babel.config.js` com `module-resolver` e JSX transform moderno.
- [ ] `tsconfig.json` com `baseUrl` e `paths` (`@` e `@src`).
- [ ] Imports usando `@src/...` na store/services e `@/...` para componentes.
- [ ] Testes da store e dos services passam sem tocar no runtime nativo.

## Exemplos de Código

### Exemplo: Teste da Store (Zustand)
Arquivo: `__tests__/store/useVehicleStore.test.ts`

```ts
import { act, renderHook } from '@testing-library/react-hooks';
import { useVehicleStore } from '@src/store';

describe('useVehicleStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useVehicleStore());
    act(() => {
      result.current.setVehicles([]);
      result.current.selectVehicle(null);
    });
  });

  it('deve adicionar e selecionar um veículo', () => {
    const { result } = renderHook(() => useVehicleStore());
    const v = { id: 1, nome: 'Fusca', capacidadeTanque: 40, consumoManualGasolina: 10, consumoManualEtanol: 7, tipoPonteiro: 'Analógico', salvarLocalizacao: false, lembreteCalibragem: false, frequenciaLembrete: 30 };
    act(() => {
      result.current.addVehicle(v);
      result.current.selectVehicle(v);
    });
    expect(result.current.vehicles).toEqual([v]);
    expect(result.current.selectedVehicle).toEqual(v);
  });
});
```

### Exemplo: Mock do DB em Teste de Service
Arquivo: `__tests__/database/veiculoService.test.ts`

```ts
// Mock da camada de DB para isolar expo-sqlite
jest.mock('../../database/database', () => ({
  __esModule: true,
  default: async () => ({
    runAsync: jest.fn(),
    getAllAsync: jest.fn().mockResolvedValue([
      { id: 1, nome: 'Fusca', capacidadeTanque: 40, consumoManualGasolina: 10, consumoManualEtanol: 7, tipoPonteiro: 'Analógico', salvarLocalizacao: 0, lembreteCalibragem: 0, frequenciaLembrete: 30 },
    ]),
    getFirstAsync: jest.fn().mockResolvedValue({ id: 1 }),
  }),
}));

import { veiculoService } from '../../services/veiculoService';

describe('veiculoService', () => {
  it('deve buscar todos os veículos', async () => {
    const result = await veiculoService.buscarTodos();
    expect(result.success).toBe(true);
    expect(result.data?.length).toBeGreaterThan(0);
  });
});
```

### Exemplo: jest.setup.ts (neutralizando Expo)
Arquivo: `jest.setup.ts`

```ts
;(globalThis as any).__ExpoImportMetaRegistry = new Proxy({}, {
  get: () => ({}),
  set: () => true,
  has: () => true,
});

jest.mock('expo', () => ({}));
```

### Exemplo: jest.config.js (aliases, mocks e ignores)
Arquivo: `jest.config.js`

```js
module.exports = {
  preset: 'react-native',
  testEnvironment: 'jsdom',
  transform: { '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest' },
  testPathIgnorePatterns: [
    '/node_modules/', '/android/', '/ios/', '<rootDir>/database/test.ts'
  ],
  setupFiles: [ '<rootDir>/jest.setup.ts', './node_modules/react-native-gesture-handler/jestSetup.js' ],
  setupFilesAfterEnv: [ '@testing-library/jest-native/extend-expect' ],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|expo(nent)?|@expo(nent)?/.*|@react-navigation/.*|react-native-reanimated|react-native-gesture-handler)'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^expo(\\/.*)?$': '<rootDir>/__mocks__/expo.ts',
  },
  collectCoverage: true,
};
```

### Exemplo: babel.config.js (JSX moderno e aliases)
Arquivo: `babel.config.js`

```js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      '@babel/preset-typescript',
      ['@babel/preset-react', { runtime: 'automatic' }],
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: { '@': './', '@src': './src' },
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
      ],
    ],
  };
};
```

### Exemplo: tsconfig.json (paths/aliases)
Arquivo: `tsconfig.json`

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@src/*": ["src/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

### Template: novo teste de service com mock do DB
Sugestão de arquivo: `__tests__/templates/service.test.template.ts`

```ts
// Substitua "meuService" e métodos conforme necessário
jest.mock('../../database/database', () => ({
  __esModule: true,
  default: async () => ({
    runAsync: jest.fn(),
    getAllAsync: jest.fn().mockResolvedValue([]),
    getFirstAsync: jest.fn().mockResolvedValue(null),
  }),
}));

import { meuService } from '../../services/meuService';

describe('meuService', () => {
  it('exemplo de teste', async () => {
    const result = await meuService.fazerAlgo();
    expect(result.success).toBe(true);
  });
});
```
