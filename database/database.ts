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
      dataUltimaCalibragem TEXT
    );
  `);
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Abastecimentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      carroId INTEGER NOT NULL,
      data TEXT NOT NULL,
      quilometragem REAL NOT NULL,
      litros REAL NOT NULL,
      precoPorLitro REAL NOT NULL,
      valorTotal REAL NOT NULL,
      tipoCombustivel TEXT NOT NULL,
      tipoTrajeto TEXT,
      calibragemPneus INTEGER,
      latitude REAL,
      longitude REAL,
      FOREIGN KEY (carroId) REFERENCES Carro(id)
    );
  `);
  // Migração: garantir coluna valorPago, usada pela aplicação, existe.
  try {
    const cols = await db.getAllAsync<{ name: string }>("PRAGMA table_info('Abastecimentos');");
    const hasValorPago = cols.some((c) => c.name === 'valorPago');
    if (!hasValorPago) {
      await db.execAsync("ALTER TABLE Abastecimentos ADD COLUMN valorPago REAL;");
      // Backfill: se existir valorTotal, copia para valorPago
      await db.execAsync("UPDATE Abastecimentos SET valorPago = valorTotal WHERE valorPago IS NULL;");
    }
  } catch (e) {
    console.warn('Aviso: falha ao migrar coluna valorPago:', (e as any)?.message || e);
  }
  cachedDb = db;
  return db;
}

export async function initDatabase(): Promise<DatabaseResult> {
  try {
    await ensureDb();
    return { success: true, message: 'Banco inicializado' };
  } catch (e: any) {
    return { success: false, message: e?.message || 'Falha ao inicializar banco' };
  }
}

export default async function getDb(): Promise<SQLite.SQLiteDatabase> {
  return ensureDb();
}
