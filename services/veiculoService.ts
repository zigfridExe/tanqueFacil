import getDb, { DatabaseResult } from '../database/database';
import { Veiculo, VeiculoForm } from '../types/veiculo';

export const veiculoService = {
  // Criar novo veículo
  async criar(veiculoForm: VeiculoForm): Promise<DatabaseResult> {
    return new Promise(async (resolve) => {
      const veiculo = {
        nome: veiculoForm.nome,
        capacidadeTanque: parseFloat(veiculoForm.capacidadeTanque),
        consumoManualGasolina: (veiculoForm.consumoManualGasolina && parseFloat(veiculoForm.consumoManualGasolina)) || null,
        consumoManualEtanol: (veiculoForm.consumoManualEtanol && parseFloat(veiculoForm.consumoManualEtanol)) || null,
        tipoPonteiro: veiculoForm.tipoPonteiro,
        salvarLocalizacao: veiculoForm.salvarLocalizacao ? 1 : 0,
        lembreteCalibragem: veiculoForm.lembreteCalibragem ? 1 : 0,
        frequenciaLembrete: parseInt(veiculoForm.frequenciaLembrete),
        exibirNoDashboard: veiculoForm.exibirNoDashboard ? 1 : 0,
        // dataUltimaCalibragem will be handled separately or initialized by DB
      };

      try {
        const db = await getDb();
        const result = await db.runAsync(
          `INSERT INTO Carro (
            nome, capacidadeTanque, consumoManualGasolina, consumoManualEtanol,
            tipoPonteiro, salvarLocalizacao, lembreteCalibragem, frequenciaLembrete,
            exibirNoDashboard
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          veiculo.nome,
          veiculo.capacidadeTanque,
          veiculo.consumoManualGasolina,
          veiculo.consumoManualEtanol,
          veiculo.tipoPonteiro,
          veiculo.salvarLocalizacao,
          veiculo.lembreteCalibragem,
          veiculo.frequenciaLembrete,
          veiculo.exibirNoDashboard
        );
        
        // Busca o veículo recém-criado para retornar todos os dados
        const veiculoCriado = await db.getFirstAsync<any>('SELECT * FROM Carro WHERE id = ?', result.lastInsertRowId);
        if (veiculoCriado) {
          veiculoCriado.salvarLocalizacao = veiculoCriado.salvarLocalizacao === 1;
          veiculoCriado.lembreteCalibragem = veiculoCriado.lembreteCalibragem === 1;
          veiculoCriado.exibirNoDashboard = veiculoCriado.exibirNoDashboard === 1;
        }
        
        resolve({ 
          success: true, 
          message: 'Veículo criado com sucesso', 
          data: veiculoCriado 
        });
      } catch (error: any) {
        resolve({ success: false, message: 'Erro ao criar veículo: ' + error?.message });
      }
    });
  },

  // Buscar todos os veículos
  async buscarTodos(): Promise<DatabaseResult> {
    return new Promise(async (resolve) => {
      try {
        const db = await getDb();
        const rows = await db.getAllAsync<any>('SELECT * FROM Carro ORDER BY nome');
        const veiculos: Veiculo[] = rows.map((row: any) => ({
          id: row.id,
          nome: row.nome,
          capacidadeTanque: row.capacidadeTanque,
          consumoManualGasolina: row.consumoManualGasolina,
          consumoManualEtanol: row.consumoManualEtanol,
          tipoPonteiro: row.tipoPonteiro,
          salvarLocalizacao: row.salvarLocalizacao === 1,
          lembreteCalibragem: row.lembreteCalibragem === 1,
          frequenciaLembrete: row.frequenciaLembrete,
          dataUltimaCalibragem: row.dataUltimaCalibragem,
          exibirNoDashboard: row.exibirNoDashboard === 1,
        }));
        resolve({ success: true, message: 'Veículos buscados com sucesso', data: veiculos });
      } catch (error: any) {
        resolve({ success: false, message: 'Erro ao buscar veículos: ' + error?.message });
      }
    });
  },

  // Buscar veículo por ID
  async buscarPorId(id: number): Promise<DatabaseResult> {
    return new Promise(async (resolve) => {
      try {
        const db = await getDb();
        const row = await db.getFirstAsync<any>('SELECT * FROM Carro WHERE id = ?', id);
        if (row) {
          const veiculo: Veiculo = {
            id: row.id,
            nome: row.nome,
            capacidadeTanque: row.capacidadeTanque,
            consumoManualGasolina: row.consumoManualGasolina,
            consumoManualEtanol: row.consumoManualEtanol,
            tipoPonteiro: row.tipoPonteiro,
            salvarLocalizacao: row.salvarLocalizacao === 1,
            lembreteCalibragem: row.lembreteCalibragem === 1,
            frequenciaLembrete: row.frequenciaLembrete,
            dataUltimaCalibragem: row.dataUltimaCalibragem,
            exibirNoDashboard: row.exibirNoDashboard === 1,
          };
          resolve({ success: true, message: 'Veículo encontrado', data: veiculo });
        } else {
          resolve({ success: false, message: 'Veículo não encontrado' });
        }
      } catch (error: any) {
        resolve({ success: false, message: 'Erro ao buscar veículo: ' + error?.message });
      }
    });
  },

  // Atualizar veículo
  async atualizar(id: number, veiculoForm: VeiculoForm): Promise<DatabaseResult> {
    return new Promise(async (resolve) => {
      const veiculo = {
        nome: veiculoForm.nome,
        capacidadeTanque: parseFloat(veiculoForm.capacidadeTanque),
        consumoManualGasolina: (veiculoForm.consumoManualGasolina && parseFloat(veiculoForm.consumoManualGasolina)) || null,
        consumoManualEtanol: (veiculoForm.consumoManualEtanol && parseFloat(veiculoForm.consumoManualEtanol)) || null,
        tipoPonteiro: veiculoForm.tipoPonteiro,
        salvarLocalizacao: veiculoForm.salvarLocalizacao ? 1 : 0,
        lembreteCalibragem: veiculoForm.lembreteCalibragem ? 1 : 0,
        frequenciaLembrete: parseInt(veiculoForm.frequenciaLembrete),
        dataUltimaCalibragem: veiculoForm.dataUltimaCalibragem || null,
        exibirNoDashboard: veiculoForm.exibirNoDashboard ? 1 : 0,
      };

      try {
        const db = await getDb();
        const result = await db.runAsync(
          `UPDATE Carro SET 
            nome = ?, capacidadeTanque = ?, consumoManualGasolina = ?, 
            consumoManualEtanol = ?, tipoPonteiro = ?, salvarLocalizacao = ?, 
            lembreteCalibragem = ?, frequenciaLembrete = ?, dataUltimaCalibragem = ?,
            exibirNoDashboard = ?
          WHERE id = ?`,
          veiculo.nome,
          veiculo.capacidadeTanque,
          veiculo.consumoManualGasolina,
          veiculo.consumoManualEtanol,
          veiculo.tipoPonteiro,
          veiculo.salvarLocalizacao,
          veiculo.lembreteCalibragem,
          veiculo.frequenciaLembrete,
          veiculo.dataUltimaCalibragem,
          veiculo.exibirNoDashboard,
          id
        );
        if (result.changes > 0) {
          // Busca o veículo atualizado para retornar todos os dados
          const veiculoAtualizado = await db.getFirstAsync<any>('SELECT * FROM Carro WHERE id = ?', id);
          if (veiculoAtualizado) {
            veiculoAtualizado.salvarLocalizacao = veiculoAtualizado.salvarLocalizacao === 1;
            veiculoAtualizado.lembreteCalibragem = veiculoAtualizado.lembreteCalibragem === 1;
            veiculoAtualizado.exibirNoDashboard = veiculoAtualizado.exibirNoDashboard === 1;
          }
          resolve({ 
            success: true, 
            message: 'Veículo atualizado com sucesso',
            data: veiculoAtualizado
          });
        } else {
          resolve({ success: false, message: 'Veículo não encontrado para atualização' });
        }
      } catch (error: any) {
        resolve({ success: false, message: 'Erro ao atualizar veículo: ' + error?.message });
      }
    });
  },

  // Add new function to update only dataUltimaCalibragem
  async atualizarDataUltimaCalibragem(carroId: number, data: string): Promise<DatabaseResult> {
    return new Promise(async (resolve) => {
      try {
        const db = await getDb();
        const result = await db.runAsync(
          `UPDATE Carro SET dataUltimaCalibragem = ? WHERE id = ?`,
          data,
          carroId
        );
        if (result.changes > 0) {
          resolve({ success: true, message: 'Data da última calibragem atualizada com sucesso' });
        } else {
          resolve({ success: false, message: 'Veículo não encontrado para atualizar a data da última calibragem' });
        }
      } catch (error: any) {
        resolve({ success: false, message: 'Erro ao atualizar data da última calibragem: ' + error?.message });
      }
    });
  },

  // Excluir veículo
  async excluir(id: number): Promise<DatabaseResult> {
    return new Promise(async (resolve) => {
      try {
        const db = await getDb();
        const countRow = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM Abastecimentos WHERE carroId = ?', id);
        if (countRow && countRow.count > 0) {
          resolve({ success: false, message: 'Não é possível excluir o veículo pois existem abastecimentos registrados' });
          return;
        }
        const del = await db.runAsync('DELETE FROM Carro WHERE id = ?', id);
        if (del.changes > 0) {
          resolve({ success: true, message: 'Veículo excluído com sucesso' });
        } else {
          resolve({ success: false, message: 'Veículo não encontrado para exclusão' });
        }
      } catch (error: any) {
        resolve({ success: false, message: 'Erro ao excluir veículo: ' + error?.message });
      }
    });
  },
};