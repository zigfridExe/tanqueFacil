          import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import * as database from '@/database/database';
import { useVeiculos } from '@/hooks/useVeiculos';
import { abastecimentoService } from '@/services/abastecimentoService';
import { useDeveloperStore } from '@/src/store/useDeveloperStore';
import { useSettingsStore } from '@/src/store/useSettingsStore';
import { useVehicleStore } from '@/src/store/useVehicleStore';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';



export default function ConfiguracoesScreen() {
  const { carregarVeiculos } = useVeiculos();
  const { showCoordinates, toggleShowCoordinates } = useDeveloperStore();
  const { selectedVehicle } = useVehicleStore();
  const {
    notificationsEnabled,
    darkMode,
    automaticBackup,
    toggleNotifications,
    toggleDarkMode,
    toggleAutomaticBackup,
  } = useSettingsStore();

  const handleResetData = () => {
    Alert.alert(
      'Limpar Todos os Dados',
      'Tem certeza que deseja apagar todos os dados do aplicativo? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar Tudo',
          style: 'destructive',
          onPress: async () => {
            try {
              await database.resetDatabase();
              Alert.alert('Sucesso', 'Todos os dados foram apagados.');
              carregarVeiculos();
              router.replace('/(tabs)');
            } catch (error) {
              console.error('Erro ao limpar dados:', error);
              Alert.alert('Erro', 'Não foi possível limpar os dados.');
            }
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Configurações do Aplicativo</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Preferências de Exibição</ThemedText>
          <View style={styles.switchGroup}>
            <ThemedText style={styles.label}>Tema Escuro</ThemedText>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: Colors.light.tint, true: Colors.light.tint }}
              thumbColor={darkMode ? Colors.light.background : Colors.light.text}
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Funcionalidades</ThemedText>
          <View style={styles.switchGroup}>
            <ThemedText style={styles.label}>Notificações</ThemedText>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: Colors.light.tint, true: Colors.light.tint }}
              thumbColor={notificationsEnabled ? Colors.light.background : Colors.light.text}
            />
          </View>
          <View style={styles.switchGroup}>
            <ThemedText style={styles.label}>Backup Automático</ThemedText>
            <Switch
              value={automaticBackup}
              onValueChange={toggleAutomaticBackup}
              trackColor={{ false: Colors.light.tint, true: Colors.light.tint }}
              thumbColor={automaticBackup ? Colors.light.background : Colors.light.text}
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Gerenciamento de Dados</ThemedText>
          <TouchableOpacity 
            style={[styles.button, styles.exportButton]} 
            onPress={() => Alert.alert('Em desenvolvimento', 'Exportação de dados em desenvolvimento')}
          >
            <ThemedText style={styles.buttonText}>Exportar Dados</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.backupButton]} 
            onPress={() => Alert.alert('Em desenvolvimento', 'Backup em desenvolvimento')}
          >
            <ThemedText style={styles.buttonText}>Fazer Backup</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.restoreButton]} 
            onPress={() => Alert.alert('Em desenvolvimento', 'Restauração em desenvolvimento')}
          >
            <ThemedText style={styles.buttonText}>Restaurar Backup</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.dangerButton]} 
            onPress={handleResetData}
          >
            <ThemedText style={styles.buttonText}>Limpar Todos os Dados</ThemedText>
          </TouchableOpacity>
        </View>

  <View style={[styles.section, styles.developerSection]}>
          <ThemedText style={styles.sectionTitle}>Opções de Desenvolvedor</ThemedText>
          <View style={styles.switchGroup}>
            <ThemedText style={styles.label}>Exibir coordenadas no histórico</ThemedText>
            <Switch
              value={showCoordinates}
              onValueChange={toggleShowCoordinates}
              trackColor={{ false: Colors.light.tint, true: Colors.light.tint }}
              thumbColor={showCoordinates ? Colors.light.background : Colors.light.text}
            />
          </View>
          {/* Botão para solicitar permissão de localização (GPS) */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#00796B' }]}
            onPress={async () => {
              try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status === 'granted') {
                  Alert.alert('Permissão concedida', 'Permissão de localização concedida com sucesso!');
                } else {
                  Alert.alert('Permissão negada', 'Permissão de localização não foi concedida.');
                }
              } catch {
                Alert.alert('Erro', 'Erro ao solicitar permissão de localização.');
              }
            }}
          >
            <ThemedText style={styles.buttonText}>Solicitar permissão de localização (GPS)</ThemedText>
          </TouchableOpacity>
          {/* Botão para mostrar último abastecimento no console */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#333' }]}
            onPress={async () => {
              if (!selectedVehicle || !selectedVehicle.id) {
                Alert.alert('Atenção', 'Selecione um veículo para consultar o último abastecimento.');
                return;
              }
              const ultimo = await abastecimentoService.buscarUltimoAbastecimentoPorVeiculo(selectedVehicle.id);
              if (ultimo) {
                // Mostra no console do desenvolvedor
                console.log('Último abastecimento:', ultimo);
                Alert.alert('Sucesso', 'Informações do último abastecimento exibidas no console.');
              } else {
                Alert.alert('Nenhum registro', 'Nenhum abastecimento encontrado para este veículo.');
              }
            }}
          >
            <ThemedText style={styles.buttonText}>Mostrar último abastecimento no console</ThemedText>
          </TouchableOpacity>

          {/* Botão para mostrar todos os abastecimentos no console */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#555' }]}
            onPress={async () => {
              const todos = await abastecimentoService.buscarTodosAbastecimentos();
              if (todos && todos.length > 0) {
                console.log('Todos os abastecimentos:');
                todos.forEach((ab, idx) => {
                  console.log(`\n#${idx + 1}`);
                  Object.entries(ab).forEach(([col, val]) => {
                    console.log(`${col}: ${val}`);
                  });
                });
                Alert.alert('Sucesso', 'Todos os abastecimentos foram exibidos no console.');
              } else {
                Alert.alert('Nenhum registro', 'Nenhum abastecimento encontrado no banco de dados.');
              }
            }}
          >
            <ThemedText style={styles.buttonText}>Mostrar todos abastecimentos no console</ThemedText>
          </TouchableOpacity>

          {/* Botão para mostrar localização atual no console */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#1976D2' }]}
            onPress={async () => {
              try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                  Alert.alert('Permissão negada', 'Permissão de localização não foi concedida.');
                  return;
                }
                const location = await Location.getCurrentPositionAsync({});
                console.log('Localização atual:', location);
                Alert.alert('Sucesso', 'Localização atual exibida no console.');
              } catch {
                Alert.alert('Erro', 'Erro ao obter localização.');
              }
            }}
          >
            <ThemedText style={styles.buttonText}>Mostrar localização atual no console</ThemedText>
          </TouchableOpacity>

          {/* Botão para verificar o status da conexão com o banco de dados */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#FF8F00' }]}
            onPress={async () => {
              const status = await database.getDatabaseStatus();
              console.log('Status do Banco de Dados:', status);
              Alert.alert(
                'Status da Conexão',
                `Conectado: ${status.connected}\nMensagem: ${status.message}`
              );
            }}
          >
            <ThemedText style={styles.buttonText}>Verificar Status do Banco</ThemedText>
          </TouchableOpacity>

          {/* Botão para forçar a reconexão com o banco de dados */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#D32F2F' }]}
            onPress={async () => {
              Alert.alert(
                'Forçar Reconexão',
                'Isso fechará a conexão atual e tentará uma nova. Deseja continuar?',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Continuar',
                    style: 'destructive',
                    onPress: async () => {
                      const result = await database.forceReconnect();
                      if (result.success) {
                        Alert.alert('Sucesso', result.message);
                      } else {
                        Alert.alert('Erro', result.message);
                      }
                    },
                  },
                ]
              );
            }}
          >
            <ThemedText style={styles.buttonText}>Forçar Reconexão com o Banco</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Sobre o Aplicativo</ThemedText>
          <View style={styles.aboutItem}>
            <ThemedText style={styles.aboutLabel}>Versão</ThemedText>
            <ThemedText style={styles.aboutValue}>1.0.0</ThemedText>
          </View>
          <TouchableOpacity 
            style={styles.supportButton}
            onPress={() => Alert.alert('Suporte', 'Entre em contato: suporte@tanquefacil.com')}
          >
            <ThemedText style={styles.supportButtonText}>Contato do Suporte</ThemedText>
          </TouchableOpacity>
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 30,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  developerSection: {
    backgroundColor: '#fff8e1',
    borderColor: '#ffc107',
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.light.text,
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: Colors.light.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  exportButton: {
    backgroundColor: Colors.light.tint,
  },
  backupButton: {
    backgroundColor: '#4CAF50',
  },
  restoreButton: {
    backgroundColor: '#2196F3',
  },
  dangerButton: {
    backgroundColor: '#F44336',
    marginTop: 10,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  aboutLabel: {
    fontSize: 16,
    color: Colors.light.text,
  },
  aboutValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  supportButton: {
    padding: 10,
    alignItems: 'center',
  },
  supportButtonText: {
    color: Colors.light.tint,
    textDecorationLine: 'underline',
  },
});