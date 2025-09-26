import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Colors } from '../constants/Colors';
import { useVeiculos } from '../hooks/useVeiculos';


export default function ComparadorCombustivelScreen() {
  const { veiculos, loading: loadingVeiculos } = useVeiculos();
  const [precoGasolina, setPrecoGasolina] = useState<string>('');
  const [precoEtanol, setPrecoEtanol] = useState<string>('');
  const [resultado, setResultado] = useState<string | null>(null);

  // Por simplicidade, usa o primeiro veículo da lista.
  const veiculoPrincipal = veiculos.length > 0 ? veiculos[0] : null;

  const calcularMelhorOpcao = () => {
    const pGasolina = parseFloat(precoGasolina.replace(',', '.'));
    const pEtanol = parseFloat(precoEtanol.replace(',', '.'));

    if (!veiculoPrincipal) {
      Alert.alert('Erro', 'Nenhum veículo cadastrado para realizar a comparação.');
      return;
    }

    if (isNaN(pGasolina) || pGasolina <= 0 || isNaN(pEtanol) || pEtanol <= 0) {
      Alert.alert('Erro', 'Por favor, insira valores válidos para os preços.');
      return;
    }

    const consumoGasolina = veiculoPrincipal.consumoManualGasolina;
    const consumoEtanol = veiculoPrincipal.consumoManualEtanol;

    if (!consumoGasolina || !consumoEtanol || consumoGasolina <= 0 || consumoEtanol <= 0) {
        Alert.alert('Erro', 'Os dados de consumo do veículo não são válidos.');
        return;
    }

    const relacaoConsumo = consumoEtanol / consumoGasolina;
    const relacaoPreco = pEtanol / pGasolina;

    if (relacaoPreco < relacaoConsumo) {
      setResultado(`Etanol é a melhor opção!\nRelação de preço: ${relacaoPreco.toFixed(2)}\nRelação de consumo: ${relacaoConsumo.toFixed(2)}`);
    } else {
      setResultado(`Gasolina é a melhor opção!\nRelação de preço: ${relacaoPreco.toFixed(2)}\nRelação de consumo: ${relacaoConsumo.toFixed(2)}`);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedText style={styles.headerTitle}>Comparador de Combustível</ThemedText>

        {loadingVeiculos ? (
            <ActivityIndicator size="large" color={Colors.light.tint} />
        ) : !veiculoPrincipal ? (
            <View style={styles.emptyState}>
                <ThemedText style={styles.emptyStateText}>Você precisa ter um veículo cadastrado.</ThemedText>
                <TouchableOpacity style={styles.button} onPress={() => router.push('/veiculo-cadastro')}>
                    <ThemedText style={styles.buttonText}>Cadastrar Veículo</ThemedText>
                </TouchableOpacity>
            </View>
        ) : (
          <>
            <ThemedText style={styles.veiculoInfo}>Comparando para o veículo: {veiculoPrincipal.nome}</ThemedText>
            
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Preço da Gasolina (R$)</ThemedText>
              <TextInput
                style={styles.input}
                value={precoGasolina}
                onChangeText={setPrecoGasolina}
                placeholder="Ex: 5.89"
                keyboardType="numeric"
                placeholderTextColor={Colors.light.text}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Preço do Etanol (R$)</ThemedText>
              <TextInput
                style={styles.input}
                value={precoEtanol}
                onChangeText={setPrecoEtanol}
                placeholder="Ex: 3.89"
                keyboardType="numeric"
                placeholderTextColor={Colors.light.text}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={calcularMelhorOpcao}>
              <ThemedText style={styles.buttonText}>Calcular</ThemedText>
            </TouchableOpacity>

            {resultado && (
              <View style={styles.resultadoContainer}>
                <ThemedText style={styles.resultadoTitle}>Resultado</ThemedText>
                <ThemedText style={styles.resultadoText}>{resultado}</ThemedText>
              </View>
            )}
          </>
        )}
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  veiculoInfo: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.light.text,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.tint,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: Colors.light.background,
    color: Colors.light.text,
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: Colors.light.background,
    fontSize: 18,
    fontWeight: '600',
  },
  resultadoContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.tint,
    alignItems: 'center',
  },
  resultadoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultadoText: {
    fontSize: 18,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});