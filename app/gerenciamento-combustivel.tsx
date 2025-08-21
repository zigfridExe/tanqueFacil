import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useAbastecimentos } from '@/hooks/useAbastecimentos';
import { useVeiculos } from '@/hooks/useVeiculos';
import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function GerenciamentoCombustivelScreen() {
  const { veiculos, loading: loadingVeiculos } = useVeiculos();
  const { abastecimentos, loading: loadingAbastecimentos } = useAbastecimentos();

  const [nivelCombustivelPercentual, setNivelCombustivelPercentual] = useState('50'); // Default to 50%
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<number | null>(null); // ID do veículo selecionado

  const isLoading = loadingVeiculos || loadingAbastecimentos;

  // Calcula o consumo médio para cada veículo (reutilizando lógica dos relatórios)
  const consumosMedios = useMemo(() => {
    const resultados: { [key: number]: number } = {};
    if (isLoading || !veiculos.length) {
      return resultados;
    }

    veiculos.forEach(veiculo => {
      const abastecimentosDoVeiculo = abastecimentos.filter(ab => ab.carroId === veiculo.id);

      if (abastecimentosDoVeiculo.length >= 2) {
        const abastecimentosOrdenados = [...abastecimentosDoVeiculo].sort((a, b) => a.quilometragem - b.quilometragem);
        const primeiroAbastecimento = abastecimentosOrdenados[0];
        const ultimoAbastecimento = abastecimentosOrdenados[abastecimentosOrdenados.length - 1];
        const distanciaPercorrida = ultimoAbastecimento.quilometragem - primeiroAbastecimento.quilometragem;
        const totalLitros = abastecimentosOrdenados.reduce((sum, ab) => sum + ab.litros, 0);

        if (distanciaPercorrida > 0 && totalLitros > 0) {
          resultados[veiculo.id!] = distanciaPercorrida / totalLitros;
        }
      }
    });
    return resultados;
  }, [abastecimentos, veiculos, isLoading]);

  const veiculoAtual = useMemo(() => {
    if (veiculoSelecionado) {
      return veiculos.find(v => v.id === veiculoSelecionado);
    } else if (veiculos.length > 0) {
      // Seleciona o primeiro veículo por padrão se nenhum for explicitamente selecionado
      return veiculos[0];
    }
    return null;
  }, [veiculos, veiculoSelecionado]);

  const autonomia = useMemo(() => {
    if (!veiculoAtual || !nivelCombustivelPercentual || !consumosMedios[veiculoAtual.id!]) {
      return null;
    }
    const percentual = parseFloat(nivelCombustivelPercentual.replace(',', '.')) / 100;
    if (isNaN(percentual) || percentual < 0 || percentual > 1) {
      return null;
    }

    const litrosRestantes = veiculoAtual.capacidadeTanque * percentual;
    const consumoMedio = consumosMedios[veiculoAtual.id!];

    return litrosRestantes * consumoMedio;
  }, [veiculoAtual, nivelCombustivelPercentual, consumosMedios]);

  const litrosParaEncher = useMemo(() => {
    if (!veiculoAtual || !nivelCombustivelPercentual) {
      return null;
    }
    const percentual = parseFloat(nivelCombustivelPercentual.replace(',', '.')) / 100;
    if (isNaN(percentual) || percentual < 0 || percentual > 1) {
      return null;
    }

    const litrosRestantes = veiculoAtual.capacidadeTanque * percentual;
    return veiculoAtual.capacidadeTanque - litrosRestantes;
  }, [veiculoAtual, nivelCombustivelPercentual]);

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={Colors.light.tint} />
          <ThemedText style={styles.loadingText}>Carregando dados...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (veiculos.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyStateText}>Nenhum veículo cadastrado.</ThemedText>
          <ThemedText style={styles.emptyStateSubtext}>Cadastre um veículo para gerenciar o combustível.</ThemedText>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/veiculo-cadastro')}>
            <ThemedText style={styles.buttonText}>Cadastrar Veículo</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedText style={styles.headerTitle}>Gerenciamento de Combustível</ThemedText>

        {/* Seleção de Veículo (simplificado para o primeiro por enquanto) */}
        {veiculoAtual && (
          <View style={styles.infoCard}>
            <ThemedText style={styles.infoCardTitle}>Veículo Selecionado:</ThemedText>
            <ThemedText style={styles.infoCardContent}>{veiculoAtual.nome}</ThemedText>
            <ThemedText style={styles.infoCardContent}>Capacidade do Tanque: {veiculoAtual.capacidadeTanque} L</ThemedText>
            {consumosMedios[veiculoAtual.id!] ? (
              <ThemedText style={styles.infoCardContent}>Consumo Médio: {consumosMedios[veiculoAtual.id!].toFixed(2)} km/L</ThemedText>
            ) : (
              <ThemedText style={styles.infoCardContent}>Consumo Médio: Não calculado (necessita de abastecimentos)</ThemedText>
            )}
          </View>
        )}

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Nível Atual do Tanque</ThemedText>
          <View style={styles.sliderRow}>
            <ThemedText style={styles.sliderMinMax}>0%</ThemedText>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                step={1}
                minimumTrackTintColor={Colors.light.tint}
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor={Colors.light.tint}
                value={parseFloat(nivelCombustivelPercentual.replace(',', '.')) || 0}
                onValueChange={(v: number) => setNivelCombustivelPercentual(String(Math.round(v)))}
              />
            </View>
            <ThemedText style={styles.sliderMinMax}>100%</ThemedText>
          </View>
          <View style={styles.presetRow}>
            {[
              { label: '1/4', value: 25 },
              { label: '1/3', value: 33 },
              { label: '1/2', value: 50 },
              { label: '3/4', value: 75 },
              { label: '4/4', value: 100 },
            ].map(({ label, value }) => {
              const current = parseFloat(nivelCombustivelPercentual.replace(',', '.')) || 0;
              const active = Math.round(current) === value;
              return (
                <TouchableOpacity
                  key={label}
                  style={[styles.presetButton, active && styles.presetButtonActive]}
                  onPress={() => setNivelCombustivelPercentual(String(value))}
                >
                  <ThemedText style={[styles.presetButtonText, active && styles.presetButtonTextActive]}>
                    {label}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
          {!!nivelCombustivelPercentual && (
            <ThemedText style={styles.sliderValue}>{nivelCombustivelPercentual}%</ThemedText>
          )}
        </View>

        {nivelCombustivelPercentual && veiculoAtual ? (
          <View style={styles.resultsContainer}>
            <View style={styles.infoCard}>
              <ThemedText style={styles.infoCardTitle}>Nível Atual do Tanque</ThemedText>
              <View style={styles.resultItem}>
                <ThemedText style={styles.resultLabel}>Porcentagem:</ThemedText>
                <ThemedText style={styles.resultValue}>{nivelCombustivelPercentual}%</ThemedText>
              </View>
              <View style={styles.resultItem}>
                <ThemedText style={styles.resultLabel}>Litros Restantes:</ThemedText>
                <ThemedText style={styles.resultValue}>
                  {((veiculoAtual.capacidadeTanque * parseFloat(nivelCombustivelPercentual)) / 100).toFixed(2)} L
                </ThemedText>
              </View>
              <View style={styles.resultItem}>
                <ThemedText style={styles.resultLabel}>Litros para Encher:</ThemedText>
                <ThemedText style={styles.resultValue}>
                  {(veiculoAtual.capacidadeTanque - ((veiculoAtual.capacidadeTanque * parseFloat(nivelCombustivelPercentual)) / 100)).toFixed(2)} L
                </ThemedText>
              </View>
              {consumosMedios[veiculoAtual.id!] && (
                <>
                  <View style={styles.resultItem}>
                    <ThemedText style={styles.resultLabel}>Consumo Médio:</ThemedText>
                    <ThemedText style={styles.resultValue}>{consumosMedios[veiculoAtual.id!].toFixed(2)} km/L</ThemedText>
                  </View>
                  <View style={styles.resultItem}>
                    <ThemedText style={styles.resultLabel}>Autonomia Restante:</ThemedText>
                    <ThemedText style={styles.resultValue}>
                      {((veiculoAtual.capacidadeTanque * parseFloat(nivelCombustivelPercentual) / 100) * consumosMedios[veiculoAtual.id!]).toFixed(2)} km
                    </ThemedText>
                  </View>
                </>
              )}
            </View>
          </View>
        ) : (nivelCombustivelPercentual && veiculoAtual && !consumosMedios[veiculoAtual.id!]) ? (
          <View style={styles.resultsContainer}>
            <View style={styles.infoCard}>
              <ThemedText style={styles.infoCardTitle}>Nível Atual do Tanque</ThemedText>
              <View style={styles.resultItem}>
                <ThemedText style={styles.resultLabel}>Porcentagem:</ThemedText>
                <ThemedText style={styles.resultValue}>{nivelCombustivelPercentual}%</ThemedText>
              </View>
              <View style={styles.resultItem}>
                <ThemedText style={styles.resultLabel}>Litros Restantes:</ThemedText>
                <ThemedText style={styles.resultValue}>
                  {((veiculoAtual.capacidadeTanque * parseFloat(nivelCombustivelPercentual)) / 100).toFixed(2)} L
                </ThemedText>
              </View>
              <View style={styles.resultItem}>
                <ThemedText style={styles.resultLabel}>Litros para Encher:</ThemedText>
                <ThemedText style={styles.resultValue}>
                  {(veiculoAtual.capacidadeTanque - ((veiculoAtual.capacidadeTanque * parseFloat(nivelCombustivelPercentual)) / 100)).toFixed(2)} L
                </ThemedText>
              </View>
            </View>
            <View style={[styles.infoCard, { marginTop: 10 }]}>
              <ThemedText style={styles.resultLabel}>Não foi possível calcular a autonomia. Verifique se o veículo possui consumo médio calculado.</ThemedText>
            </View>
          </View>
        ) : null}

        <TouchableOpacity 
          style={[styles.button, { marginTop: 20, marginBottom: 40 }]}
          onPress={() => router.push('/abastecimento-registro')}
        >
          <ThemedText style={styles.buttonText}>Registrar Abastecimento</ThemedText>
        </TouchableOpacity>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.light.text,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.light.tint,
  },
  infoCardContent: {
    fontSize: 16,
    marginBottom: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.light.text,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.tint,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: Colors.light.background,
    color: Colors.light.text,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  sliderContainer: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  sliderMinMax: {
    width: 40,
    textAlign: 'center',
    color: Colors.light.text,
    opacity: 0.8,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    justifyContent: 'space-between',
  },
  presetButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.light.tint,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  presetButtonActive: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
    elevation: 3,
  },
  presetButtonText: {
    color: Colors.light.tint,
    fontWeight: '600',
    fontSize: 14,
  },
  presetButtonTextActive: {
    color: 'white',
    fontWeight: '700',
  },
  sliderValue: {
    marginTop: 6,
    textAlign: 'right',
    color: Colors.light.tint,
    fontWeight: '600',
  },
  resultsContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  resultLabel: {
    fontSize: 16,
    color: Colors.light.text,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
});
