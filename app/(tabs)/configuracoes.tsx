import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import * as database from '@/database/database';
import { useVeiculos } from '@/hooks/useVeiculos';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

export default function ConfiguracoesScreen() {
  const { carregarVeiculos } = useVeiculos();
  const [salvarLocalizacao, setSalvarLocalizacao] = useState<boolean>(false);
  const [notificacoesAtivas, setNotificacoesAtivas] = useState<boolean>(true);
  const [temaEscuro, setTemaEscuro] = useState<boolean>(false);
  const [backupAutomatico, setBackupAutomatico] = useState<boolean>(true);

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
              value={temaEscuro}
              onValueChange={setTemaEscuro}
              trackColor={{ false: Colors.light.tint, true: Colors.light.tint }}
              thumbColor={temaEscuro ? Colors.light.background : Colors.light.text}
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Funcionalidades</ThemedText>
          <View style={styles.switchGroup}>
            <ThemedText style={styles.label}>Salvar Localização</ThemedText>
            <Switch
              value={salvarLocalizacao}
              onValueChange={setSalvarLocalizacao}
              trackColor={{ false: Colors.light.tint, true: Colors.light.tint }}
              thumbColor={salvarLocalizacao ? Colors.light.background : Colors.light.text}
            />
          </View>
          <View style={styles.switchGroup}>
            <ThemedText style={styles.label}>Notificações</ThemedText>
            <Switch
              value={notificacoesAtivas}
              onValueChange={setNotificacoesAtivas}
              trackColor={{ false: Colors.light.tint, true: Colors.light.tint }}
              thumbColor={notificacoesAtivas ? Colors.light.background : Colors.light.text}
            />
          </View>
          <View style={styles.switchGroup}>
            <ThemedText style={styles.label}>Backup Automático</ThemedText>
            <Switch
              value={backupAutomatico}
              onValueChange={setBackupAutomatico}
              trackColor={{ false: Colors.light.tint, true: Colors.light.tint }}
              thumbColor={backupAutomatico ? Colors.light.background : Colors.light.text}
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
