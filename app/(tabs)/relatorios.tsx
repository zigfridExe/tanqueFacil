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

  const { resultadosConsumo, totalSpent, totalLiters, totalMileage, averageCostPerLiter } = useMemo(() => {
    if (isLoading || !veiculos.length) {
      return {
        resultadosConsumo: [],
        totalSpent: 0,
        totalLiters: 0,
        totalMileage: 0,
        averageCostPerLiter: 0,
      };
    }

    const resultados: ConsumoMedioResultado[] = [];
    let overallTotalSpent = 0;
    let overallTotalLiters = 0;
    let overallTotalMileage = 0; // This will be the sum of distances for each vehicle

    veiculos.forEach(veiculo => {
      const abastecimentosDoVeiculo = abastecimentos.filter(ab => ab.carroId === veiculo.id);

      // Calculate overall metrics
      abastecimentosDoVeiculo.forEach(ab => {
        overallTotalSpent += ab.valorPago;
        overallTotalLiters += ab.litros;
      });

      if (abastecimentosDoVeiculo.length < 2) {
        resultados.push({
          veiculoId: veiculo.id!,
          nomeVeiculo: veiculo.nome,
          consumoMedio: null,
          mensagem: 'Necessita de pelo menos 2 abastecimentos para calcular.',
        });
        return;
      }

      const abastecimentosOrdenados = [...abastecimentosDoVeiculo].sort((a, b) => a.quilometragem - b.quilometragem);

      const primeiroAbastecimento = abastecimentosOrdenados[0];
      const ultimoAbastecimento = abastecimentosOrdenados[abastecimentosOrdenados.length - 1];

      const distanciaPercorrida = ultimoAbasteamento.quilometragem - primeiroAbastecimento.quilometragem;
      overallTotalMileage += distanciaPercorrida; // Add to overall mileage

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

    const overallAverageCostPerLiter = overallTotalLiters > 0 ? overallTotalSpent / overallTotalLiters : 0;

    return {
      resultadosConsumo: resultados,
      totalSpent: overallTotalSpent,
      totalLiters: overallTotalLiters,
      totalMileage: overallTotalMileage,
      averageCostPerLiter: overallAverageCostPerLiter,
    };
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
        <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
          {/* Seção de Consumo Médio por Veículo */}
          <ThemedText style={styles.sectionTitle}>Consumo Médio por Veículo</ThemedText>
          <FlatList
            data={resultadosConsumo}
            renderItem={renderItem}
            keyExtractor={(item) => item.veiculoId.toString()}
            scrollEnabled={false} // Disable FlatList scrolling as it's inside a ScrollView
          />

          {/* Seção de Estatísticas Gerais */}
          <ThemedText style={styles.sectionTitle}>Estatísticas Gerais</ThemedText>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>R$ {totalSpent.toFixed(2)}</ThemedText>
              <ThemedText style={styles.statLabel}>Gasto Total</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>{totalLiters.toFixed(2)} L</ThemedText>
              <ThemedText style={styles.statLabel}>Litros Abastecidos</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>{totalMileage.toFixed(2)} km</ThemedText>
              <ThemedText style={styles.statLabel}>Quilometragem Total</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>R$ {averageCostPerLiter.toFixed(2)}/L</ThemedText>
              <ThemedText style={styles.statLabel}>Custo Médio por Litro</ThemedText>
            </View>
          </View>
        </ScrollView>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 20,
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: Colors.light.background,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.light.text,
    textAlign: 'center',
    opacity: 0.8,
  },
});