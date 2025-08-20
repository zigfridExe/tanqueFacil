import { act, renderHook } from '@testing-library/react-hooks';
import { useVehicleStore } from '@src/store';
import { Veiculo } from '../../types/veiculo';

const veiculo1: Veiculo = {
  id: 1,
  nome: 'Fusca',
  capacidadeTanque: 40,
  consumoManualGasolina: 10,
  consumoManualEtanol: 7,
  tipoPonteiro: 'Analógico',
  salvarLocalizacao: false,
  lembreteCalibragem: false,
  frequenciaLembrete: 30,
};

const veiculo2: Veiculo = {
  id: 2,
  nome: 'Gol',
  capacidadeTanque: 50,
  consumoManualGasolina: 12,
  consumoManualEtanol: 8,
  tipoPonteiro: 'Digital',
  salvarLocalizacao: true,
  lembreteCalibragem: true,
  frequenciaLembrete: 15,
};

describe('useVehicleStore', () => {

  beforeEach(() => {
    const { result } = renderHook(() => useVehicleStore());
    act(() => {
      result.current.setVehicles([]);
      result.current.selectVehicle(null);
    });
  });

  it('deve definir os veículos', () => {
    const { result } = renderHook(() => useVehicleStore());
    act(() => {
      result.current.setVehicles([veiculo1]);
    });
    expect(result.current.vehicles).toEqual([veiculo1]);
  });

  it('deve selecionar um veículo', () => {
    const { result } = renderHook(() => useVehicleStore());
    act(() => {
      result.current.selectVehicle(veiculo1);
    });
    expect(result.current.selectedVehicle).toEqual(veiculo1);
  });

  it('deve adicionar um veículo', () => {
    const { result } = renderHook(() => useVehicleStore());
    act(() => {
      result.current.addVehicle(veiculo1);
    });
    expect(result.current.vehicles).toEqual([veiculo1]);
  });

  it('deve atualizar um veículo', () => {
    const { result } = renderHook(() => useVehicleStore());
    act(() => {
      result.current.addVehicle(veiculo1);
    });
    const updatedVeiculo = { ...veiculo1, nome: 'Fusca Turbo' };
    act(() => {
      result.current.updateVehicle(updatedVeiculo);
    });
    expect(result.current.vehicles).toEqual([updatedVeiculo]);
  });

  it('deve remover um veículo', () => {
    const { result } = renderHook(() => useVehicleStore());
    act(() => {
      result.current.setVehicles([veiculo1, veiculo2]);
    });
    act(() => {
      result.current.removeVehicle(1);
    });
    expect(result.current.vehicles).toEqual([veiculo2]);
  });
});
