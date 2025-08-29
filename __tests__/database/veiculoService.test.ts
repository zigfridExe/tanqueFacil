import { veiculoService } from '../../services/veiculoService';
import { VeiculoForm } from '../../types/veiculo';

// Mock do módulo de database com API assíncrona (usar variáveis prefixadas 'mock' para o Jest permitir no factory)
let mockRunAsync: jest.Mock;
let mockGetAllAsync: jest.Mock;
let mockGetFirstAsync: jest.Mock;

jest.mock('../../database/database', () => {
  mockRunAsync = jest.fn(async (sql: string, ..._params: any[]) => {
    if (sql.startsWith('INSERT')) {
      return { lastInsertRowId: 1, changes: 1 } as any;
    }
    if (sql.startsWith('UPDATE')) {
      return { changes: 1 } as any;
    }
    if (sql.startsWith('DELETE')) {
      return { changes: 1 } as any;
    }
    return { changes: 0 } as any;
  });

  mockGetAllAsync = jest.fn(async (_sql: string) => {
    return [
      {
        id: 1,
        nome: 'Fusca',
        capacidadeTanque: 40,
        consumoManualGasolina: 10,
        consumoManualEtanol: 7,
        tipoPonteiro: 'Analógico',
        salvarLocalizacao: 0,
        lembreteCalibragem: 0,
        frequenciaLembrete: 30,
      },
    ];
  });

  mockGetFirstAsync = jest.fn(async (_sql: string, _id?: number) => ({
    id: 1,
    nome: 'Fusca',
    capacidadeTanque: 40,
    consumoManualGasolina: 10,
    consumoManualEtanol: 7,
    tipoPonteiro: 'Analógico',
    salvarLocalizacao: 0,
    lembreteCalibragem: 0,
    frequenciaLembrete: 30,
  }));

  return {
    __esModule: true,
    default: async () => ({
      runAsync: mockRunAsync,
      getAllAsync: mockGetAllAsync,
      getFirstAsync: mockGetFirstAsync,
    }),
  };
});

describe('veiculoService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um veículo com sucesso', async () => {
    const veiculoForm: VeiculoForm = {
      nome: 'Fusca',
      capacidadeTanque: '40',
      consumoManualGasolina: '10',
      consumoManualEtanol: '7',
      tipoPonteiro: 'Analógico',
      salvarLocalizacao: false,
      lembreteCalibragem: false,
      frequenciaLembrete: '30',
    };

    const result = await veiculoService.criar(veiculoForm);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.id).toBe(1);
    expect(mockRunAsync).toHaveBeenCalled();
  });

  it('deve buscar todos os veículos com sucesso', async () => {
    const result = await veiculoService.buscarTodos();

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.length).toBe(1);
    expect(result.data?.[0].nome).toBe('Fusca');
  });

  it('deve atualizar um veículo com sucesso', async () => {
    const veiculoForm: VeiculoForm = {
        nome: 'Fusca',
        capacidadeTanque: '40',
        consumoManualGasolina: '10',
        consumoManualEtanol: '7',
        tipoPonteiro: 'Analógico',
        salvarLocalizacao: false,
        lembreteCalibragem: false,
        frequenciaLembrete: '30',
      };

    const result = await veiculoService.atualizar(1, veiculoForm);

    expect(result.success).toBe(true);
  });

  it('deve excluir um veículo com sucesso', async () => {
    // Simula que não há abastecimentos vinculados ao veículo
    mockGetFirstAsync.mockResolvedValueOnce({ count: 0 });
    const result = await veiculoService.excluir(1);

    expect(result.success).toBe(true);
  });

  it('deve chamar o método de inserção com os parâmetros corretos', async () => {
    const veiculoForm: VeiculoForm = {
      nome: 'Chevette',
      capacidadeTanque: '45',
    };

    await veiculoService.criar(veiculoForm);

    expect(mockRunAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO Carro'),
      'Chevette',
      45,
      null, // consumoManualGasolina (default)
      null, // consumoManualEtanol (default)
      'Analógico', // tipoPonteiro (default)
      0, // salvarLocalizacao (default)
      0, // lembreteCalibragem (default)
      30, // frequenciaLembrete (default)
      1 // exibirNoDashboard (default)
    );
  });
});
