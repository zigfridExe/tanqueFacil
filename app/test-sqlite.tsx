import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Colors } from '../constants/Colors';
import { initDatabase } from '../database/database';
import { testSQLite } from '../database/test';

export default function TestSQLiteScreen() {
  const [testResult, setTestResult] = useState<string>('Testando...');
  const [dbResult, setDbResult] = useState<string>('Testando banco...');

  useEffect(() => {
    testarSQLite();
    testarBanco();
  }, []);

  const testarSQLite = async () => {
    try {
      const result = await testSQLite();
      setTestResult(result ? 'SQLite funcionando!' : 'SQLite com erro');
    } catch (error) {
      setTestResult(`Erro: ${String(error)}`);
    }
  };

  const testarBanco = async () => {
    try {
      const result = await initDatabase();
      setDbResult(result.success ? 'Banco OK!' : `Erro: ${result.message}`);
    } catch (error) {
      setDbResult(`Erro: ${error}`);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Teste SQLite</ThemedText>
      
      <View style={styles.testSection}>
        <ThemedText style={styles.label}>Teste SQLite:</ThemedText>
        <ThemedText style={styles.result}>{testResult}</ThemedText>
      </View>

      <View style={styles.testSection}>
        <ThemedText style={styles.label}>Teste Banco:</ThemedText>
        <ThemedText style={styles.result}>{dbResult}</ThemedText>
      </View>

      <TouchableOpacity style={styles.button} onPress={testarSQLite}>
        <ThemedText style={styles.buttonText}>Testar SQLite</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={testarBanco}>
        <ThemedText style={styles.buttonText}>Testar Banco</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: Colors.light.text,
  },
  testSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.light.text,
  },
  result: {
    fontSize: 14,
    color: Colors.light.text,
    padding: 10,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
}); 