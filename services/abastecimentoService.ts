// Usar wrapper do DB para facilitar mock em testes e evitar efeitos de módulo
import getDb from '../database/database';
import { Abastecimento } from '../types/veiculo';

export interface AbastecimentoForm {
  data: string;
  quilometragem: number;
  litros: number;
  valorPago: number;
  precoPorLitro: number;
  tipoCombustivel: 'Gasolina' | 'Etanol';
  tipoTrajeto: 'Cidade' | 'Estrada' | 'Misto';
  calibragemPneus: boolean;
  carroId: number;
  latitude?: number;
  longitude?: number;
}

export const abastecimentoService = {
  // Criar novo abastecimento
  async criarAbastecimento(abastecimento: AbastecimentoForm): Promise<boolean> {
    try {
      const db = await getDb();
      const result = await db.runAsync(
        `INSERT INTO Abastecimentos ( 
          data, quilometragem, litros, valorPago, precoPorLitro, 
          tipoCombustivel, tipoTrajeto, calibragemPneus, 
          latitude, longitude, carroId
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          abastecimento.data,
          abastecimento.quilometragem,
          abastecimento.litros,
          abastecimento.valorPago,
          abastecimento.precoPorLitro,
          abastecimento.tipoCombustivel,
          abastecimento.tipoTrajeto,
          abastecimento.calibragemPneus ? 1 : 0,
          abastecimento.latitude || null,
          abastecimento.longitude || null,
          abastecimento.carroId
        ]
      );
      console.log('Abastecimento criado com sucesso, ID:', result.lastInsertRowId);
      return result.changes > 0;
    } catch (error) {
      console.error('Erro ao criar abastecimento:', error);
      return false;
    }
  },

  // Buscar abastecimentos por veículo
  async buscarAbastecimentosPorVeiculo(carroId: number): Promise<Abastecimento[]> {
    try {
      const db = await getDb();
      const rows = await db.getAllAsync<Abastecimento>(
        'SELECT * FROM Abastecimentos WHERE carroId = ? ORDER BY data DESC, quilometragem DESC;',
        [carroId]
      );
      return rows;
    } catch (error) {
      console.error('Erro ao buscar abastecimentos:', error);
      return [];
    }
  },

  // Buscar último abastecimento por veículo
  async buscarUltimoAbastecimentoPorVeiculo(carroId: number): Promise<Abastecimento | null> {
    try {
      const db = await getDb();
      const row = await db.getFirstAsync<Abastecimento>(
        'SELECT * FROM Abastecimentos WHERE carroId = ? ORDER BY data DESC, quilometragem DESC LIMIT 1;',
        [carroId]
      );
      return row || null;
    } catch (error) {
      console.error('Erro ao buscar último abastecimento:', error);
      return null;
    }
  },

  // Buscar todos os abastecimentos
  async buscarTodosAbastecimentos(): Promise<Abastecimento[]> {
    try {
      const db = await getDb();
      const rows = await db.getAllAsync<Abastecimento>('SELECT * FROM Abastecimentos ORDER BY data DESC, quilometragem DESC;');
      return rows;
    } catch (error) {
      console.error('Erro ao buscar todos os abastecimentos:', error);
      return [];
    }
  },

  // Atualizar abastecimento
  async atualizarAbastecimento(id: number, abastecimento: AbastecimentoForm): Promise<boolean> {
    try {
      const db = await getDb();
      const result = await db.runAsync(
        `UPDATE Abastecimentos SET 
          data = ?, quilometragem = ?, litros = ?, valorPago = ?, 
          precoPorLitro = ?, tipoCombustivel = ?, tipoTrajeto = ?, 
          calibragemPneus = ?, latitude = ?, longitude = ?
          WHERE id = ?;`,
        [
          abastecimento.data,
          abastecimento.quilometragem,
          abastecimento.litros,
          abastecimento.valorPago,
          abastecimento.precoPorLitro,
          abastecimento.tipoCombustivel,
          abastecimento.tipoTrajeto,
          abastecimento.calibragemPneus ? 1 : 0,
          abastecimento.latitude || null,
          abastecimento.longitude || null,
          id
        ]
      );
      console.log('Abastecimento atualizado com sucesso:', result.changes);
      return result.changes > 0;
    } catch (error) {
      console.error('Erro ao atualizar abastecimento:', error);
      return false;
    }
  },

  // Excluir abastecimento
  async excluirAbastecimento(id: number): Promise<boolean> {
    try {
      const db = await getDb();
      const result = await db.runAsync('DELETE FROM Abastecimentos WHERE id = ?;', [id]);
      console.log('Abastecimento excluído com sucesso:', result.changes);
      return result.changes > 0;
    } catch (error) {
      console.error('Erro ao excluir abastecimento:', error);
      return false;
    }
  },

  // Calcular consumo médio por veículo
  async calcularConsumoMedio(carroId: number): Promise<{ gasolina: number; etanol: number }> {
    try {
      const abastecimentos = await this.buscarAbastecimentosPorVeiculo(carroId);
      
      if (abastecimentos.length < 2) {
        return { gasolina: 0, etanol: 0 };
      }

      // Ordenar por quilometragem para calcular distância percorrida
      const ordenados = abastecimentos.sort((a, b) => a.quilometragem - b.quilometragem);
      
      let totalLitrosGasolina = 0;
      let totalLitrosEtanol = 0;
      let distanciaGasolina = 0;
      let distanciaEtanol = 0;

      for (let i = 1; i < ordenados.length; i++) {
        const anterior = ordenados[i - 1];
        const atual = ordenados[i];
        const distancia = atual.quilometragem - anterior.quilometragem;
        
        if (distancia > 0) {
          if (anterior.tipoCombustivel === 'Gasolina') {
            distanciaGasolina += distancia;
            totalLitrosGasolina += anterior.litros;
          } else if (anterior.tipoCombustivel === 'Etanol') {
            distanciaEtanol += distancia;
            totalLitrosEtanol += anterior.litros;
          }
        }
      }

      const consumoGasolina = totalLitrosGasolina > 0 ? distanciaGasolina / totalLitrosGasolina : 0;
      const consumoEtanol = totalLitrosEtanol > 0 ? distanciaEtanol / totalLitrosEtanol : 0;

      return {
        gasolina: Math.round(consumoGasolina * 100) / 100,
        etanol: Math.round(consumoEtanol * 100) / 100
      };
    } catch (error) {
      console.error('Erro ao calcular consumo médio:', error);
      return { gasolina: 0, etanol: 0 };
    }
  },

  async calcularEstatisticas(carroId?: number): Promise<any> {
    try {
      const db = await getDb();
      let query = 'SELECT SUM(valorPago) as totalGastos, SUM(litros) as totalLitros, MIN(quilometragem) as kmInicial, MAX(quilometragem) as kmFinal FROM Abastecimentos';
      const params = [];
      if (carroId) {
        query += ' WHERE carroId = ?';
        params.push(carroId);
      }

      const result = await db.getFirstAsync<any>(query, params);

      const kmTotal = result.kmFinal - result.kmInicial;
      const consumoMedio = result.totalLitros > 0 ? kmTotal / result.totalLitros : 0;

      return {
        totalGastos: result.totalGastos || 0,
        totalLitros: result.totalLitros || 0,
        kmTotal: kmTotal || 0,
        consumoMedio: consumoMedio || 0,
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
      return {
        totalGastos: 0,
        totalLitros: 0,
        kmTotal: 0,
        consumoMedio: 0,
      };
    }
  },
};