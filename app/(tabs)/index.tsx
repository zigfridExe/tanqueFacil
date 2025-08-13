import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useVeiculos } from '../../hooks/useVeiculos';

export default function HomeScreen() {
  const { veiculos, loading } = useVeiculos();
  
  const handleNavegarPara = (rota: string) => {
    router.push(rota);
  };

  const veiculoPrincipal = veiculos.length > 0 ? veiculos[0] : null;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Meu Tanque Fácil</ThemedText>
          <ThemedText style={styles.subtitle}>Controle total do seu combustível</ThemedText>
        </View>

        {/* Cards de Ação Rápida */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionCard} 
            onPress={() => handleNavegarPara('/veiculo-cadastro')}
          >
            <ThemedText style={styles.actionCardTitle}>+ Novo Veículo</ThemedText>
            <ThemedText style={styles.actionCardSubtitle}>Cadastrar veículo</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard} 
            onPress={() => handleNavegarPara('/abastecimento')}
          >
            <ThemedText style={styles.actionCardTitle}>⛽ Abastecer</ThemedText>
            <ThemedText style={styles.actionCardSubtitle}>Registrar abastecimento</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard} 
            onPress={() => handleNavegarPara('/test-sqlite')}
          >
            <ThemedText style={styles.actionCardTitle}>🧪 Teste SQLite</ThemedText>
            <ThemedText style={styles.actionCardSubtitle}>Verificar funcionamento</ThemedText>
          </TouchableOpacity>
        </View>

                {/* Status do Veículo */}
        <View style={styles.statusSection}>
          <ThemedText style={styles.sectionTitle}>Status do Veículo</ThemedText>
          {loading ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="small" color={Colors.light.tint} />
              <ThemedText style={styles.loadingText}>Carregando...</ThemedText>
            </View>
          ) : veiculoPrincipal ? (
            <View style={styles.statusCard}>
              <ThemedText style={styles.statusTitle}>{veiculoPrincipal.nome}</ThemedText>
              <View style={styles.statusInfo}>
                <View style={styles.statusItem}>
                  <ThemedText style={styles.statusLabel}>Capacidade do Tanque</ThemedText>
                  <ThemedText style={styles.statusValue}>{veiculoPrincipal.capacidadeTanque}L</ThemedText>
                </View>
                <View style={styles.statusItem}>
                  <ThemedText style={styles.statusLabel}>Consumo Gasolina</ThemedText>
                  <ThemedText style={styles.statusValue}>{veiculoPrincipal.consumoManualGasolina} km/L</ThemedText>
                </View>
                <View style={styles.statusItem}>
                  <ThemedText style={styles.statusLabel}>Consumo Etanol</ThemedText>
                  <ThemedText style={styles.statusValue}>{veiculoPrincipal.consumoManualEtanol} km/L</ThemedText>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <ThemedText style={styles.emptyText}>Nenhum veículo cadastrado</ThemedText>
              <TouchableOpacity 
                style={styles.addFirstButton} 
                onPress={() => handleNavegarPara('/veiculo-cadastro')}
              >
                <ThemedText style={styles.addFirstButtonText}>Cadastrar Primeiro Veículo</ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Lembretes */}
        <View style={styles.remindersSection}>
          <ThemedText style={styles.sectionTitle}>Lembretes</ThemedText>
          <View style={styles.reminderCard}>
            <ThemedText style={styles.reminderText}>🔧 Calibragem de pneus em 5 dias</ThemedText>
          </View>
          <View style={styles.reminderCard}>
            <ThemedText style={styles.reminderText}>⛽ Abastecimento recomendado em 2 dias</ThemedText>
          </View>
        </View>

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
  quickActions: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.light.tint,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.background,
    marginBottom: 4,
  },
  actionCardSubtitle: {
    fontSize: 14,
    color: Colors.light.background,
    opacity: 0.9,
    textAlign: 'center',
  },
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
  remindersSection: {
    marginBottom: 30,
  },
  reminderCard: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  reminderText: {
    fontSize: 16,
    color: '#856404',
  },
  statsSection: {
    marginBottom: 30,
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
