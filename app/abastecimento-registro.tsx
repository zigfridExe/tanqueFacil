import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import { useAbastecimentos } from '../hooks/useAbastecimentos';
import { AbastecimentoForm } from '../services/abastecimentoService';

export default function AbastecimentoRegistro() {
  const params = useLocalSearchParams();
  const carroId = params.carroId ? parseInt(params.carroId as string) : 0;
  const { criarAbastecimento, loading, error } = useAbastecimentos();
  
  const [form, setForm] = useState<AbastecimentoForm>({
    data: new Date().toISOString().split('T')[0], // Data atual
    quilometragem: 0,
    litros: 0,
    valorPago: 0,
    precoPorLitro: 0,
    tipoCombustivel: 'Gasolina',
    tipoTrajeto: 'Cidade',
    calibragemPneus: false,
    carroId: carroId,
  });

  useEffect(() => {
    if (carroId) {
      setForm(prev => ({ ...prev, carroId }));
    }
  }, [carroId]);

  const handleInputChange = (field: keyof AbastecimentoForm, value: string | boolean | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const calcularPrecoPorLitro = () => {
    if (form.litros > 0 && form.valorPago > 0) {
      const precoPorLitro = form.valorPago / form.litros;
      setForm(prev => ({ ...prev, precoPorLitro: Math.round(precoPorLitro * 1000) / 1000 }));
    }
  };

  const calcularValorTotal = () => {
    if (form.litros > 0 && form.precoPorLitro > 0) {
      const valorTotal = form.litros * form.precoPorLitro;
      setForm(prev => ({ ...prev, valorPago: Math.round(valorTotal * 100) / 100 }));
    }
  };

  const validarFormulario = (): boolean => {
    if (!form.data.trim()) {
      Alert.alert('Erro', 'Por favor, informe a data do abastecimento');
      return false;
    }
    if (form.quilometragem <= 0) {
      Alert.alert('Erro', 'Por favor, informe a quilometragem atual');
      return false;
    }
    if (form.litros <= 0) {
      Alert.alert('Erro', 'Por favor, informe a quantidade de litros');
      return false;
    }
    if (form.valorPago <= 0) {
      Alert.alert('Erro', 'Por favor, informe o valor pago');
      return false;
    }
    if (form.precoPorLitro <= 0) {
      Alert.alert('Erro', 'Por favor, informe o preço por litro');
      return false;
    }
    return true;
  };

  const handleSalvar = async () => {
    if (validarFormulario()) {
      try {
        const sucesso = await criarAbastecimento(form);
        if (sucesso) {
          Alert.alert(
            'Sucesso!',
            'Abastecimento registrado com sucesso!',
            [{ text: 'OK', onPress: () => router.back() }]
          );
        } else {
          Alert.alert('Erro', error || 'Erro ao registrar abastecimento');
        }
      } catch {
        Alert.alert('Erro', 'Erro inesperado ao registrar abastecimento');
      }
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Novo Abastecimento</ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Data do Abastecimento */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Data do Abastecimento *</ThemedText>
          <TextInput
            style={styles.input}
            value={form.data}
            onChangeText={(value) => handleInputChange('data', value)}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={Colors.light.text}
          />
        </View>

        {/* Quilometragem */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Quilometragem Atual (km) *</ThemedText>
          <TextInput
            style={styles.input}
            value={form.quilometragem.toString()}
            onChangeText={(value) => handleInputChange('quilometragem', parseFloat(value) || 0)}
            placeholder="Ex: 45000"
            keyboardType="numeric"
            placeholderTextColor={Colors.light.text}
          />
        </View>

        {/* Tipo de Combustível */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Tipo de Combustível</ThemedText>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                form.tipoCombustivel === 'Gasolina' && styles.radioButtonSelected
              ]}
              onPress={() => handleInputChange('tipoCombustivel', 'Gasolina')}
            >
              <ThemedText style={[
                styles.radioText,
                form.tipoCombustivel === 'Gasolina' && styles.radioTextSelected
              ]}>
                Gasolina
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                form.tipoCombustivel === 'Etanol' && styles.radioButtonSelected
              ]}
              onPress={() => handleInputChange('tipoCombustivel', 'Etanol')}
            >
              <ThemedText style={[
                styles.radioText,
                form.tipoCombustivel === 'Etanol' && styles.radioTextSelected
              ]}>
                Etanol
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tipo de Trajeto */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Tipo de Trajeto</ThemedText>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                form.tipoTrajeto === 'Cidade' && styles.radioButtonSelected
              ]}
              onPress={() => handleInputChange('tipoTrajeto', 'Cidade')}
            >
              <ThemedText style={[
                styles.radioText,
                form.tipoTrajeto === 'Cidade' && styles.radioTextSelected
              ]}>
                Cidade
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                form.tipoTrajeto === 'Estrada' && styles.radioButtonSelected
              ]}
              onPress={() => handleInputChange('tipoTrajeto', 'Estrada')}
            >
              <ThemedText style={[
                styles.radioText,
                form.tipoTrajeto === 'Estrada' && styles.radioTextSelected
              ]}>
                Estrada
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                form.tipoTrajeto === 'Misto' && styles.radioButtonSelected
              ]}
              onPress={() => handleInputChange('tipoTrajeto', 'Misto')}
            >
              <ThemedText style={[
                styles.radioText,
                form.tipoTrajeto === 'Misto' && styles.radioTextSelected
              ]}>
                Misto
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quantidade de Litros */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Quantidade de Litros *</ThemedText>
          <TextInput
            style={styles.input}
            value={form.litros.toString()}
            onChangeText={(value) => handleInputChange('litros', parseFloat(value) || 0)}
            placeholder="Ex: 45.5"
            keyboardType="numeric"
            placeholderTextColor={Colors.light.text}
            onBlur={calcularPrecoPorLitro}
          />
        </View>

        {/* Preço por Litro */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Preço por Litro (R$) *</ThemedText>
          <TextInput
            style={styles.input}
            value={form.precoPorLitro.toString()}
            onChangeText={(value) => handleInputChange('precoPorLitro', parseFloat(value) || 0)}
            placeholder="Ex: 5.89"
            keyboardType="numeric"
            placeholderTextColor={Colors.light.text}
            onBlur={calcularValorTotal}
          />
        </View>

        {/* Valor Total */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Valor Total Pago (R$) *</ThemedText>
          <TextInput
            style={styles.input}
            value={form.valorPago.toString()}
            onChangeText={(value) => handleInputChange('valorPago', parseFloat(value) || 0)}
            placeholder="Ex: 268.00"
            keyboardType="numeric"
            placeholderTextColor={Colors.light.text}
            onBlur={calcularPrecoPorLitro}
          />
        </View>

        {/* Calibragem de Pneus */}
        <View style={styles.switchGroup}>
          <ThemedText style={styles.label}>Calibragem de Pneus Realizada</ThemedText>
          <Switch
            value={form.calibragemPneus}
            onValueChange={(value) => handleInputChange('calibragemPneus', value)}
            trackColor={{ false: Colors.light.tint, true: Colors.light.tint }}
            thumbColor={form.calibragemPneus ? Colors.light.background : Colors.light.text}
          />
        </View>

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
              <ThemedText style={styles.saveButtonText}>Salvar Abastecimento</ThemedText>
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
    gap: 10,
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
