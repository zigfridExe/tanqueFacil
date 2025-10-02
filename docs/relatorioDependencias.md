## Relatório de Dependências (tanqueFacil)

Este documento consolida as versões atuais das dependências do projeto, as relações de compatibilidade entre elas e as justificativas para pinagens ou faixas específicas. O objetivo é servir como referência para manutenção e futuras atualizações, mantendo o app funcional e alinhado ao ecossistema Expo/React Native em uso.

### 1) Visão geral e princípios
- **Fonte da verdade**: Validamos e alinhamos as versões com as ferramentas oficiais do Expo (`npx expo-doctor` e `npx expo install --check`). Ao final, `expo-doctor` retornou 17/17 checks OK.
- **Compatibilidade primeiro**: Sempre priorizamos as versões esperadas pelo SDK instalado (SDK 54) em detrimento do “mais novo”, quando houver incompatibilidade.
- **Faixas semânticas controladas**: Preferimos ranges que permitam correções de bug sem risco (ex.: `~x.y.z`) quando indicado pelo Expo, e usamos `^x.y.z` somente onde a matriz é mais permissiva.

### 2) Núcleo do runtime
- **expo@54.0.12**: Versão base do SDK. Todas as libs nativas devem seguir a matriz deste SDK. Atualizações de SDK devem ser feitas seguindo o guia oficial de upgrade do Expo.
- **react@19.1.0** e **react-native@0.81.4**: Versões atualmente instaladas e validadas pelo `expo-doctor`. Manter em sincronia com o SDK; ao migrar de SDK, revalidar com `expo-doctor`.
- **expo-router@~6.0.10**: Compatível com o SDK e React Navigation 7. Usado para o roteamento baseado em arquivos.

Peculiaridade: Apesar de o SDK 54 historicamente ser associado a determinadas versões do RN/React, a validação oficial local (`expo-doctor`) garantiu a compatibilidade do conjunto acima no estado atual do projeto. Qualquer mudança de maior impacto (ex.: upgrade de SDK) deve revalidar a matriz.

### 3) Navegação
- **@react-navigation/native@^7.1.8** e **@react-navigation/bottom-tabs@^7.4.0**
  - Justificativa: `npx expo install --check` indicou que as versões “esperadas” para o SDK 54 são estas faixas. Mantê-las assim evita conflitos com pacotes da família React Navigation.
- **@react-navigation/elements@^2.6.4**
  - Observação: Esta lib impõe peer de `@react-navigation/native`. Ajustamos `native` para uma faixa aceita pelo SDK e pela lib, conforme a checagem do Expo.

### 4) Gestos, animações e worklets
- **react-native-gesture-handler@~2.28.0** e **react-native-screens@~4.16.0**
  - Faixas compatíveis com RN/SDK atuais e com a stack de navegação.
- **react-native-reanimated@^4.1.2**
  - Observação: Reanimated é sensível à combinação RN/SDK. A faixa atual foi validada pelo `expo-doctor`. Caso haja build-time errors ou Babel plugin conflicts, revalidar com `expo install --check` e notas de versão da lib.
- **react-native-worklets@0.5.1**
  - Justificativa: O `expo-doctor` apontou como “esperado” para o SDK 54. Versões superiores (ex.: 0.6.x) foram consideradas fora da matriz e por isso retornamos para 0.5.1.

### 5) UI e contexto nativo
- **react-native-safe-area-context@~5.6.1**
  - Faixa recomendada para integração com React Navigation e compatibilidade com SDK.
- **@react-native-community/datetimepicker@8.4.4**
  - Justificativa: O `expo-doctor` requisitou especificamente 8.4.4 para SDK 54. A 8.4.5 foi considerada incompatível.
- **@react-native-community/slider@5.0.1**
  - Compatível com o runtime atual.

### 6) Módulos Expo
- **expo-constants@~18.0.9, expo-font@~14.0.8, expo-haptics@~15.0.7, expo-image@~3.0.8, expo-linking@~8.0.8, expo-splash-screen@~31.0.10, expo-status-bar@~3.0.8, expo-symbols@~1.0.7, expo-system-ui@~6.0.7, expo-web-browser@~15.0.8, expo-blur@~15.0.7, expo-sqlite@~16.0.8**
  - Todos estes seguem as faixas “tilde” esperadas pelo SDK 54. Alterações devem ser feitas via `expo install` para garantir versões válidas.
