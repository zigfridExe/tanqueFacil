export interface Veiculo {
  id?: number;
  nome: string;
  capacidadeTanque: number;
  quilometragem: number;
  consumoManualGasolina: number | null;
  consumoManualEtanol: number | null;
  consumoMedioGasolina?: number;
  consumoMedioEtanol?: number;
  tipoPonteiro: 'Analógico' | 'Digital';
  salvarLocalizacao: boolean;
  lembreteCalibragem: boolean;
  frequenciaLembrete: number;
  dataUltimaCalibragem?: string; // Adicionado para armazenar a data da última calibragem
  exibirNoDashboard: boolean;
}

export interface VeiculoForm {
  nome: string;
  capacidadeTanque: string;
  quilometragem: string;
}

export interface Abastecimento {
  id?: number;
  data: string;
  quilometragem: number;
  litros: number;
  valorPago: number;
  precoPorLitro: number;
  tipoCombustivel: 'Gasolina' | 'Etanol';
  tipoTrajeto: 'Cidade' | 'Estrada' | 'Misto';
  calibragemPneus: boolean;
  latitude?: number;
  longitude?: number;
  carroId: number;
} 