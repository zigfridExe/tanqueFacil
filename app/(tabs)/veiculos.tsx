import { router } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { Colors } from '../../constants/Colors';
import { useVeiculos } from '../../hooks/useVeiculos';
import { Veiculo } from '../../types/veiculo';

export default function VeiculosScreen() {
  const { 
    veiculos, 
    loading, 
    error, 
    excluirVeiculo, 
    carregarVeiculos,
    limparErro 
  } = useVeiculos();

  const handleAdicionarVeiculo = () => {
    router.push('/veiculo-cadastro');
  };

  const handleEditarVeiculo = (veiculo: Veiculo) => {
    // TODO: Implementar navegação para edição
    Alert.alert('Editar', `Editar veículo: ${veiculo.nome}`);
  };

  const handleExcluirVeiculo = async (veiculo: Veiculo) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir o veículo "${veiculo.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const sucesso = await excluirVeiculo(veiculo.id!);
            if (!sucesso) {
              Alert.alert('Erro', error || 'Erro ao excluir veículo');
            }
          },
        },
      ]
    );
  };

  const renderVeiculo = ({ item }: { item: Veiculo }) => (
    <View style={styles.veiculoCard}>
      <View style={styles.veiculoInfo}>
        <ThemedText style={styles.veiculoNome}>{item.nome}</ThemedText>
        <ThemedText style={styles.veiculoDetalhes}>
          Tanque: {item.capacidadeTanque}L | Gasolina: {item.consumoManualGasolina} km/L | Etanol: {item.consumoManualEtanol} km/L
        </ThemedText>
        <ThemedText style={styles.veiculoDetalhes}>
          Ponteiro: {item.tipoPonteiro} | Calibragem: {item.lembreteCalibragem ? 'Ativo' : 'Inativo'}
        </ThemedText>
      </View>
      
      <View style={styles.veiculoAcoes}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editarButton]}
          onPress={() => handleEditarVeiculo(item)}
        >
          <ThemedText style={styles.actionButtonText}>Editar</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.excluirButton]}
          onPress={() => handleExcluirVeiculo(item)}
        >
          <ThemedText style={styles.actionButtonText}>Excluir</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Meus Veículos</ThemedText>
        <TouchableOpacity style={styles.addButton} onPress={handleAdicionarVeiculo}>
          <ThemedText style={styles.addButtonText}>+ Adicionar</ThemedText>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={Colors.light.tint} />
          <ThemedText style={styles.loadingText}>Carregando veículos...</ThemedText>
        </View>
      ) : error ? (
        <View style={styles.errorState}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <TouchableOpacity style={styles.retryButton} onPress={carregarVeiculos}>
            <ThemedText style={styles.retryButtonText}>Tentar Novamente</ThemedText>
          </TouchableOpacity>
        </View>
      ) : veiculos.length === 0 ? (
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyStateText}>
            Nenhum veículo cadastrado ainda.
          </ThemedText>
          <ThemedText style={styles.emptyStateSubtext}>
            Toque em "Adicionar" para cadastrar seu primeiro veículo.
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={veiculos}
          renderItem={renderVeiculo}
          keyExtractor={(item) => item.id?.toString() || '0'}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={carregarVeiculos}
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
  addButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
  },
  veiculoCard: {
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
  veiculoInfo: {
    marginBottom: 16,
  },
  veiculoNome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  veiculoDetalhes: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 4,
    opacity: 0.8,
  },
  veiculoAcoes: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editarButton: {
    backgroundColor: Colors.light.tint,
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
  emptyStateSubtext: {
    fontSize: 16,
    color: Colors.light.text,
    textAlign: 'center',
    opacity: 0.7,
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