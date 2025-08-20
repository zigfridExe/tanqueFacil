import { formatBRL, formatTelefoneBR, formatPsi } from '../../src/utils/format';

describe('utils/format', () => {
  it('formata dinheiro BRL', () => {
    expect(formatBRL(12.3)).toMatch(/R\$\s?12,30/);
  });

  it('formata telefone 10/11 dígitos', () => {
    expect(formatTelefoneBR('11987654321')).toBe('(11) 98765-4321');
    expect(formatTelefoneBR('1132654321')).toBe('(11) 3265-4321');
  });

  it('formata pressão em psi', () => {
    expect(formatPsi(32)).toBe('32.0 psi');
  });
});
