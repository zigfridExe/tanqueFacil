import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useVeiculos } from '@/hooks/useVeiculos';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';


const QuickActions = () => {
  const { veiculos, selectedVehicle } = useVeiculos();

  const handleNavegarPara = (rota: string, params?: Record<string, any>) => {
    if (params) {
      router.push({ pathname: rota as any, params });
    } else {
      router.push(rota as any);
    }
  };

  return (
    <View style={styles.quickActions}>
      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => handleNavegarPara('/gerenciamento-combustivel')}
      >
        <ThemedText style={styles.actionCardTitle}>⛽ Gerenciar</ThemedText>
        <ThemedText style={styles.actionCardSubtitle}>Nível e Autonomia</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => {
          // Usa o veículo selecionado ou o primeiro da lista
          const carroId = selectedVehicle?.id || veiculos[0]?.id;
          if (carroId) {
            handleNavegarPara('/abastecimento-registro', { carroId });
          } else {
            // Se não houver veículo, apenas navega sem param (ou pode exibir alerta)
            handleNavegarPara('/abastecimento-registro');
          }
        }}
      >
        <ThemedText style={styles.actionCardTitle}>⛽ Abastecer</ThemedText>
        <ThemedText style={styles.actionCardSubtitle}>Registrar</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => handleNavegarPara('/combustivel-comparador')}
      >
        <ThemedText style={styles.actionCardTitle}>⚖️ Comparar</ThemedText>
        <ThemedText style={styles.actionCardSubtitle}>Verificar Preços</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => handleNavegarPara('/abastecimento-historico')}
      >
        <ThemedText style={styles.actionCardTitle}>📊 Histórico</ThemedText>
        <ThemedText style={styles.actionCardSubtitle}>Ver registros</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionCard: {
    width: '48%',
    backgroundColor: Colors.light.tint,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: '1%',
    marginBottom: 15,
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
});

export default QuickActions;