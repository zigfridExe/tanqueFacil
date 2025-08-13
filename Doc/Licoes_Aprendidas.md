# Lições Aprendidas — Integração do SQLite no Expo (SDK 53)

> Referência principal: [Expo SQLite (API atual)](https://docs.expo.dev/versions/latest/sdk/sqlite/)

## 1) API correta do SQLite no SDK 53
- Import: usar `import * as SQLite from 'expo-sqlite'` (sem `legacy`).
- Abertura: `SQLite.openDatabaseAsync('minhaBase.db')`.
- Execução:
  - DDL/PRAGMA/batch: `db.execAsync(...)`.
  - Escritas: `db.runAsync(...)` (ler `lastInsertRowId` e `changes`).
  - Leituras: `db.getFirstAsync(...)`, `db.getAllAsync(...)`.
- Evitar `expo-sqlite/legacy` para não quebrar o bundler. A API documentada exige a versão nova e métodos assíncronos.

## 2) Estrutura recomendada
- `database/database.ts`: wrapper assíncrono `getDb()` (reuso de conexão) + `initDatabase` com `PRAGMA journal_mode = WAL` e `CREATE TABLE IF NOT EXISTS ...`.
- Service Layer (`services/veiculoService.ts`): centraliza CRUD com `runAsync/getAllAsync/getFirstAsync`.
- Hooks (`hooks/useVeiculos.ts`): orquestra init, loading/erro, recarregamento.
- Mantém UI simples e desacoplada da persistência.

## 3) Erros & diagnósticos
- Erro “openDatabase is not a function/undefined” ou falhas de resolução: causado por import errado (legacy) ou cache. Corrigir import e rodar `npx expo start -c`.
- Warnings do Router sobre “default export” e “rota ausente”: podem ocorrer em cascata quando a resolução do módulo falha. Corrigindo o SQLite, os warnings somem.
- Criar uma rota de teste (`/test-sqlite`) acelera validação isolada do DB.

## 4) Boas práticas de SQLite
- Ativar WAL: melhora performance geral (`PRAGMA journal_mode = WAL`).
- Usar transações para operações multi-passos: `db.withTransactionAsync(...)`.
- Considerar prepared statements (`prepareAsync/executeAsync/finalizeAsync`) para execuções repetidas.
- Planejar migrations com `PRAGMA user_version` (ex.: incrementar versão e aplicar alterações condicionais).
- Adicionar índices nos campos consultados com maior frequência.

## 5) Gestão de versões
- Manter `expo` e `expo-sqlite` compatíveis (preferir `npx expo install expo-sqlite`).
- Evitar downgrades por tentativa/erro. Priorizar adaptação à API atual (SDK 53) conforme doc oficial.

## 6) UX de estado e erros
- Mostrar `ActivityIndicator` durante operações.
- Exibir mensagens claras de erro e botão de “Tentar novamente”.
- Encadear feedback visual ao salvar/atualizar/excluir.

## 7) Próximos aprimoramentos
- Adotar `SQLiteProvider` + `useSQLiteContext` para injeção de contexto (quando conveniente) — ver doc oficial.
- Isolar migrations em módulo próprio e automatizar em `initDatabase`.
- Cobrir flows com testes de integração simples (cadastro/listagem/edição/exclusão).

---

Checklist técnico (OK):
- Import atualizado, API async e sem `legacy`.
- `openDatabaseAsync`, `execAsync`, `runAsync`, `getFirstAsync`, `getAllAsync` implementados.
- Cache do Metro limpo quando necessário.

> Doc consultada: [Expo SQLite — API Async](https://docs.expo.dev/versions/latest/sdk/sqlite/)