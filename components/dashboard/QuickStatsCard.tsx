import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface QuickStatsCardProps {
  stats: {
    totalGastos: number;
    totalLitros: number;
    kmTotal: number;
    consumoMedio: number;
  };
  loading: boolean;
}

const QuickStatsCard: React.FC<QuickStatsCardProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <View style={styles.statsSection}>
        <ThemedText style={styles.sectionTitle}>Este Mês</ThemedText>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color={Colors.light.tint} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.statsSection}>
      <ThemedText style={styles.sectionTitle}>Este Mês</ThemedText>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <ThemedText style={styles.statValue}>R$ {stats.totalGastos.toFixed(2)}</ThemedText>
          <ThemedText style={styles.statLabel}>Gasto com Combustível</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statValue}>{stats.totalLitros.toFixed(2)}L</ThemedText>
          <ThemedText style={styles.statLabel}>Litros Abastecidos</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statValue}>{stats.kmTotal.toFixed(2)} km</ThemedText>
          <ThemedText style={styles.statLabel}>Quilometragem</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statValue}>{stats.consumoMedio.toFixed(2)} km/L</ThemedText>
          <ThemedText style={styles.statLabel}>Consumo Médio</ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsSection: {
    marginBottom: 30,
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
    gap: 15,
  },
  statCard: {
    width: '47%',
    backgroundColor: Colors.light.background,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.8,
    textAlign: 'center',
  },
  loadingCard: {
    width: '100%',
    height: 150,
    backgroundColor: Colors.light.background,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
});

export default QuickStatsCard;