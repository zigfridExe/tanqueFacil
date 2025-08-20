export function consumoKmPorLitro(kmRodados: number, litros: number): number {
  if (!isFinite(kmRodados) || !isFinite(litros) || litros <= 0) return 0;
  return Number((kmRodados / litros).toFixed(2));
}

export function custoPorKm(valorTotal: number, kmRodados: number): number {
  if (!isFinite(valorTotal) || !isFinite(kmRodados) || kmRodados <= 0) return 0;
  return Number((valorTotal / kmRodados).toFixed(2));
}
