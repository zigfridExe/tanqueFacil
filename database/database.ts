
import * as SQLite from 'expo-sqlite';

export type DatabaseResult = {
  success: boolean;
  message: string;
  data?: any;
};


let cachedDb: any = null;

async function ensureDb(): Promise<SQLite.SQLiteDatabase> {
  if (cachedDb) return cachedDb;
  const db = await SQLite.openDatabaseAsync('meu-tanque-facil.db');
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Carro (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      quilometragem REAL NOT NULL,
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
  {
    tableName: 'Carro',
    columnName: 'quilometragem',
    columnDefinition: 'REAL DEFAULT 0',
  },
];

async function runMigrations(db: SQLite.SQLiteDatabase) {
  for (const migration of MIGRATIONS) {
    try {
      const cols = await db.getAllAsync(`PRAGMA table_info('${migration.tableName}');`);
      const columnExists = cols.some((c: any) => c.name === migration.columnName);
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

export async function getDatabaseStatus(): Promise<{ connected: boolean; message: string }> {
  console.log('Verificando status do banco de dados...');
  if (!cachedDb) {
    console.log('Status: Desconectado (cache nulo).');
    return { connected: false, message: 'Desconectado (cache nulo).' };
  }
  try {
    // A API expo-sqlite não tem um método "isOpen", então fazemos uma consulta simples.
    const result = await cachedDb.getFirstAsync('PRAGMA user_version;');
    if (result && typeof result.user_version === 'number') {
      console.log('Status: Conectado. Versão do DB:', result.user_version);
      return { connected: true, message: `Conectado (versão: ${result.user_version})` };
    } else {
      throw new Error('Resposta inesperada da verificação de status.');
    }
  } catch (e: any) {
    console.error('Status: Erro na conexão.', e);
    cachedDb = null; // Limpa o cache se a conexão falhou
    return { connected: false, message: `Erro na conexão: ${e.message}` };
  }
}

export async function forceReconnect(): Promise<DatabaseResult> {
  console.log('Forçando reconexão com o banco de dados...');
  try {
    if (cachedDb) {
      console.log('Fechando conexão existente...');
      await cachedDb.closeAsync();
      cachedDb = null;
      console.log('Conexão fechada.');
    }
    
    console.log('Re-inicializando conexão...');
    await ensureDb();
    console.log('Reconexão bem-sucedida.');
    return { success: true, message: 'Reconexão forçada com sucesso.' };
  } catch (e: any) {
    console.error('Falha ao forçar reconexão:', e);
    return { success: false, message: `Falha ao forçar reconexão: ${e.message}` };
  }
}