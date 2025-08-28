import * as SQLite from 'expo-sqlite';

export type DatabaseResult = {
  success: boolean;
  message: string;
  data?: any;
};

let cachedDb: SQLite.SQLiteDatabase | null = null;

async function ensureDb(): Promise<SQLite.SQLiteDatabase> {
  if (cachedDb) return cachedDb;
  const db = await SQLite.openDatabaseAsync('meu-tanque-facil.db');
  // Otimizações e criação de schema
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Carro (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      capacidadeTanque REAL NOT NULL,
      consumoManualGasolina REAL,
      consumoManualEtanol REAL,
      tipoPonteiro TEXT,
      salvarLocalizacao INTEGER,
      lembreteCalibragem INTEGER,
      frequenciaLembrete INTEGER,
      dataUltimaCalibragem TEXT,
      exibirNoDashboard INTEGER DEFAULT 1
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Abastecimentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data TEXT NOT NULL,
      quilometragem REAL NOT NULL,
      litros REAL NOT NULL,
      valorPago REAL NOT NULL,
      precoPorLitro REAL NOT NULL,
      tipoCombustivel TEXT NOT NULL,
      tipoTrajeto TEXT NOT NULL,
      calibragemPneus INTEGER NOT NULL,
      latitude REAL,
      longitude REAL,
      carroId INTEGER NOT NULL,
      FOREIGN KEY (carroId) REFERENCES Carro(id) ON DELETE CASCADE
    );
  `);

  await runMigrations(db);

  cachedDb = db;
  return db;
}

type Migration = {
  tableName: string;
  columnName: string;
  columnDefinition: string;
  backfillQuery?: string;
};

const MIGRATIONS: Migration[] = [
  {
    tableName: 'Abastecimentos',
    columnName: 'valorPago',
    columnDefinition: 'REAL',
    backfillQuery: 'UPDATE Abastecimentos SET valorPago = valorTotal WHERE valorPago IS NULL;',
  },
  {
    tableName: 'Carro',
    columnName: 'exibirNoDashboard',
    columnDefinition: 'INTEGER DEFAULT 1',
  },
];

async function runMigrations(db: SQLite.SQLiteDatabase) {
  for (const migration of MIGRATIONS) {
    try {
      const cols = await db.getAllAsync<{ name: string }>(`PRAGMA table_info('${migration.tableName}');`);
      const columnExists = cols.some((c) => c.name === migration.columnName);
      if (!columnExists) {
        await db.execAsync(`ALTER TABLE ${migration.tableName} ADD COLUMN ${migration.columnName} ${migration.columnDefinition};`);
        if (migration.backfillQuery) {
          await db.execAsync(migration.backfillQuery);
        }
        console.log(`Migração bem-sucedida: Coluna ${migration.columnName} adicionada à tabela ${migration.tableName}.`);
      }
    } catch (e) {
      console.warn(`Aviso: falha ao migrar coluna ${migration.columnName} na tabela ${migration.tableName}:`, (e as any)?.message || e);
    }
  }
}

export async function initDatabase(): Promise<DatabaseResult> {
  try {
    await ensureDb();
    return { success: true, message: 'Banco inicializado' };
  } catch (e: any) {
    return { success: false, message: e?.message || 'Falha ao inicializar banco' };
  }
}

export async function resetDatabase(): Promise<DatabaseResult> {
  try {
    const db = await ensureDb();
    await db.execAsync('DROP TABLE IF EXISTS Carro;');
    await db.execAsync('DROP TABLE IF EXISTS Abastecimentos;');
    cachedDb = null; // Clear cached DB to force re-initialization
    await initDatabase();
    return { success: true, message: 'Banco de dados redefinido com sucesso.' };
  } catch (e: any) {
    return { success: false, message: e?.message || 'Falha ao redefinir banco de dados.' };
  }
}

export default async function getDb(): Promise<SQLite.SQLiteDatabase> {
  return ensureDb();
}