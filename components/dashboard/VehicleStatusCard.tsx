import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Veiculo } from '@/types/veiculo';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';

interface VehicleStatusCardProps {
  veiculos: Veiculo[];
  loading: boolean;
}

const VehicleStatusCard: React.FC<VehicleStatusCardProps> = ({ veiculos, loading }) => {
  const veiculosExibidos = veiculos.filter(v => v.exibirNoDashboard);

  const handleNavegarPara = (rota: string) => {
    router.push(rota as any);
  };

  return (
    <View style={styles.statusSection}>
      <ThemedText style={styles.sectionTitle}>Status do Veículo</ThemedText>
      {loading ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator size="small" color={Colors.light.tint} />
          <ThemedText style={styles.loadingText}>Carregando...</ThemedText>
        </View>
      ) : veiculosExibidos.length > 0 ? (
        veiculosExibidos.map(veiculo => (
          <View key={veiculo.id} style={styles.statusCard}>
            <ThemedText style={styles.statusTitle}>{veiculo.nome}</ThemedText>
            <View style={styles.statusInfo}>
              <View style={styles.statusItem}>
                <ThemedText style={styles.statusLabel}>Capacidade do Tanque</ThemedText>
                <ThemedText style={styles.statusValue}>{veiculo.capacidadeTanque}L</ThemedText>
              </View>
              <View style={styles.statusItem}>
                <ThemedText style={styles.statusLabel}>Consumo Gasolina</ThemedText>
                <ThemedText style={styles.statusValue}>{veiculo.consumoManualGasolina} km/L</ThemedText>
              </View>
              <View style={styles.statusItem}>
                <ThemedText style={styles.statusLabel}>Consumo Etanol</ThemedText>
                <ThemedText style={styles.statusValue}>{veiculo.consumoManualEtanol} km/L</ThemedText>
              </View>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyCard}>
          <ThemedText style={styles.emptyText}>Nenhum veículo selecionado para exibir no dashboard</ThemedText>
          <TouchableOpacity
            style={styles.addFirstButton}
            onPress={() => handleNavegarPara('/(tabs)/configuracoes')}
          >
            <ThemedText style={styles.addFirstButtonText}>Selecionar Veículos</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  statusSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 15,
  },
  statusCard: {
    backgroundColor: Colors.light.background,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 15,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 15,
  },
  statusInfo: {
    gap: 12,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 16,
    color: Colors.light.text,
    opacity: 0.8,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
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

export default VehicleStatusCard;