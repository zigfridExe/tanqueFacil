import { router, useFocusEffect } from 'expo-router';
import React, { memo, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
  Switch,
} from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { Colors } from '../../constants/Colors';
import { useVeiculos } from '../../hooks/useVeiculos';
import { Veiculo } from '../../types/veiculo';

// Cabeçalho do card (nome + indicador ativo + switch) – re-renderiza só quando muda isActive ou nome
const VehicleHeader = memo(function VehicleHeader({
  name,
  isActive,
  onToggle,
}: {
  name: string;
  isActive: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.veiculoHeaderRow}>
      <View style={{ flex: 1 }}>
        <ThemedText style={styles.veiculoNome}>
          {name}
          {isActive ? '  • Ativo' : ''}
        </ThemedText>
      </View>
      <View style={styles.switchContainer}>
        <View style={styles.switchLabelRow}>
          <ThemedText style={styles.switchLabel}>Ativo</ThemedText>
        </View>
        <Switch
          value={isActive}
          onValueChange={onToggle}
          trackColor={{ false: '#E0E0E0', true: Colors.light.tint }}
          thumbColor={'#FFFFFF'}
        />
      </View>
    </View>
  );
}, (prev, next) => prev.name === next.name && prev.isActive === next.isActive);

// Detalhes do veículo (memoizados) – não dependem do estado "ativo"
const VehicleDetails = memo(function VehicleDetails({
  capacidadeTanque,
  consumoManualGasolina,
  consumoManualEtanol,
  tipoPonteiro,
  lembreteCalibragem,
}: {
  capacidadeTanque: number;
  consumoManualGasolina: number | null;
  consumoManualEtanol: number | null;
  tipoPonteiro: string;
  lembreteCalibragem: boolean;
}) {
  return (
    <>
      <ThemedText style={styles.veiculoDetalhes}>
        Tanque: {capacidadeTanque}L | Gasolina: {consumoManualGasolina} km/L | Etanol: {consumoManualEtanol} km/L
      </ThemedText>
      <ThemedText style={styles.veiculoDetalhes}>
        Ponteiro: {tipoPonteiro} | Calibragem: {lembreteCalibragem ? 'Ativo' : 'Inativo'}
      </ThemedText>
    </>
  );
});

// Ações do veículo (memoizadas) – não dependem do estado "ativo"
const VehicleActions = memo(function VehicleActions({
  onPressConfigurar,
  onPressEditar,
  onPressAbastecer,
  onPressExcluir,
}: {
  onPressConfigurar: () => void;
  onPressEditar: () => void;
  onPressAbastecer: () => void;
  onPressExcluir: () => void;
}) {
  return (
    <View style={styles.veiculoAcoes} renderToHardwareTextureAndroid shouldRasterizeIOS>
      <TouchableOpacity
        style={[styles.actionButton, styles.configButton]}
        onPress={onPressConfigurar}
      >
        <ThemedText style={styles.actionButtonText}>Configurar</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.editarButton]}
        onPress={onPressEditar}
      >
        <ThemedText style={styles.actionButtonText}>Editar</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.abastecerButton]}
        onPress={onPressAbastecer}
      >
        <ThemedText style={styles.actionButtonText}>Abastecer</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.excluirButton]}
        onPress={onPressExcluir}
      >
        <ThemedText style={styles.actionButtonText}>Excluir</ThemedText>
      </TouchableOpacity>
    </View>
  );
});

