import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Veiculo } from '@/types/veiculo';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface ReminderItem {
  id: number;
  text: string;
  isDue: boolean;
}

interface RemindersCardProps {
  veiculos: Veiculo[];
  handleCalibrarAgora: () => void; // Alterado para não receber id
  isCalibrationDue: boolean;
  daysUntilCalibration: number | null;
}

const RemindersCard: React.FC<RemindersCardProps> = ({
  veiculos,
  handleCalibrarAgora,
  isCalibrationDue,
  daysUntilCalibration,
}) => {
  const veiculoPrincipal = veiculos.length > 0 ? veiculos[0] : null;
  const reminders: ReminderItem[] = [];

  if (veiculoPrincipal && veiculoPrincipal.id && veiculoPrincipal.lembreteCalibragem) {
    if (isCalibrationDue) {
      const hasRecord = !!veiculoPrincipal.dataUltimaCalibragem;
      reminders.push({
        id: veiculoPrincipal.id,
        text: hasRecord
          ? `🔧 Calibragem de pneus (${veiculoPrincipal.nome}): Vencida!`
          : `🔧 Calibragem de pneus (${veiculoPrincipal.nome}): Veículo sem registro de calibragem`,
        isDue: true,
      });
    } else if (daysUntilCalibration !== null && daysUntilCalibration > 0) {
      reminders.push({
        id: veiculoPrincipal.id,
        text: `🔧 Calibragem de pneus (${veiculoPrincipal.nome}): Em ${daysUntilCalibration} dias`,
        isDue: false,
      });
    }
  }

  return (
    <View style={styles.remindersSection}>
      <ThemedText style={styles.sectionTitle}>Lembretes</ThemedText>
      {reminders.length > 0 ? (
        reminders.map(reminder => (
          <View key={reminder.id} style={styles.reminderCard}>
            <ThemedText style={styles.reminderText}>
              {reminder.text}
            </ThemedText>
            {reminder.isDue && (
              <TouchableOpacity style={styles.calibrateButton} onPress={handleCalibrarAgora}>
                <ThemedText style={styles.calibrateButtonText}>Calibrar Agora</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        ))
      ) : (
        <View style={styles.emptyCard}>
          <ThemedText style={styles.emptyText}>Nenhum lembrete pendente.</ThemedText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  remindersSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 15,
  },
  reminderCard: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyCard: {
    backgroundColor: Colors.light.background,
    borderColor: Colors.light.tint,
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.text,
    fontStyle: 'italic',
  },
  reminderText: {
    fontSize: 16,
    color: '#856404',
    flex: 1,
  },
  calibrateButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  calibrateButtonText: {
    color: Colors.light.background,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RemindersCard;
