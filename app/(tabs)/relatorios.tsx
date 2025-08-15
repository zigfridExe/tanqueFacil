import React, { useMemo } from 'react';
import { StyleSheet, View, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAbastecimentos } from '@/hooks/useAbastecimentos';
import { useVeiculos } from '@/hooks/useVeiculos';
import { Abastecimento, Veiculo } from '@/types/veiculo';
import { Colors } from '@/constants/Colors';
import { Link } from 'expo-router';

interface ConsumoMedioResultado {
  veiculoId: number;
  nomeVeiculo: string;
  consumoMedio: number | null;
  mensagem: string;
}

export default function RelatoriosScreen() {
  const { abastecimentos, loading: loadingAbastecimentos } = useAbastecimentos();
  const { veiculos, loading: loadingVeiculos } = useVeiculos();

  const isLoading = loadingAbastecimentos || loadingVeiculos;

  const resultadosConsumo = useMemo(() => {
    if (isLoading || !veiculos.length) {
      return [];
    }

    const resultados: ConsumoMedioResultado[] = [];

    veiculos.forEach(veiculo => {
      const abastecimentosDoVeiculo = abastecimentos.filter(ab => ab.veiculoId === veiculo.id);

      if (abastecimentosDoVeiculo.length < 2) {
        resultados.push({
          veiculoId: veiculo.id!,
          nomeVeiculo: veiculo.nome,
          consumoMedio: null,
          mensagem: 'Necessita de pelo menos 2 abastecimentos para calcular.',
        });
        return;
      }

      // Ordenar por quilometragem para garantir a sequência correta
      const abastecimentosOrdenados = [...abastecimentosDoVeiculo].sort((a, b) => a.quilometragem - b.quilometragem);

      const primeiroAbastecimento = abastecimentosOrdenados[0];
      const ultimoAbastecimento = abastecimentosOrdenados[abastecimentosOrdenados.length - 1];

      const distanciaPercorrida = ultimoAbastecimento.quilometragem - primeiroAbastecimento.quilometragem;

      // Somar litros de todos os abastecimentos, exceto o primeiro (pois o primeiro KM já é o ponto de partida)
      // Ou, mais precisamente, somar todos os litros entre o primeiro e o último registro de KM.
      // Para simplificar, vamos somar todos os litros dos abastecimentos que contribuíram para a distância.
      // Uma abordagem mais precisa seria somar os litros de todos os abastecimentos *após* o primeiro registro de KM.
      // Para esta primeira versão, somaremos todos os litros dos abastecimentos ordenados.
      const totalLitros = abastecimentosOrdenados.reduce((sum, ab) => sum + ab.litros, 0);

      if (distanciaPercorrida <= 0 || totalLitros <= 0) {
        resultados.push({
          veiculoId: veiculo.id!,
          nomeVeiculo: veiculo.nome,
          consumoMedio: null,
          mensagem: 'Dados insuficientes ou inválidos para cálculo (distância ou litros).',
        });
        return;
      }

      const consumoMedio = distanciaPercorrida / totalLitros;

      resultados.push({
        veiculoId: veiculo.id!,
        nomeVeiculo: veiculo.nome,
        consumoMedio: consumoMedio,
        mensagem: `Consumo Médio: ${consumoMedio.toFixed(2)} km/L`,
      });
    });

    return resultados;
  }, [abastecimentos, veiculos, isLoading]);

  const renderItem = ({ item }: { item: ConsumoMedioResultado }) => (
    <View style={styles.card}>
      <ThemedText style={styles.cardTitle}>{item.nomeVeiculo}</ThemedText>
      <ThemedText style={styles.cardContent}>
        {item.consumoMedio !== null ? item.mensagem : item.mensagem}
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Relatórios</ThemedText>
        <Link href="/abastecimento-mapa" asChild>
            <TouchableOpacity style={styles.mapButton}>
                <ThemedText style={styles.mapButtonText}>Ver Mapa</ThemedText>
            </TouchableOpacity>
        </Link>
      </View>

      {isLoading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={Colors.light.tint} />
          <ThemedText style={styles.loadingText}>Carregando dados...</ThemedText>
        </View>
      ) : veiculos.length === 0 ? (
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyStateText}>Nenhum veículo cadastrado.</ThemedText>
          <ThemedText style={styles.emptyStateSubtext}>Cadastre veículos para ver relatórios.</ThemedText>
        </View>
      ) : abastecimentos.length === 0 ? (
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyStateText}>Nenhum abastecimento registrado.</ThemedText>
          <ThemedText style={styles.emptyStateSubtext}>Registre abastecimentos para calcular o consumo.</ThemedText>
        </View>
      ) : (
        <FlatList
          data={resultadosConsumo}
          renderItem={renderItem}
          keyExtractor={(item) => item.veiculoId.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  mapButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  mapButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardContent: {
    fontSize: 16,
  },
});