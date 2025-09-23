import { useVehicleStore } from '@src/store';
import { useCallback, useEffect, useState } from 'react';
import { abastecimentoService } from '../services/abastecimentoService';
import { veiculoService } from '../services/veiculoService';
import { Veiculo, VeiculoForm } from '../types/veiculo';

export function useVeiculos() {
  const { vehicles, setVehicles, addVehicle, updateVehicle, removeVehicle, selectedVehicle, selectVehicle } = useVehicleStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarVeiculos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await veiculoService.buscarTodos();
      if (result.success && result.data) {
        const veiculosComConsumo = await Promise.all(
          result.data.map(async (veiculo: Veiculo) => {
            const consumo = await abastecimentoService.calcularConsumoMedio(veiculo.id!);
            return {
              ...veiculo,
              consumoMedioGasolina: consumo.gasolina,
              consumoMedioEtanol: consumo.etanol,
            };
          })
        );
        setVehicles(veiculosComConsumo);
        // Seleciona automaticamente o primeiro veículo se nenhum estiver selecionado
        if ((!selectedVehicle || !selectedVehicle.id) && result.data.length > 0) {
          selectVehicle(result.data[0]);
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar veículos');
    } finally {
      setLoading(false);
    }
  }, [setVehicles, selectVehicle, selectedVehicle]);

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
          quilometragem: result.data.quilometragem,
          consumoManualGasolina: result.data.consumoManualGasolina,
          consumoManualEtanol: result.data.consumoManualEtanol,
          tipoPonteiro: result.data.tipoPonteiro,
          salvarLocalizacao: result.data.salvarLocalizacao,
          lembreteCalibragem: result.data.lembreteCalibragem,
          frequenciaLembrete: result.data.frequenciaLembrete,
          dataUltimaCalibragem: result.data.dataUltimaCalibragem,
          exibirNoDashboard: result.data.exibirNoDashboard,
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
      // Buscar o veículo atual para manter os campos obrigatórios
      const veiculoAtual = vehicles.find(v => v.id === id);
      if (!veiculoAtual) {
        setError('Veículo não encontrado para atualizar');
        return false;
      }
      const veiculoParaAtualizar: Veiculo = {
        ...veiculoAtual,
        nome: veiculoForm.nome,
        capacidadeTanque: parseFloat(veiculoForm.capacidadeTanque),
      };
      const result = await veiculoService.atualizar(id, veiculoParaAtualizar);
      if (result.success && result.data) {
        const veiculo: Veiculo = {
          id: result.data.id,
          nome: result.data.nome,
          capacidadeTanque: result.data.capacidadeTanque,
          quilometragem: result.data.quilometragem,
          consumoManualGasolina: result.data.consumoManualGasolina,
          consumoManualEtanol: result.data.consumoManualEtanol,
          tipoPonteiro: result.data.tipoPonteiro,
          salvarLocalizacao: result.data.salvarLocalizacao,
          lembreteCalibragem: result.data.lembreteCalibragem,
          frequenciaLembrete: result.data.frequenciaLembrete,
          dataUltimaCalibragem: result.data.dataUltimaCalibragem,
          exibirNoDashboard: result.data.exibirNoDashboard,
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
  }, [updateVehicle, vehicles]);

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
    selectedVehicle,
    selectVehicle,
    loading,
    error,
    criarVeiculo,
    atualizarVeiculo,
    excluirVeiculo,
    buscarVeiculoPorId,
    carregarVeiculos,
    limparErro,
  };
}