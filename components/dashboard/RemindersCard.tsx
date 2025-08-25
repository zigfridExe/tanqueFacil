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
  handleCalibrarAgora: (id: number) => void;
}

const RemindersCard: React.FC<RemindersCardProps> = ({ veiculos, handleCalibrarAgora }) => {
  const getCalibrationInfo = (veiculo: Veiculo) => {
    if (!veiculo.lembreteCalibragem) {
      return { isDue: false, daysUntil: null }; // No reminder set
    }

    const lastCalibration = veiculo.dataUltimaCalibragem ? new Date(veiculo.dataUltimaCalibragem) : null;
    const today = new Date();
    const frequency = veiculo.frequenciaLembrete || 30; // Default to 30 days if not set

    if (!lastCalibration) {
      return { isDue: true, daysUntil: 0 }; // No last calibration date, assume due immediately
    }

    const dueDate = new Date(lastCalibration);
    dueDate.setDate(lastCalibration.getDate() + frequency);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return { isDue: diffDays <= 0, daysUntil: diffDays > 0 ? diffDays : 0 };
  };

  const reminders = veiculos.map(veiculo => {
    const { isDue, daysUntil } = getCalibrationInfo(veiculo);
    if (veiculo.lembreteCalibragem && isDue) {
      return {
        id: veiculo.id,
        text: `🔧 Calibragem de pneus (${veiculo.nome}): Vencida!`, 
        isDue: true,
      };
    } else if (veiculo.lembreteCalibragem && daysUntil !== null && daysUntil > 0) {
      return {
        id: veiculo.id,
        text: `🔧 Calibragem de pneus (${veiculo.nome}): Em ${daysUntil} dias`, 
        isDue: false,
      };
    }
    return null;
  }).filter(Boolean) as ReminderItem[];

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
              <TouchableOpacity style={styles.calibrateButton} onPress={() => handleCalibrarAgora(reminder.id as number)}>
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
      {/* Hardcoded reminder for now, will be dynamic later */}
      <View style={styles.reminderCard}>
        <ThemedText style={styles.reminderText}>⛽ Abastecimento recomendado em 2 dias</ThemedText>
      </View>
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
  },
  calibrateButton: {
    backgroundColor: Colors.light.tint,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  calibrateButtonText: {
    color: Colors.light.background,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RemindersCard;