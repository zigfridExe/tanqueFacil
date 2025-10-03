import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import FuelManagementCard from '@/components/gerenciamento/FuelManagementCard';
import { Colors } from '@/constants/Colors';
import { useAbastecimentos } from '@/hooks/useAbastecimentos';
import { useVeiculos } from '@/hooks/useVeiculos';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function GerenciamentoCombustivelScreen() {
  const { veiculos, loading: loadingVeiculos } = useVeiculos();
  const { abastecimentos, loading: loadingAbastecimentos, carregarTodosAbastecimentos } = useAbastecimentos();

  const [nivelCombustivelPercentual, setNivelCombustivelPercentual] = useState('50'); // Default to 50%
  const [veiculoSelecionado] = useState<number | null>(null); // ID do veículo selecionado O everton removeu o setVeiculoSelecionado

  const isLoading = loadingVeiculos || loadingAbastecimentos;

  // Carregar abastecimentos quando a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      carregarTodosAbastecimentos();
    }, [carregarTodosAbastecimentos])
  );

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
      return veiculos.find(v => v.id === veiculoSelecionado) || null;
    } else if (veiculos.length > 0) {
      return veiculos[0];
    }
    return null;
  }, [veiculos, veiculoSelecionado]);

  const autonomia = useMemo(() => {
    if (!veiculoAtual || !nivelCombustivelPercentual || !veiculoAtual.id) {
      return null;
    }
    
    const percentual = parseFloat(nivelCombustivelPercentual.replace(',', '.')) / 100;
    if (isNaN(percentual) || percentual < 0 || percentual > 1) {
      return null;
    }

    const litrosRestantes = veiculoAtual.capacidadeTanque * percentual;
    const consumoMedio = consumosMedios[veiculoAtual.id];
    
    // Se não há consumo médio calculado, retorna null
    if (!consumoMedio) {
      return null;
    }

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
    <ThemedView style={styles.container} useSafeArea>
      <ScrollView>
        <FuelManagementCard
          veiculoAtual={veiculoAtual}
          consumosMedios={consumosMedios}
          nivelCombustivelPercentual={nivelCombustivelPercentual}
          setNivelCombustivelPercentual={setNivelCombustivelPercentual}
          autonomia={autonomia}
          litrosParaEncher={litrosParaEncher}
          onRegisterSupply={() => router.push('/abastecimento-registro')}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f2f5',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
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
});
