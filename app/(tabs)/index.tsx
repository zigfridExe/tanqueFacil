import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import QuickActions from '../../components/dashboard/QuickActions';
import RemindersCard from '../../components/dashboard/RemindersCard';
import VehicleStatusCard from '../../components/dashboard/VehicleStatusCard';
import { useVeiculos } from '../../hooks/useVeiculos';
import { veiculoService } from '../../services/veiculoService';
import { VeiculoForm } from '../../types/veiculo';

export default function HomeScreen() {
  const { veiculos, loading, carregarVeiculos } = useVeiculos();
  const veiculoPrincipal = veiculos.length > 0 ? veiculos[0] : null;

  const [isCalibrationDue, setIsCalibrationDue] = useState(false);
  const [daysUntilCalibration, setDaysUntilCalibration] = useState<number | null>(null);

  useEffect(() => {
    if (veiculoPrincipal && veiculoPrincipal.lembreteCalibragem && veiculoPrincipal.frequenciaLembrete) {
      const lastCalibrationDate = veiculoPrincipal.dataUltimaCalibragem ? new Date(veiculoPrincipal.dataUltimaCalibragem) : null;
      const today = new Date();

      if (lastCalibrationDate) {
        const diffTime = Math.abs(today.getTime() - lastCalibrationDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const remainingDays = veiculoPrincipal.frequenciaLembrete - diffDays;

        if (remainingDays <= 0) {
          setIsCalibrationDue(true);
          setDaysUntilCalibration(0); // A calibração está vencida
        } else {
          setIsCalibrationDue(false);
          setDaysUntilCalibration(remainingDays);
        }
      } else {
        // Se não houver data da última calibração, assume-se que está vencida imediatamente se o lembrete estiver ativado
        setIsCalibrationDue(true);
        setDaysUntilCalibration(0);
      }
    } else {
      setIsCalibrationDue(false);
      setDaysUntilCalibration(null);
    }
  }, [veiculoPrincipal]);

  const handleCalibrarAgora = useCallback(async () => {
    if (!veiculoPrincipal) return;

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // AAAA-MM-DD

    const veiculoForm: VeiculoForm = {
      ...veiculoPrincipal,
      capacidadeTanque: veiculoPrincipal.capacidadeTanque.toString(),
      consumoManualGasolina: veiculoPrincipal.consumoManualGasolina.toString(),
      consumoManualEtanol: veiculoPrincipal.consumoManualEtanol.toString(),
      frequenciaLembrete: veiculoPrincipal.frequenciaLembrete.toString(),
      dataUltimaCalibragem: formattedDate,
    };

    const result = await veiculoService.atualizar(veiculoPrincipal.id!, veiculoForm);
    if (result.success) {
      Alert.alert('Sucesso', 'Data da última calibragem atualizada!');
      carregarVeiculos(); // Atualiza os dados para atualizar a IU
    } else {
      Alert.alert('Erro', 'Não foi possível atualizar a data da calibragem.');
    }
  }, [veiculoPrincipal, carregarVeiculos]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Meu Tanque Fácil</ThemedText>
          <ThemedText style={styles.subtitle}>Controle total do seu combustível</ThemedText>
        </View>

        {/* Ações Rápidas */}
        <QuickActions />

        {/* Status do Veículo */}
        <VehicleStatusCard veiculos={veiculos} loading={loading} />

        {/* Lembretes */}
        <RemindersCard 
          veiculos={veiculos} 
          handleCalibrarAgora={handleCalibrarAgora}
          isCalibrationDue={isCalibrationDue}
          daysUntilCalibration={daysUntilCalibration}
        />

        {/* Estatísticas Rápidas */}
        <View style={styles.statsSection}>
          <ThemedText style={styles.sectionTitle}>Este Mês</ThemedText>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>R$ 450</ThemedText>
              <ThemedText style={styles.statLabel}>Gasto com Combustível</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>180L</ThemedText>
              <ThemedText style={styles.statLabel}>Litros Abastecidos</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>2.100 km</ThemedText>
              <ThemedText style={styles.statLabel}>Quilometragem</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>11.7 km/L</ThemedText>
              <ThemedText style={styles.statLabel}>Consumo Médio</ThemedText>
            </View>
          </View>
        </View>
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
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.light.text,
    opacity: 0.8,
    textAlign: 'center',
  },
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
  loadingCard: {
    backgroundColor: Colors.light.background,
    padding: 20,
    borderRadius: 12,
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
  loadingText: {
    fontSize: 16,
    color: Colors.light.text,
    marginTop: 12,
    opacity: 0.7,
  },
  emptyCard: {
    backgroundColor: Colors.light.background,
    padding: 20,
    borderRadius: 12,
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
  emptyText: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  addFirstButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
});
