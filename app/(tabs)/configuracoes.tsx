import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import * as database from '@/database/database'; // Importa o módulo do banco de dados
import React from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ConfiguracoesScreen() {

  const handleResetData = () => {
    Alert.alert(
      'Redefinir Dados',
      'Tem certeza que deseja redefinir todos os dados do aplicativo? Esta ação é irreversível.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Redefinir',
          style: 'destructive',
          onPress: async () => {
            try {
              await database.resetDatabase();
              Alert.alert('Sucesso', 'Todos os dados foram redefinidos.');
            } catch (error) {
              console.error('Erro ao redefinir dados:', error);
              Alert.alert('Erro', 'Não foi possível redefinir os dados.');
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
          <ThemedText style={styles.title}>Configurações</ThemedText>
        </View>

        {/* Seção de Dados */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Dados</ThemedText>
          <TouchableOpacity style={styles.optionButton} onPress={handleResetData}>
            <ThemedText style={styles.optionButtonText}>Redefinir Todos os Dados</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Seção Sobre */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Sobre</ThemedText>
          <View style={styles.aboutItem}>
            <ThemedText style={styles.aboutLabel}>Versão do Aplicativo:</ThemedText>
            <ThemedText style={styles.aboutValue}>1.0.0</ThemedText>
          </View>
          <View style={styles.aboutItem}>
            <ThemedText style={styles.aboutLabel}>Licença:</ThemedText>
            <ThemedText style={styles.aboutValue}>MIT License</ThemedText>
          </View>
          <View style={styles.aboutItem}>
            <ThemedText style={styles.aboutLabel}>Desenvolvido por:</ThemedText>
            <ThemedText style={styles.aboutValue}>MSR - Software developer</ThemedText>
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
  optionButton: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  optionButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
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
});