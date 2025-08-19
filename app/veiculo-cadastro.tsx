import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import React, { useState, useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Colors } from '../constants/Colors';
import { useVeiculos } from '../hooks/useVeiculos';
import { Veiculo, VeiculoForm } from '../types/veiculo';

export default function VeiculoCadastro() {
  const { veiculoId } = useLocalSearchParams();
  const isEditing = !!veiculoId;
  const { criarVeiculo, atualizarVeiculo, buscarVeiculoPorId, loading, error } = useVeiculos();

  const [form, setForm] = useState<VeiculoForm>({
    nome: '',
    capacidadeTanque: '',
    consumoManualGasolina: '',
    consumoManualEtanol: '',
    tipoPonteiro: 'Analógico',
    salvarLocalizacao: false,
    lembreteCalibragem: false,
    frequenciaLembrete: '30',
    dataUltimaCalibragem: new Date().toISOString().split('T')[0], // Initialize with current date
  });

  const [currentVeiculo, setCurrentVeiculo] = useState<Veiculo | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchVeiculo = async () => {
        if (isEditing && typeof veiculoId === 'string') {
          const id = parseInt(veiculoId);
          const veiculo = await buscarVeiculoPorId(id);
          if (veiculo) {
            setCurrentVeiculo(veiculo);
            setForm({
              nome: veiculo.nome,
              capacidadeTanque: veiculo.capacidadeTanque.toString(),
              consumoManualGasolina: veiculo.consumoManualGasolina.toString(),
              consumoManualEtanol: veiculo.consumoManualEtanol.toString(),
              tipoPonteiro: veiculo.tipoPonteiro,
              salvarLocalizacao: veiculo.salvarLocalizacao,
              lembreteCalibragem: veiculo.lembreteCalibragem,
              frequenciaLembrete: veiculo.frequenciaLembrete.toString(),
            });
          } else {
            Alert.alert('Erro', 'Veículo não encontrado.');
            router.back();
          }
        }
      };
      fetchVeiculo();
    }, [isEditing, veiculoId, buscarVeiculoPorId])
  );

  const handleInputChange = (field: keyof VeiculoForm, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validarFormulario = (): boolean => {
    if (!form.nome.trim()) {
      Alert.alert('Erro', 'Por favor, informe o nome do veículo');
      return false;
    }
    if (!form.capacidadeTanque || parseFloat(form.capacidadeTanque) <= 0) {
      Alert.alert('Erro', 'Por favor, informe a capacidade do tanque');
      return false;
    }
    if (!form.consumoManualGasolina || parseFloat(form.consumoManualGasolina) <= 0) {
      Alert.alert('Erro', 'Por favor, informe o consumo de gasolina');
      return false;
    }
    if (!form.consumoManualEtanol || parseFloat(form.consumoManualEtanol) <= 0) {
      Alert.alert('Erro', 'Por favor, informe o consumo de etanol');
      return false;
    }
    return true;
  };

  const handleSalvar = async () => {
    if (validarFormulario()) {
      let sucesso = false;
      if (isEditing && currentVeiculo) {
        sucesso = await atualizarVeiculo(currentVeiculo.id, form);
      } else {
        sucesso = await criarVeiculo(form);
      }

      if (sucesso) {
        Alert.alert(
          'Sucesso!',
          isEditing ? 'Veículo atualizado com sucesso!' : 'Veículo cadastrado com sucesso!',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('Erro', error || (isEditing ? 'Erro ao atualizar veículo' : 'Erro ao cadastrar veículo'));
      }
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>{isEditing ? 'Editar Veículo' : 'Cadastrar Veículo'}</ThemedText>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Nome do Veículo */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Nome do Veículo *</ThemedText>
          <TextInput
            style={styles.input}
            value={form.nome}
            onChangeText={(value) => handleInputChange('nome', value)}
            placeholder="Ex: Gol Bolinha, Civic, etc."
            placeholderTextColor={Colors.light.text}
          />
        </View>

        {/* Capacidade do Tanque */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Capacidade do Tanque (L) *</ThemedText>
          <TextInput
            style={styles.input}
            value={form.capacidadeTanque}
            onChangeText={(value) => handleInputChange('capacidadeTanque', value)}
            placeholder="Ex: 50"
            keyboardType="numeric"
            placeholderTextColor={Colors.light.text}
          />
        </View>

        {/* Consumo Gasolina */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Consumo Gasolina (km/L) *</ThemedText>
          <TextInput
            style={styles.input}
            value={form.consumoManualGasolina}
            onChangeText={(value) => handleInputChange('consumoManualGasolina', value)}
            placeholder="Ex: 12.5"
            keyboardType="numeric"
            placeholderTextColor={Colors.light.text}
          />
        </View>

        {/* Consumo Etanol */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Consumo Etanol (km/L) *</ThemedText>
          <TextInput
            style={styles.input}
            value={form.consumoManualEtanol}
            onChangeText={(value) => handleInputChange('consumoManualEtanol', value)}
            placeholder="Ex: 8.5"
            keyboardType="numeric"
            placeholderTextColor={Colors.light.text}
          />
        </View>

        {/* Tipo de Ponteiro */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Tipo de Ponteiro</ThemedText>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                form.tipoPonteiro === 'Analógico' && styles.radioButtonSelected
              ]}
              onPress={() => handleInputChange('tipoPonteiro', 'Analógico')}
            >
              <ThemedText style={[
                styles.radioText,
                form.tipoPonteiro === 'Analógico' && styles.radioTextSelected
              ]}>
                Analógico
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                form.tipoPonteiro === 'Digital' && styles.radioButtonSelected
              ]}
              onPress={() => handleInputChange('tipoPonteiro', 'Digital')}
            >
              <ThemedText style={[
                styles.radioText,
                form.tipoPonteiro === 'Digital' && styles.radioTextSelected
              ]}>
                Digital
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Salvar Localização */}
        <View style={styles.switchGroup}>
          <ThemedText style={styles.label}>Salvar Localização dos Abastecimentos</ThemedText>
          <Switch
            value={form.salvarLocalizacao}
            onValueChange={(value) => handleInputChange('salvarLocalizacao', value)}
            trackColor={{ false: Colors.light.tint, true: Colors.light.tint }}
            thumbColor={form.salvarLocalizacao ? Colors.light.background : Colors.light.text}
          />
        </View>

        {/* Lembrete de Calibragem */}
        <View style={styles.switchGroup}>
          <ThemedText style={styles.label}>Lembrete de Calibragem de Pneus</ThemedText>
          <Switch
            value={form.lembreteCalibragem}
            onValueChange={(value) => handleInputChange('lembreteCalibragem', value)}
            trackColor={{ false: Colors.light.tint, true: Colors.light.tint }}
            thumbColor={form.lembreteCalibragem ? Colors.light.background : Colors.light.text}
          />
        </View>

        {/* Frequência do Lembrete */}
        {form.lembreteCalibragem && (
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Frequência do Lembrete (dias)</ThemedText>
            <TextInput
              style={styles.input}
              value={form.frequenciaLembrete}
              onChangeText={(value) => handleInputChange('frequenciaLembrete', value)}
              placeholder="Ex: 30"
              keyboardType="numeric"
              placeholderTextColor={Colors.light.text}
            />
          </View>
        )}

        {/* Botões */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()} disabled={loading}>
            <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
            onPress={handleSalvar}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.light.background} size="small" />
            ) : (
              <ThemedText style={styles.saveButtonText}>Salvar Veículo</ThemedText>
            )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.tint,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 30,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.tint,
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.light.tint,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  cancelButtonText: {
    color: Colors.light.tint,
    fontSize: 18,
    fontWeight: '600',
  },
  saveButtonText: {
    color: Colors.light.background,
    fontSize: 18,
    fontWeight: '600',
  },
}); 