import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useAbastecimentos } from '@/hooks/useAbastecimentos';
import { consumoKmPorLitro } from '@/src/utils/consumo';
import { formatBRL } from '@/src/utils/format';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function QuickStats() {
  const { abastecimentos, carregarTodosAbastecimentos } = useAbastecimentos();
  const [stats, setStats] = useState({
    gastoTotal: 0,
    litrosTotal: 0,
    kmTotal: 0,
    consumoMedio: 0,
  });

  useEffect(() => {
    carregarTodosAbastecimentos();
  }, []);

  useEffect(() => {
    if (abastecimentos.length > 1) {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      const monthlyAbastecimentos = abastecimentos.filter(a => {
        const aDate = new Date(a.data);
        return aDate.getMonth() === currentMonth && aDate.getFullYear() === currentYear;
      });

      if (monthlyAbastecimentos.length > 1) {
        const gastoTotal = monthlyAbastecimentos.reduce((acc, a) => acc + a.valorTotal, 0);
        const litrosTotal = monthlyAbastecimentos.reduce((acc, a) => acc + a.litros, 0);

        const sortedAbastecimentos = [...monthlyAbastecimentos].sort((a, b) => a.quilometragem - b.quilometragem);
        const kmTotal = sortedAbastecimentos[sortedAbastecimentos.length - 1].quilometragem - sortedAbastecimentos[0].quilometragem;

        const consumoMedio = consumoKmPorLitro(kmTotal, litrosTotal);

        setStats({
          gastoTotal,
          litrosTotal,
          kmTotal,
          consumoMedio,
        });
      }
    }
  }, [abastecimentos]);

  return (
    <View style={styles.statsSection}>
      <ThemedText style={styles.sectionTitle}>Este Mês</ThemedText>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <ThemedText style={styles.statValue}>{formatBRL(stats.gastoTotal)}</ThemedText>
          <ThemedText style={styles.statLabel}>Gasto com Combustível</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statValue}>{stats.litrosTotal.toFixed(2)}L</ThemedText>
          <ThemedText style={styles.statLabel}>Litros Abastecidos</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statValue}>{stats.kmTotal.toFixed(1)} km</ThemedText>
          <ThemedText style={styles.statLabel}>Quilometragem</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statValue}>{stats.consumoMedio.toFixed(1)} km/L</ThemedText>
          <ThemedText style={styles.statLabel}>Consumo Médio</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: Colors.light.background,
    padding: 15,
    borderRadius: 12,
    width: '48%', // Two columns with a small gap
    marginBottom: 15,
    alignItems: 'center',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.8,
    marginTop: 5,
    textAlign: 'center',
  },
});
