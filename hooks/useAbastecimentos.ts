import { useCallback, useState } from 'react';
import { AbastecimentoForm, abastecimentoService } from '../services/abastecimentoService';
import { Abastecimento } from '../types/veiculo';

export const useAbastecimentos = () => {
  const [abastecimentos, setAbastecimentos] = useState<Abastecimento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // Buscar último abastecimento por veículo
  const buscarUltimoAbastecimento = useCallback(async (carroId: number) => {
    setLoading(true);
    setError(null);
    try {
        const ultimo = await abastecimentoService.buscarUltimoAbastecimentoPorVeiculo(carroId);
        return ultimo;
    } catch (err) {
      setError('Erro ao buscar último abastecimento');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar novo abastecimento
  const criarAbastecimento = useCallback(async (abastecimento: AbastecimentoForm): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const sucesso = await abastecimentoService.criarAbastecimento(abastecimento);
      if (sucesso) {
        // Recarregar lista de abastecimentos
        await carregarAbastecimentosPorVeiculo(abastecimento.carroId);
        return true;
      } else {
        setError('Erro ao criar abastecimento');
        return false;
      }
      } catch {
      setError('Erro inesperado ao criar abastecimento');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar abastecimentos por veículo
  const carregarAbastecimentosPorVeiculo = useCallback(async (carroId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const dados = await abastecimentoService.buscarAbastecimentosPorVeiculo(carroId);
      setAbastecimentos(dados);
      } catch {
      setError('Erro ao carregar abastecimentos');
      setAbastecimentos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar todos os abastecimentos
  const carregarTodosAbastecimentos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const dados = await abastecimentoService.buscarTodosAbastecimentos();
      setAbastecimentos(dados);
      } catch {
      setError('Erro ao carregar abastecimentos');
      setAbastecimentos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualizar abastecimento
  const atualizarAbastecimento = useCallback(async (id: number, abastecimento: AbastecimentoForm): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const sucesso = await abastecimentoService.atualizarAbastecimento(id, abastecimento);
      if (sucesso) {
        // Recarregar lista de abastecimentos
        await carregarAbastecimentosPorVeiculo(abastecimento.carroId);
        return true;
      } else {
        setError('Erro ao atualizar abastecimento');
        return false;
      }
      } catch {
      setError('Erro inesperado ao atualizar abastecimento');
      return false;
    } finally {
      setLoading(false);
    }
  }, [carregarAbastecimentosPorVeiculo]);

  // Excluir abastecimento
  const excluirAbastecimento = useCallback(async (id: number, carroId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const sucesso = await abastecimentoService.excluirAbastecimento(id);
      if (sucesso) {
        // Recarregar lista de abastecimentos
        await carregarAbastecimentosPorVeiculo(carroId);
        return true;
      } else {
        setError('Erro ao excluir abastecimento');
        return false;
      }
      } catch {
      setError('Erro inesperado ao excluir abastecimento');
      return false;
    } finally {
      setLoading(false);
    }
  }, [carregarAbastecimentosPorVeiculo]);

  // Calcular consumo médio
  const calcularConsumoMedio = useCallback(async (carroId: number) => {
    try {
      return await abastecimentoService.calcularConsumoMedio(carroId);
      } catch {
      setError('Erro ao calcular consumo médio');
      return { gasolina: 0, etanol: 0 };
    }
  }, []);

  // Limpar erro
  const limparErro = useCallback(() => {
    setError(null);
  }, []);

  // Refresh dos dados
  const refresh = useCallback(async (carroId?: number) => {
    if (carroId) {
      await carregarAbastecimentosPorVeiculo(carroId);
    } else {
      await carregarTodosAbastecimentos();
    }
    }, [carregarAbastecimentosPorVeiculo, carregarTodosAbastecimentos]);

  return {
    abastecimentos,
    loading,
    error,
    criarAbastecimento,
    carregarAbastecimentosPorVeiculo,
    carregarTodosAbastecimentos,
    atualizarAbastecimento,
    excluirAbastecimento,
    calcularConsumoMedio,
    limparErro,
    refresh,
    buscarUltimoAbastecimento
  };
};
