// Mock do wrapper de DB usado pelo service (../database/database)
const mockDb = {
  runAsync: jest.fn(),
  getAllAsync: jest.fn(),
};

jest.mock('../../database/database', () => ({
  __esModule: true,
  // Função estável que não é um jest.fn(), assim não é afetada por clearAllMocks
  default: async () => mockDb,
}));

type AbastecimentoForm = import('../../services/abastecimentoService').AbastecimentoForm;

function getService() {
  let svc: any;
  jest.resetModules();
  jest.isolateModules(() => {
    // Avalia o módulo sob mock ativo e sem cache
    svc = require('../../services/abastecimentoService').abastecimentoService;
  });
  return svc as typeof import('../../services/abastecimentoService').abastecimentoService;
}

describe('abastecimentoService', () => {
  beforeEach(async () => {
    // Resetar apenas os métodos do mockDb, mantendo a implementação de getDb
    mockDb.runAsync.mockReset();
    mockDb.getAllAsync.mockReset();
  });

  it('cria abastecimento e retorna true quando changes > 0', async () => {
    mockDb.runAsync.mockResolvedValueOnce({ changes: 1, lastInsertRowId: 10 });
    const dto: AbastecimentoForm = {
      data: '2025-01-01T00:00:00Z', quilometragem: 1000, litros: 30, valorPago: 180, precoPorLitro: 6,
      tipoCombustivel: 'Gasolina', tipoTrajeto: 'Cidade', calibragemPneus: true, carroId: 1,
    };
    const abastecimentoService = getService();
    const ok = await abastecimentoService.criarAbastecimento(dto);
    expect(ok).toBe(true);
    expect(mockDb.runAsync).toHaveBeenCalled();
  });

  it('busca abastecimentos por veículo', async () => {
    mockDb.getAllAsync.mockResolvedValueOnce([{ id: 1, carroId: 1 }]);
    const abastecimentoService = getService();
    const rows = await abastecimentoService.buscarAbastecimentosPorVeiculo(1);
    expect(rows).toEqual([{ id: 1, carroId: 1 }]);
  });

  it('atualiza abastecimento retorna true quando changes > 0', async () => {
    mockDb.runAsync.mockResolvedValueOnce({ changes: 1 });
    const abastecimentoService = getService();
    const ok = await abastecimentoService.atualizarAbastecimento(1, {
      data: '2025-01-02T00:00:00Z', quilometragem: 1100, litros: 20, valorPago: 120, precoPorLitro: 6,
      tipoCombustivel: 'Gasolina', tipoTrajeto: 'Estrada', calibragemPneus: false, carroId: 1,
    });
    expect(ok).toBe(true);
  });

  it('exclui abastecimento retorna true quando changes > 0', async () => {
    mockDb.runAsync.mockResolvedValueOnce({ changes: 1 });
    const abastecimentoService = getService();
    const ok = await abastecimentoService.excluirAbastecimento(5);
    expect(ok).toBe(true);
  });

  it('calcula consumo médio por combustível', async () => {
    const abastecimentoService = getService();
    // Mockar método interno de busca para controlar os dados
    const spy = jest
      .spyOn(abastecimentoService as any, 'buscarAbastecimentosPorVeiculo')
      .mockResolvedValueOnce([
        { quilometragem: 1000, litros: 10, tipoCombustivel: 'Gasolina' },
        { quilometragem: 1100, litros: 8, tipoCombustivel: 'Etanol' },
        { quilometragem: 1200, litros: 10, tipoCombustivel: 'Gasolina' },
        { quilometragem: 1300, litros: 9, tipoCombustivel: 'Etanol' },
      ] as any);

    const res = await abastecimentoService.calcularConsumoMedio(1);
    expect(res.gasolina).toBeGreaterThan(0);
    expect(res.etanol).toBeGreaterThan(0);

    spy.mockRestore();
  });
});
