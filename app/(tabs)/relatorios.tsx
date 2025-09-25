import ConsumptionTrendReport from '@/components/reports/ConsumptionTrendReport';
import CostsReport from '@/components/reports/CostsReport';
import PerformanceReport from '@/components/reports/PerformanceReport';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function RelatoriosScreen() {
  const router = useRouter();
  const [scope, setScope] = useState<'all' | 'active'>('all');
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Relatórios</ThemedText>
        <View style={styles.scopeRow}>
          <TouchableOpacity
            style={[styles.scopeBtn, scope === 'all' && styles.scopeBtnActive]}
            onPress={() => setScope('all')}
          >
            <ThemedText style={[styles.scopeBtnText, scope === 'all' && styles.scopeBtnTextActive]}>
              Todos os veículos
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.scopeBtn, scope === 'active' && styles.scopeBtnActive]}
            onPress={() => setScope('active')}
          >
            <ThemedText style={[styles.scopeBtnText, scope === 'active' && styles.scopeBtnTextActive]}>
              Veículo ativo
            </ThemedText>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.mapButton}
          onPress={() => router.push({
            pathname: '/abastecimento-mapa',
            params: { scope }
          })}
        >
          <ThemedText style={styles.mapButtonText}>Ver Mapa</ThemedText>
        </TouchableOpacity>
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
    paddingHorizontal: 10,
    paddingVertical: 12,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  mapButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  mapButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  scopeRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  scopeBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  scopeBtnActive: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  scopeBtnText: {
    color: Colors.light.text,
    fontWeight: '600',
  },
  scopeBtnTextActive: {
    color: '#FFF',
  },
});