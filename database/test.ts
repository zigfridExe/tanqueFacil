import getDb from './database';

// Função utilitária para validar o funcionamento básico do SQLite
export async function testSQLite(): Promise<boolean> {
  const db = await getDb();
  // Faz uma consulta simples
  const row = await db.getFirstAsync<{ ok: number }>('SELECT 1 as ok');
  return !!row && row.ok === 1;
}
