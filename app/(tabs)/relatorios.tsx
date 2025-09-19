import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { Link } from 'expo-router';
import CostsReport from '@/components/reports/CostsReport';
import PerformanceReport from '@/components/reports/PerformanceReport';
import ConsumptionTrendReport from '@/components/reports/ConsumptionTrendReport';

export default function RelatoriosScreen() {
  // Nesta primeira etapa, usamos componentes com dados mockados

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

      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {/* Ordem solicitada: 2 (Custos), 3 (Desempenho), 1 (Tendência) */}
        <CostsReport />
        <PerformanceReport />
        <ConsumptionTrendReport />
      </ScrollView>
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
  listContainer: {
    paddingHorizontal: 20,
  },
});