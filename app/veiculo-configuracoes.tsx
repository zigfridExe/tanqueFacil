import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useVeiculos } from '@/hooks/useVeiculos';
import { veiculoService } from '@/services/veiculoService';
import { Veiculo, VeiculoForm } from '@/types/veiculo';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';

export default function VeiculoConfiguracoesScreen() {
  const { veiculoId } = useLocalSearchParams<{ veiculoId: string }>();
  const { veiculos, carregarVeiculos, loading } = useVeiculos();
  const [veiculoAtual, setVeiculoAtual] = useState<Veiculo | null>(null);

  const [nome, setNome] = useState<string>('');
  const [capacidadeTanque, setCapacidadeTanque] = useState<string>('');
  const [consumoManualGasolina, setConsumoManualGasolina] = useState<string>('');
  const [consumoManualEtanol, setConsumoManualEtanol] = useState<string>('');
  const [tipoPonteiro, setTipoPonteiro] = useState<'Analógico' | 'Digital'>('Analógico');

  const [consumoType, setConsumoType] = useState<'aprendido' | 'manual'>('aprendido');
  const [lembreteCalibragem, setLembreteCalibragem] = useState<boolean>(false);
  const [frequenciaLembrete, setFrequenciaLembrete] = useState<string>('30');
  const [exibirNoDashboard, setExibirNoDashboard] = useState<boolean>(true);

  useEffect(() => {
    if (veiculoId) {
      const id = parseInt(veiculoId, 10);
      const veiculo = veiculos.find(v => v.id === id) || null;
      setVeiculoAtual(veiculo);
    }
  }, [veiculoId, veiculos]);

  useFocusEffect(
    useCallback(() => {
      if (veiculoAtual) {
        setConsumoType(veiculoAtual.consumoManualGasolina ? 'manual' : 'aprendido');
        setLembreteCalibragem(veiculoAtual.lembreteCalibragem);
        setFrequenciaLembrete(veiculoAtual.frequenciaLembrete?.toString() || '30');
        setExibirNoDashboard(veiculoAtual.exibirNoDashboard);
        setNome(veiculoAtual.nome);
        setCapacidadeTanque(veiculoAtual.capacidadeTanque.toString());
        setConsumoManualGasolina(veiculoAtual.consumoManualGasolina?.toString() || '');
        setConsumoManualEtanol(veiculoAtual.consumoManualEtanol?.toString() || '');
        setTipoPonteiro(veiculoAtual.tipoPonteiro);
      }
    }, [veiculoAtual])
  );

  const handleSave = useCallback(async () => {
    if (!veiculoAtual) return;

    const veiculoForm: Veiculo = {
      ...veiculoAtual, // Keep existing properties
      nome: nome,
      capacidadeTanque: parseFloat(capacidadeTanque.replace(',', '.')),
      consumoManualGasolina: consumoType === 'manual' ? parseFloat(consumoManualGasolina.replace(',', '.')) : null,
      consumoManualEtanol: consumoType === 'manual' ? parseFloat(consumoManualEtanol.replace(',', '.')) : null,
      tipoPonteiro: tipoPonteiro,
      lembreteCalibragem: lembreteCalibragem,
      frequenciaLembrete: parseInt(frequenciaLembrete),
      exibirNoDashboard: exibirNoDashboard,
    };

    const result = await veiculoService.atualizar(veiculoAtual.id as number, veiculoForm);
    if (result.success) {
      carregarVeiculos();
      Alert.alert('Sucesso', 'Configurações salvas.');
      router.back();
    } else {
      Alert.alert('Erro', 'Não foi possível salvar as configurações.');
    }
  }, [veiculoAtual, nome, capacidadeTanque, consumoManualGasolina, consumoManualEtanol, tipoPonteiro, lembreteCalibragem, frequenciaLembrete, exibirNoDashboard, consumoType, carregarVeiculos]);

  const handleEditVehicle = () => {
    if (veiculoAtual) {
      router.push({ pathname: '/veiculo-cadastro', params: { veiculoId: veiculoAtual.id } });
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingState}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <ThemedText>Carregando...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Configurações do Veículo</ThemedText>
        </View>

        {veiculoAtual ? (
          <>
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Dados do Veículo</ThemedText>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Nome do Veículo</ThemedText>
                <TextInput
                  style={styles.input}
                  value={nome}
                  onChangeText={setNome}
                  placeholder="Nome do Veículo"
                  placeholderTextColor={Colors.light.text}
                />
              </View>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Capacidade do Tanque (L)</ThemedText>
                <TextInput
                  style={styles.input}
                  value={capacidadeTanque}
                  onChangeText={setCapacidadeTanque}
                  placeholder="Capacidade do Tanque"
                  keyboardType="numeric"
                  placeholderTextColor={Colors.light.text}
                />
              </View>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Tipo de Ponteiro</ThemedText>
                <View style={styles.radioGroup}>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      tipoPonteiro === 'Analógico' && styles.radioButtonSelected
                    ]}
                    onPress={() => setTipoPonteiro('Analógico')}
                  >
                    <ThemedText style={[
                      styles.radioText,
                      tipoPonteiro === 'Analógico' && styles.radioTextSelected
                    ]}>
                      Analógico
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      tipoPonteiro === 'Digital' && styles.radioButtonSelected
                    ]}
                    onPress={() => setTipoPonteiro('Digital')}
                  >
                    <ThemedText style={[
                      styles.radioText,
                      tipoPonteiro === 'Digital' && styles.radioTextSelected
                    ]}>
                      Digital
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Dashboard</ThemedText>
              <View style={styles.switchGroup}>
                <ThemedText style={styles.label}>Exibir no Dashboard</ThemedText>
                <Switch
                  value={exibirNoDashboard}
                  onValueChange={setExibirNoDashboard}
                  trackColor={{ false: Colors.light.tint, true: Colors.light.tint }}
                  thumbColor={exibirNoDashboard ? Colors.light.background : Colors.light.text}
                />
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Consumo de Combustível</ThemedText>
              <ThemedText style={styles.label}>Qual a sua forma de acompanhamento preferida?</ThemedText>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    consumoType === 'aprendido' && styles.radioButtonSelected
                  ]}
                  onPress={() => setConsumoType('aprendido')}
                >
                  <ThemedText style={[
                    styles.radioText,
                    consumoType === 'aprendido' && styles.radioTextSelected
                  ]}>
                    Consumo Aprendido
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    consumoType === 'manual' && styles.radioButtonSelected
                  ]}
                  onPress={() => setConsumoType('manual')}
                >
                  <ThemedText style={[
                    styles.radioText,
                    consumoType === 'manual' && styles.radioTextSelected
                  ]}>
                    Consumo Manual
                    {consumoType === 'manual' && ` (${veiculoAtual.consumoManualGasolina} km/L)`}
                  </ThemedText>
                </TouchableOpacity>
              </View>
              {consumoType === 'manual' && (
                <>
                  <View style={styles.inputGroup}>
                    <ThemedText style={styles.label}>Consumo Gasolina (km/L)</ThemedText>
                    <TextInput
                      style={styles.input}
                      value={consumoManualGasolina}
                      onChangeText={setConsumoManualGasolina}
                      placeholder="Ex: 12.5"
                      keyboardType="numeric"
                      placeholderTextColor={Colors.light.text}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <ThemedText style={styles.label}>Consumo Etanol (km/L)</ThemedText>
                    <TextInput
                      style={styles.input}
                      value={consumoManualEtanol}
                      onChangeText={setConsumoManualEtanol}
                      placeholder="Ex: 8.5"
                      keyboardType="numeric"
                      placeholderTextColor={Colors.light.text}
                    />
                  </View>
                </>
              )}
            </View>

            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Manutenção</ThemedText>
              <View style={styles.switchGroup}>
                <ThemedText style={styles.label}>Lembrete de Calibragem de Pneus</ThemedText>
                <Switch
                  value={lembreteCalibragem}
                  onValueChange={setLembreteCalibragem}
                  trackColor={{ false: Colors.light.tint, true: Colors.light.tint }}
                  thumbColor={lembreteCalibragem ? Colors.light.background : Colors.light.text}
                />
              </View>

              {lembreteCalibragem && (
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Lembrete a cada (dias)</ThemedText>
                  <TextInput
                    style={styles.input}
                    value={frequenciaLembrete}
                    onChangeText={setFrequenciaLembrete}
                    placeholder="30"
                    keyboardType="numeric"
                    placeholderTextColor={Colors.light.text}
                  />
                </View>
              )}
            </View>

            <View style={styles.section}>
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleSave}
              >
                <ThemedText style={styles.saveButtonText}>SALVAR ALTERAÇÕES</ThemedText>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <ThemedText>Veículo não encontrado.</ThemedText>
          </View>
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.light.text,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 15,
  },
  radioButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.tint,
    borderRadius: 8,
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: Colors.light.tint,
  },
  radioText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  radioTextSelected: {
    color: Colors.light.background,
    fontWeight: '600',
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
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
  saveButton: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  saveButtonText: {
    color: Colors.light.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});