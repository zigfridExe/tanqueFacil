import { useVehicleStore } from '@src/store';
import { useCallback, useEffect, useState } from 'react';
import { veiculoService } from '../services/veiculoService';
import { Veiculo, VeiculoForm } from '../types/veiculo';

export const useVeiculos = () => {
  const { vehicles, setVehicles, addVehicle, updateVehicle, removeVehicle } = useVehicleStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarVeiculos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await veiculoService.buscarTodos();
      if (result.success && result.data) {
        setVehicles(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar veículos');
    } finally {
      setLoading(false);
    }
  }, [setVehicles]);

  useEffect(() => {
    carregarVeiculos();
  }, [carregarVeiculos]);

  const criarVeiculo = useCallback(async (veiculoForm: VeiculoForm): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const result = await veiculoService.criar(veiculoForm);
      if (result.success && result.data) {
        const veiculo: Veiculo = {
          id: result.data.id,
          nome: result.data.nome,
          capacidadeTanque: result.data.capacidadeTanque,
          consumoManualGasolina: result.data.consumoManualGasolina,
          consumoManualEtanol: result.data.consumoManualEtanol,
          tipoPonteiro: result.data.tipoPonteiro,
          salvarLocalizacao: result.data.salvarLocalizacao === 1,
          lembreteCalibragem: result.data.lembreteCalibragem === 1,
          frequenciaLembrete: result.data.frequenciaLembrete,
          dataUltimaCalibragem: result.data.dataUltimaCalibragem,
          exibirNoDashboard: result.data.exibirNoDashboard === 1,
        };
        addVehicle(veiculo);
        return true;
      } else {
        setError(result.message || 'Erro ao criar veículo');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar veículo';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [addVehicle]);

  const atualizarVeiculo = useCallback(async (id: number, veiculoForm: VeiculoForm): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const result = await veiculoService.atualizar(id, veiculoForm);
      if (result.success && result.data) {
        const veiculo: Veiculo = {
          id: result.data.id,
          nome: result.data.nome,
          capacidadeTanque: result.data.capacidadeTanque,
          consumoManualGasolina: result.data.consumoManualGasolina,
          consumoManualEtanol: result.data.consumoManualEtanol,
          tipoPonteiro: result.data.tipoPonteiro,
          salvarLocalizacao: result.data.salvarLocalizacao === 1,
          lembreteCalibragem: result.data.lembreteCalibragem === 1,
          frequenciaLembrete: result.data.frequenciaLembrete,
          dataUltimaCalibragem: result.data.dataUltimaCalibragem,
          exibirNoDashboard: result.data.exibirNoDashboard === 1,
        };
        updateVehicle(veiculo);
        return true;
      } else {
        setError(result.message || 'Erro ao atualizar veículo');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar veículo';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [updateVehicle]);

  const excluirVeiculo = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const result = await veiculoService.excluir(id);
      if (result.success) {
        removeVehicle(id);
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir veículo');
      return false;
    } finally {
      setLoading(false);
    }
  }, [removeVehicle]);
  
  const buscarVeiculoPorId = useCallback(async (id: number): Promise<Veiculo | null> => {
    try {
      const result = await veiculoService.buscarPorId(id);
      if (result.success && result.data) {
        return result.data;
      } else {
        setError(result.message);
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar veículo');
      return null;
    }
  }, []);

  const limparErro = useCallback(() => {
    setError(null);
  }, []);

  return {
    veiculos: vehicles,
    loading,
    error,
    criarVeiculo,
    atualizarVeiculo,
    excluirVeiculo,
    buscarVeiculoPorId,
    carregarVeiculos,
    limparErro,
  };
};