- **expo-location@^19.0.7**
  - Mantido. Caso surjam warnings, executar `npx expo install expo-location` para pinagem exata conforme matriz.

### 7) Suporte a Web
- **react-native-web@^0.21.1** e **react-dom@19.1.0**
  - Validados no projeto e no `expo-doctor`. Qualquer upgrade deve verificar compatibilidade com `expo/metro` e com o bundler Web via Metro.

### 8) Mapa e WebView
- **react-native-maps@1.20.1**
  - Funcional no estado atual. Módulo sensível a mudanças de RN/NDK/iOS pods; testar após upgrades.
- **react-native-webview@13.15.0**
  - Mantido estável.

### 9) Estado e utilidades
- **zustand@^5.0.8**
  - Sem acoplamento direto ao SDK; manter versão estável e revalidar tipos ao atualizar TypeScript.

### 10) Toolchain de testes
- **jest@~29.7.0** (apenas em `devDependencies`)
  - Justificativa: Pinado em 29.x para compatibilidade com `jest-expo@^54.0.12`. Versão 30.x gerava conflito e foi removida.
- **jest-expo@^54.0.12**
  - Versão alinhada ao SDK 54. Atualizar junto com o SDK.
- **@testing-library/react-native@^13.3.3**
  - Compatível com RN/React atuais. Em updates, verificar changelog de breaking changes.

### 11) TypeScript e tipos
- **typescript@^5.9.3**
  - Compatível com a base do Expo no estado atual. Ao migrar SDK, conferir versão mínima recomendada.
- **@types/react@~19.1.10**
  - Justificativa: `expo-doctor` sugeriu exatamente esta faixa. Estava em `^19.2.0` e foi ajustado para evitar incompatibilidades sutilmente relacionadas a React 19.
- **@types/jest@^30.0.0, @types/node@^24.6.2**
  - Mantidos. Se houver conflitos de sintaxe/types, alinhar às versões de `jest` e do Node em uso local/CI.

### 12) Babel e Metro
- **babel-preset-expo** + `@babel/preset-typescript` + `@babel/preset-react` (runtime automático)
  - Conjunto padrão e compatível. Evitar adicionar plugins do Reanimated manualmente quando usando SDK recente; seguir docs do Reanimated e Expo se necessário.
- **metro-config (alias + sourceExts)**
  - Configuração com aliases `@` e `@src` válida. Extensões adicionais (`mjs`, `cjs`) estão suportadas.

### 13) Decisões importantes já aplicadas
- Removido `jest` de `dependencies` e mantido apenas em `devDependencies` como `~29.7.0` (compatível com `jest-expo@54`).
- Ajustadas versões que o `expo-doctor` marcou como fora da matriz (ex.: `@react-native-community/datetimepicker@8.4.4`, `react-native-worklets@0.5.1`, `@types/react@~19.1.10`, `@react-navigation/*`).
- Revalidação feita: `npx expo-doctor` sem pendências.

### 14) Procedimento recomendado de atualização
1. Executar inspeção: `npx expo-doctor`.
2. Checar matriz: `npx expo install --check` e aceitar as correções se fizer sentido.
3. Instalar: `npm install` (evitar `--force`; usar apenas se necessário e entender o impacto).
4. Testar: `npm test` e smoke test do app (`npx expo start`).
5. Versionar as mudanças com um resumo das justificativas (use este documento como referência).

### 15) Quando considerar upgrade de SDK
- Necessidade de novas APIs ou correções do RN que o SDK 54 não oferece.
- Bibliotecas que exigem versões mais recentes do RN/React.
- Checklist ao migrar:
  - Ler o guia oficial “Expo SDK Upgrade” correspondente.
  - Rodar `npx expo install --check` após atualizar a versão do `expo`.
  - Reexecutar `npx expo-doctor` até obter 0 pendências.
  - Revalidar build Android/iOS e testes.

---
Última validação: `npx expo-doctor` — 17/17 checks OK. Qualquer alteração manual de versões deve ser revalidada imediatamente com os comandos acima.


