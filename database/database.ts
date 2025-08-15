import * as SQLite from 'expo-sqlite';


let db: SQLite.SQLiteDatabase | null = null;

export const getDb = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('tanqueFacil.db');
  }
  return db;
};

export interface DatabaseResult {
  success: boolean;
  message: string;
  data?: any;
}

export const initDatabase = async (): Promise<DatabaseResult> => {
	try {
		const db = await getDb();
		await db.execAsync(`
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS Carro (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  capacidadeTanque REAL NOT NULL,
  consumoManualGasolina REAL NOT NULL,
  consumoManualEtanol REAL NOT NULL,
  tipoPonteiro TEXT NOT NULL,
  salvarLocalizacao INTEGER NOT NULL DEFAULT 0,
  lembreteCalibragem INTEGER NOT NULL DEFAULT 0,
  frequenciaLembrete INTEGER NOT NULL DEFAULT 30
);
CREATE TABLE IF NOT EXISTS Abastecimentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data TEXT NOT NULL,
  quilometragem INTEGER NOT NULL,
  litros REAL NOT NULL,
  valorPago REAL NOT NULL,
  precoPorLitro REAL NOT NULL,
  tipoCombustivel TEXT NOT NULL,
  tipoTrajeto TEXT NOT NULL,
  calibragemPneus INTEGER NOT NULL DEFAULT 0,
  latitude REAL,
  longitude REAL,
  carroId INTEGER NOT NULL,
  FOREIGN KEY (carroId) REFERENCES Carro (id)
);
`);
		return { success: true, message: 'Banco de dados inicializado com sucesso' };
	} catch (error: any) {
		console.error('Erro ao criar tabelas:', error);
		return { success: false, message: 'Erro ao inicializar banco de dados: ' + error?.message };
	}
};

export default getDb;

export const resetDatabase = async (): Promise<DatabaseResult> => {
  try {
    const db = await getDb();
    await db.execAsync(`
      DROP TABLE IF EXISTS Abastecimentos;
      DROP TABLE IF EXISTS Carro;
    `);
    await initDatabase(); // Recria as tabelas
    return { success: true, message: 'Banco de dados redefinido com sucesso' };
  } catch (error: any) {
    console.error('Erro ao redefinir o banco de dados:', error);
    return { success: false, message: 'Erro ao redefinir o banco de dados: ' + error?.message };
  }
};

// Função de teste para verificar a criação da tabela
export const testDatabaseCreation = async () => {
  try {
    console.log("Iniciando teste de criação do banco de dados...");
    const result = await initDatabase();
    console.log("Resultado da inicialização:", result);
    if (result.success) {
      const db = await getDb();
      const statement = await db.prepareAsync("SELECT name FROM sqlite_master WHERE type='table' AND name='Carro'");
      const tableResult = await statement.executeAsync();
      const table = await tableResult.getFirstAsync();
      
      if (table) {
        console.log("Tabela 'Carro' encontrada com sucesso.");
      } else {
        console.error("Erro: Tabela 'Carro' não foi criada.");
      }
      await statement.finalizeAsync();
    }
  } catch (error) {
    console.error("Erro no teste de criação do banco de dados:", error);
  }
};