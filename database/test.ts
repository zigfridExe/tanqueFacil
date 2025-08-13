import * as SQLite from 'expo-sqlite';

// Teste simples para verificar se o SQLite está funcionando
export const testSQLite = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('test.db');
    await db.execAsync('PRAGMA journal_mode = WAL');
    const row = await db.getFirstAsync<{ version: string }>('SELECT sqlite_version() as version');
    console.log('SQLite OK! Versão:', row.version);
    return true;
  } catch (error) {
    console.error('Erro no SQLite:', error);
    return false;
  }
};