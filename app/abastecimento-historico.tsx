import { useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Colors } from '../constants/Colors';
import { useAbastecimentos } from '../hooks/useAbastecimentos';
import { Abastecimento } from '../types/veiculo';

// Componente do Card de Abastecimento
const AbastecimentoCard = ({ item, onExcluir }: { item: Abastecimento, onExcluir: (item: Abastecimento) => void }) => (
  <View style={styles.card}>
    <View style={styles.cardInfo}>
      <ThemedText style={styles.cardTitle}>
        Data: {new Date(item.data).toLocaleDateString('pt-BR')}
      </ThemedText>
      <ThemedText style={styles.cardDetalhes}>
        Veículo: {item.carroNome ? item.carroNome : `#${item.carroId}`}
      </ThemedText>
      <ThemedText style={styles.cardDetalhes}>
        Combustível: {item.tipoCombustivel}
      </ThemedText>
      <ThemedText style={styles.cardDetalhes}>
        Litros: {item.litros.toFixed(2)}L | Preço/L: R$ {item.precoPorLitro.toFixed(2)}
      </ThemedText>
      <ThemedText style={styles.cardDetalhes}>
        Valor Total: R$ {item.valorPago.toFixed(2)}
      </ThemedText>
      <ThemedText style={styles.cardDetalhes}>
        KM: {item.quilometragem}
      </ThemedText>
    </View>
    
    <View style={styles.cardAcoes}>
      <TouchableOpacity
        style={[styles.actionButton, styles.excluirButton]}
        onPress={() => onExcluir(item)}
      >
        <ThemedText style={styles.actionButtonText}>Excluir</ThemedText>
      </TouchableOpacity>
    </View>
  </View>
);

export default function AbastecimentoHistoricoScreen() {
  const { 
    abastecimentos, 
    loading, 
    error, 
    excluirAbastecimento, 
    carregarTodosAbastecimentos,
    refresh,
  } = useAbastecimentos();

  useFocusEffect(
    useCallback(() => {
      carregarTodosAbastecimentos();
    }, [carregarTodosAbastecimentos])
  );

  const handleExcluirAbastecimento = async (abastecimento: Abastecimento) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir este registro de abastecimento?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const sucesso = await excluirAbastecimento(abastecimento.id!, abastecimento.carroId);
            if (!sucesso) {
              Alert.alert('Erro', error || 'Erro ao excluir o registro.');
            }
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Histórico</ThemedText>
      </View>

      {loading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={Colors.light.tint} />
          <ThemedText style={styles.loadingText}>Carregando histórico...</ThemedText>
        </View>
      ) : error ? (
        <View style={styles.errorState}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <TouchableOpacity style={styles.retryButton} onPress={() => carregarTodosAbastecimentos()}>
            <ThemedText style={styles.retryButtonText}>Tentar Novamente</ThemedText>
          </TouchableOpacity>
        </View>
      ) : abastecimentos.length === 0 ? (
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyStateText}>
            Nenhum abastecimento registrado ainda.
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={abastecimentos}
          renderItem={({ item }) => <AbastecimentoCard item={item} onExcluir={handleExcluirAbastecimento} />}
          keyExtractor={(item) => item.id?.toString() || '0'}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={carregarTodosAbastecimentos}
              colors={[Colors.light.tint]}
            />
          }
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
    color: Colors.light.text,
  },
  listContainer: {
    padding: 20,
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
  devInfo: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  devText: {
    fontSize: 12,
    color: '#777',
  },
  cardInfo: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  cardDetalhes: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 4,
    opacity: 0.8,
  },
  cardAcoes: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  excluirButton: {
    backgroundColor: '#ff6b6b',
  },
  actionButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.light.text,
    marginTop: 16,
    opacity: 0.7,
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
});