import { useState, useEffect, useCallback } from 'react';
import { Veiculo, VeiculoForm } from '../types/veiculo';
import { veiculoService } from '../services/veiculoService';
import { initDatabase } from '../database/database';

export const useVeiculos = () => {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inicializar banco de dados e carregar veículos
  const inicializar = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Inicializar banco de dados
      const dbResult = await initDatabase();
      if (!dbResult.success) {
        throw new Error(dbResult.message);
      }

      // Carregar veículos existentes
      await carregarVeiculos();
    } catch (err) {
      console.error('Erro na inicialização:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      // Mesmo com erro, tentar carregar veículos (pode ser que o banco já exista)
      try {
        await carregarVeiculos();
      } catch (loadErr) {
        console.error('Erro ao carregar veículos:', loadErr);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar todos os veículos
  const carregarVeiculos = useCallback(async () => {
    try {
      const result = await veiculoService.buscarTodos();
      if (result.success && result.data) {
        setVeiculos(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar veículos');
    }
  }, []);

  // Criar novo veículo
  const criarVeiculo = useCallback(async (veiculoForm: VeiculoForm): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await veiculoService.criar(veiculoForm);
      if (result.success) {
        await carregarVeiculos(); // Recarregar lista
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar veículo');
      return false;
    } finally {
      setLoading(false);
    }
  }, [carregarVeiculos]);

  // Atualizar veículo
  const atualizarVeiculo = useCallback(async (id: number, veiculoForm: VeiculoForm): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await veiculoService.atualizar(id, veiculoForm);
      if (result.success) {
        await carregarVeiculos(); // Recarregar lista
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar veículo');
      return false;
    } finally {
      setLoading(false);
    }
  }, [carregarVeiculos]);

  // Excluir veículo
  const excluirVeiculo = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await veiculoService.excluir(id);
      if (result.success) {
        await carregarVeiculos(); // Recarregar lista
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
  }, [carregarVeiculos]);

  // Buscar veículo por ID
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

  // Limpar erro
  const limparErro = useCallback(() => {
    setError(null);
  }, []);

  // Inicializar quando o hook for montado
  useEffect(() => {
    inicializar();
  }, [inicializar]);

  return {
    veiculos,
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