// Item de veículo memoizado – re-renderiza apenas quando muda "isActive" ou o próprio item
const VehicleItem = memo(function VehicleItem({
  item,
  isActive,
  onToggleActive,
  onConfigurar,
  onEditar,
  onAbastecer,
  onExcluir,
}: {
  item: Veiculo;
  isActive: boolean;
  onToggleActive: (item: Veiculo, isActive: boolean) => void;
  onConfigurar: (item: Veiculo) => void;
  onEditar: (item: Veiculo) => void;
  onAbastecer: (item: Veiculo) => void;
  onExcluir: (item: Veiculo) => void;
}) {
  return (
    <View style={styles.veiculoCard}>
      <VehicleHeader
        name={item.nome}
        isActive={isActive}
        onToggle={() => onToggleActive(item, isActive)}
      />
      <VehicleDetails
        capacidadeTanque={item.capacidadeTanque}
        consumoManualGasolina={item.consumoManualGasolina}
        consumoManualEtanol={item.consumoManualEtanol}
        tipoPonteiro={item.tipoPonteiro}
        lembreteCalibragem={item.lembreteCalibragem}
      />
      <VehicleActions
        onPressConfigurar={() => onConfigurar(item)}
        onPressEditar={() => onEditar(item)}
        onPressAbastecer={() => onAbastecer(item)}
        onPressExcluir={() => onExcluir(item)}
      />
    </View>
  );
}, (prevProps, nextProps) => {
  // Re-render apenas quando muda a flag de ativo ou a identidade do item (id)
  const prevId = prevProps.item.id;
  const nextId = nextProps.item.id;
  return prevId === nextId && prevProps.isActive === nextProps.isActive;
});

export default function VeiculosScreen() {
  const { 
    veiculos, 
    loading, 
    error, 
    excluirVeiculo, 
    carregarVeiculos,
    selectedVehicle,
    selectVehicle,
  } = useVeiculos();

  useFocusEffect(
    React.useCallback(() => {
      carregarVeiculos();
    }, [carregarVeiculos])
  );

  const handleAdicionarVeiculo = useCallback(() => {
    router.push({
      pathname: '/veiculo-cadastro',
      params: { refresh: Date.now() } // Força um refresh ao retornar
    });
  }, []);

  const handleEditarVeiculo = useCallback((veiculo: Veiculo) => {
    if (veiculo.id) {
      router.push({
        pathname: '/veiculo-cadastro',
        params: { veiculoId: veiculo.id }
      });
    }
  }, []);

  const handleConfigurarVeiculo = useCallback((veiculo: Veiculo) => {
    if (veiculo.id) {
      router.push({
        pathname: '/veiculo-configuracoes',
        params: { veiculoId: veiculo.id }
      });
    }
  }, []);

  const handleExcluirVeiculo = useCallback(async (veiculo: Veiculo) => {
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
  }, [excluirVeiculo, error]);

  const onToggleActive = useCallback((item: Veiculo, isActive: boolean) => {
    // Se já está ativo, desativa (opcional) ou mantém apenas um ativo
    selectVehicle(isActive ? null : item);
  }, [selectVehicle]);

  const renderVeiculo = useCallback(({ item }: { item: Veiculo }) => (
    <VehicleItem
      item={item}
      isActive={selectedVehicle?.id === item.id}
      onToggleActive={onToggleActive}
      onConfigurar={handleConfigurarVeiculo}
      onEditar={handleEditarVeiculo}
      onAbastecer={(v) => router.push({ pathname: '/abastecimento-registro', params: { carroId: v.id } })}
      onExcluir={handleExcluirVeiculo}
    />
  ), [selectedVehicle?.id, onToggleActive, handleConfigurarVeiculo, handleEditarVeiculo, handleExcluirVeiculo]);

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
            Toque em &quot;Adicionar&quot; para cadastrar seu primeiro veículo.
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={veiculos}
          renderItem={renderVeiculo}
          keyExtractor={(item) => item.id?.toString() || '0'}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          extraData={selectedVehicle?.id}
          removeClippedSubviews={false}
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
  veiculoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // Evitar uso de gap para reduzir relayout em algumas plataformas
    // Utilize margin no elemento da direita
    // gap: 12,
    marginBottom: 12,
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
  switchContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 12,
  },
  switchLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  switchLabel: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.8,
    marginBottom: 6,
  },
  switchLike: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E0E0E0',
    padding: 3,
    justifyContent: 'center',
  },
  switchLikeOn: {
    backgroundColor: Colors.light.tint,
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  switchThumbOn: {
    alignSelf: 'flex-end',
  },
  veiculoAcoes: {
    flexDirection: 'row',
    // Evitar gap; usar margens entre botões
    // gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 12,
  },
  configButton: {
    backgroundColor: '#2196F3',
  },
  editarButton: {
    backgroundColor: Colors.light.tint,
  },
  excluirButton: {
    backgroundColor: '#ff6b6b',
  },
  abastecerButton: {
    backgroundColor: Colors.light.tint,
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