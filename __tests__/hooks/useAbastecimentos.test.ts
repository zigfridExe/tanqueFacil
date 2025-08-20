import { act, renderHook } from '@testing-library/react-hooks';

jest.mock('../../services/abastecimentoService', () => ({
  abastecimentoService: {
    criarAbastecimento: jest.fn().mockResolvedValue(true),
    buscarAbastecimentosPorVeiculo: jest.fn().mockResolvedValue([{ id: 1, carroId: 1 }]),
    buscarTodosAbastecimentos: jest.fn().mockResolvedValue([{ id: 2, carroId: 2 }]),
    atualizarAbastecimento: jest.fn().mockResolvedValue(true),
    excluirAbastecimento: jest.fn().mockResolvedValue(true),
    calcularConsumoMedio: jest.fn().mockResolvedValue({ gasolina: 10, etanol: 7 }),
  },
}));

import { useAbastecimentos } from '../../hooks/useAbastecimentos';
import { abastecimentoService } from '../../services/abastecimentoService';

describe('useAbastecimentos', () => {
  it('cria abastecimento e recarrega lista por veículo', async () => {
    const { result } = renderHook(() => useAbastecimentos());
    await act(async () => {
      const ok = await result.current.criarAbastecimento({
        data: '2025-01-01', quilometragem: 1000, litros: 30, valorPago: 180, precoPorLitro: 6,
        tipoCombustivel: 'Gasolina', tipoTrajeto: 'Cidade', calibragemPneus: true, carroId: 1,
      } as any);
      expect(ok).toBe(true);
    });
    expect(abastecimentoService.buscarAbastecimentosPorVeiculo).toHaveBeenCalledWith(1);
    expect(result.current.abastecimentos.length).toBeGreaterThan(0);
  });

  it('refresh sem carroId usa buscarTodos', async () => {
    const { result } = renderHook(() => useAbastecimentos());
    await act(async () => { await result.current.refresh(); });
    expect(abastecimentoService.buscarTodosAbastecimentos).toHaveBeenCalled();
  });

  it('calcularConsumoMedio delega para service', async () => {
    const { result } = renderHook(() => useAbastecimentos());
    let consumo: any;
    await act(async () => { consumo = await result.current.calcularConsumoMedio(1); });
    expect(consumo).toEqual({ gasolina: 10, etanol: 7 });
  });
});
