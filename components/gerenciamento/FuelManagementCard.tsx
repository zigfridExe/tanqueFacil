import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Veiculo } from '@/types/veiculo';
import Slider from '@react-native-community/slider';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface FuelManagementCardProps {
  veiculoAtual: Veiculo | null;
  consumosMedios: { [key: number]: number };
  nivelCombustivelPercentual: string;
  setNivelCombustivelPercentual: (value: string) => void;
  autonomia: number | null;
  litrosParaEncher: number | null;
  onRegisterSupply: () => void;
}

export default function FuelManagementCard({
  veiculoAtual,
  consumosMedios,
  nivelCombustivelPercentual,
  setNivelCombustivelPercentual,
  autonomia,
  litrosParaEncher,
  onRegisterSupply,
}: FuelManagementCardProps) {
  return (
    <View>
      {veiculoAtual && (
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <ThemedText style={styles.infoCardTitle}>Veículo Selecionado</ThemedText>
            <ThemedText style={styles.vehicleName}>{veiculoAtual.nome}</ThemedText>
          </View>
          <View style={styles.vehicleInfoRow}>
            <View style={styles.vehicleInfoItem}>
              <ThemedText style={styles.vehicleInfoLabel}>Capacidade do Tanque:</ThemedText>
              <ThemedText style={styles.vehicleInfoValue}>{veiculoAtual.capacidadeTanque} L</ThemedText>
            </View>
            <View style={styles.vehicleInfoItem}>
              <ThemedText style={styles.vehicleInfoLabel}>Consumo Médio:</ThemedText>
              <ThemedText style={styles.vehicleInfoValue}>
                {veiculoAtual.id && consumosMedios[veiculoAtual.id]
                  ? `${consumosMedios[veiculoAtual.id].toFixed(1)} km/L`
                  : 'N/A'}
              </ThemedText>
            </View>
          </View>
        </View>
      )}

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Nível Atual do Tanque ({nivelCombustivelPercentual}%)</ThemedText>
        <View style={styles.sliderRow}>
          <ThemedText style={styles.sliderMinMax}>0%</ThemedText>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            minimumTrackTintColor={Colors.light.tint}
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor={Colors.light.tint}
            value={parseFloat(nivelCombustivelPercentual.replace(',', '.')) || 0}
            onValueChange={(v: number) => setNivelCombustivelPercentual(String(Math.round(v)))}
          />
          <ThemedText style={styles.sliderMinMax}>100%</ThemedText>
        </View>
        <View style={styles.presetRow}>
          {[
            { label: '1/4', value: 25 },
            { label: '1/2', value: 50 },
            { label: '3/4', value: 75 },
            { label: '4/4', value: 100 }, //alterado pelo Everton
          ].map(({ label, value }) => {
            const current = parseFloat(nivelCombustivelPercentual.replace(',', '.')) || 0;
            const active = Math.round(current) === value;
            return (
              <TouchableOpacity
                key={label}
                style={[styles.presetButton, active && styles.presetButtonActive]}
                onPress={() => setNivelCombustivelPercentual(String(value))}
              >
                <ThemedText style={[styles.presetButtonText, active && styles.presetButtonTextActive]}>
                  {label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={[styles.infoCard, { marginTop: 16 }]}>
        <ThemedText style={styles.infoCardTitle}>Estimativas</ThemedText>

        <View style={styles.autonomyContainer}>
          <View style={styles.autonomyItem}>
            <ThemedText style={styles.autonomyLabel}>Autonomia Restante:</ThemedText>
            <ThemedText style={styles.autonomyValue}>
              {autonomia ? `${autonomia.toFixed(0)} km` : 'N/A'}
            </ThemedText>
          </View>

          <View style={styles.autonomyItem}>
            <ThemedText style={styles.autonomyLabel}>Litros para Encher:</ThemedText>
            <ThemedText style={styles.autonomyValue}>
              {litrosParaEncher ? `${litrosParaEncher.toFixed(1)} L` : 'N/A'}
            </ThemedText>
          </View>
        </View>

        {veiculoAtual?.id && !consumosMedios[veiculoAtual.id] && (
          <ThemedText style={styles.warningText}>
            Cadastre pelo menos 2 abastecimentos para calcular a autonomia.
          </ThemedText>
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, { marginTop: 20, opacity: veiculoAtual ? 1 : 0.5 }]}
        disabled={!veiculoAtual}
        onPress={onRegisterSupply}
      >
        <ThemedText style={styles.buttonText}>Registrar Abastecimento</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoCardHeader: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.tint,
  },
  vehicleName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  vehicleInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  vehicleInfoItem: {
    flex: 1,
    alignItems: 'center',
  },
  vehicleInfoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  vehicleInfoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderMinMax: {
    width: 40,
    textAlign: 'center',
    color: '#666',
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    justifyContent: 'space-around',
  },
  presetButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    marginHorizontal: 4,
  },
  presetButtonActive: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  presetButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  presetButtonTextActive: {
    color: 'white',
  },
  autonomyContainer: {
    marginTop: 12,
  },
  autonomyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  autonomyLabel: {
    fontSize: 16,
    color: '#555',
  },
  autonomyValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  warningText: {
    color: '#e74c3c',
    marginTop: 12,
    textAlign: 'center',
    fontSize: 14,
    padding: 8,
    backgroundColor: '#fbeae5',
    borderRadius: 8,
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
