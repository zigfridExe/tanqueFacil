import { consumoKmPorLitro, custoPorKm } from '../../src/utils/consumo';

describe('utils/consumo', () => {
  it('calcula km/l com duas casas', () => {
    expect(consumoKmPorLitro(450, 30)).toBe(15);
    expect(consumoKmPorLitro(0, 30)).toBe(0);
    expect(consumoKmPorLitro(100, 0)).toBe(0);
  });

  it('calcula custo/km com duas casas', () => {
    expect(custoPorKm(180, 450)).toBe(0.4);
    expect(custoPorKm(0, 100)).toBe(0);
    expect(custoPorKm(100, 0)).toBe(0);
  });
});
