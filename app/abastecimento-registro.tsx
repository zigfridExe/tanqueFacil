import * as Location from 'expo-location';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Colors } from '../constants/Colors';
import { useAbastecimentos } from '../hooks/useAbastecimentos';
import { useVeiculos } from '../hooks/useVeiculos';
import { AbastecimentoForm } from '../services/abastecimentoService';
import { veiculoService } from '../services/veiculoService';

import { formatDate, formatDateToISO, formatNumberInput, parseNumberInput } from '../src/utils/format';
import { Veiculo } from '../types/veiculo';


export default function AbastecimentoRegistro() {
  const params = useLocalSearchParams();
  const carroId = params.carroId ? parseInt(params.carroId as string) : 0;
  const { criarAbastecimento, loading, error } = useAbastecimentos();
  const { buscarVeiculoPorId, veiculos, loading: loadingVeiculos } = useVeiculos();

  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  
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

  const [dataExibicao, setDataExibicao] = useState(formatDate(form.data));
  const [litrosExibicao, setLitrosExibicao] = useState('');
  const [precoPorLitroExibicao, setPrecoPorLitroExibicao] = useState('');
  const [valorPagoExibicao, setValorPagoExibicao] = useState('');
  const [quilometragemExibicao, setQuilometragemExibicao] = useState('');


  // Sempre recarrega o veículo ao focar na tela
  useFocusEffect(
    useCallback(() => {
      if (carroId) {
        setForm(prev => ({ ...prev, carroId }));
        const fetchVeiculo = async () => {
          const veiculoEncontrado = await buscarVeiculoPorId(carroId);
          setVeiculo(veiculoEncontrado || null);
        };
        fetchVeiculo();
      }
    }, [carroId, buscarVeiculoPorId])
  );

  const handleDateChange = (text: string) => {
    const formatted = text.replace(/[^0-9]/g, '').slice(0, 8);
    let final = formatted;
    if (formatted.length > 2) {
      final = `${formatted.slice(0, 2)}/${formatted.slice(2)}`;
    }
    if (formatted.length > 4) {
      final = `${formatted.slice(0, 2)}/${formatted.slice(2, 4)}/${formatted.slice(4)}`;
    }
    setDataExibicao(final);

    if (final.length === 10) {
      setForm(prev => ({ ...prev, data: formatDateToISO(final) }));
    }
  };

  const handleNumericChange = (
    field: 'litros' | 'precoPorLitro' | 'valorPago' | 'quilometragem',
    setterExibicao: React.Dispatch<React.SetStateAction<string>>
  ) => (text: string) => {
    const formatted = formatNumberInput(text);
    setterExibicao(formatted);
    setForm(prev => ({ ...prev, [field]: parseNumberInput(formatted) }));
  };

  const calcularPrecoPorLitro = () => {
    if (form.litros > 0 && form.valorPago > 0) {
      const preco = form.valorPago / form.litros;
      setForm(prev => ({ ...prev, precoPorLitro: preco }));
      setPrecoPorLitroExibicao(preco.toFixed(3).replace('.', ','));
    }
  };

  const calcularValorTotal = () => {
    if (form.litros > 0 && form.precoPorLitro > 0) {
      const valor = form.litros * form.precoPorLitro;
      setForm(prev => ({ ...prev, valorPago: valor }));
      setValorPagoExibicao(valor.toFixed(2).replace('.', ','));
    }
  };

  const validarFormulario = (): boolean => {
    if (!form.data.trim() || dataExibicao.length !== 10) {
      Alert.alert('Erro', 'Por favor, informe uma data válida (DD/MM/AAAA)');
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

  const showCalibrationModal = () => {
    if (validarFormulario()) {
      if (veiculo?.lembreteCalibragem) {
        setModalVisible(true);
      } else {
        proceedToSave(false);
      }
    }
  };

  const proceedToSave = async (calibragemRealizada: boolean) => {
    setModalVisible(false);
    try {
      let finalForm = { 
        ...form,
        calibragemPneus: calibragemRealizada,
      };

      if (veiculo?.salvarLocalizacao) {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão Negada', 'Não foi possível obter a localização.');
        } else {
          const location = await Location.getCurrentPositionAsync({});
          finalForm = {
            ...finalForm,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
        }
      }

      const sucesso = await criarAbastecimento(finalForm);
      
      if (sucesso) {
        if (calibragemRealizada && veiculo && veiculo.id) {
          await veiculoService.atualizarDataUltimaCalibragem(veiculo.id, new Date().toISOString());
        }
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
  };


  if (loadingVeiculos) {
    return (
      <ThemedView style={[styles.container, styles.emptyState]}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </ThemedView>
    );
  }

  if (veiculos.length === 0) {
    return (
      <ThemedView style={[styles.container, styles.emptyState]}>
        <ThemedText style={styles.emptyStateText}>
          Você precisa ter um veículo cadastrado para registrar um abastecimento.
        </ThemedText>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/veiculo-cadastro')}>
          <ThemedText style={styles.buttonText}>Cadastrar Veículo</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // Adjust as needed
      >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Data do Abastecimento */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Data do Abastecimento *</ThemedText>
          <TextInput
            style={styles.input}
            value={dataExibicao}
            onChangeText={handleDateChange}
            placeholder="DD/MM/AAAA"
            keyboardType="numeric"
            maxLength={10}
            placeholderTextColor={Colors.light.text}
          />
        </View>

        {/* Quilometragem */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Quilometragem Atual (km) *</ThemedText>
          <TextInput
            style={styles.input}
            value={quilometragemExibicao}
            onChangeText={handleNumericChange('quilometragem', setQuilometragemExibicao)}
            placeholder="Ex: 45000"
            keyboardType="numeric"
            placeholderTextColor={Colors.light.text}
          />
          {/* Indicador de status do GPS */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <View
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: veiculo?.salvarLocalizacao ? '#2ecc40' : '#ff4136',
                marginRight: 8,
                borderWidth: 1,
                borderColor: '#888',
              }}
            />
            <ThemedText style={{ color: Colors.light.text, fontSize: 15 }}>
              Registrar GPS
            </ThemedText>
          </View>
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
              onPress={() => setForm(prev => ({ ...prev, tipoCombustivel: 'Gasolina' }))}
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
              onPress={() => setForm(prev => ({ ...prev, tipoCombustivel: 'Etanol' }))}
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
              onPress={() => setForm(prev => ({ ...prev, tipoTrajeto: 'Cidade' }))}
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
              onPress={() => setForm(prev => ({ ...prev, tipoTrajeto: 'Estrada' }))}
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
              onPress={() => setForm(prev => ({ ...prev, tipoTrajeto: 'Misto' }))}
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

        {/* Comparador de Combustível */}
        <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Não sabe qual combustível usar?</ThemedText>
            <TouchableOpacity style={styles.comparadorButton} onPress={() => router.push('/combustivel-comparador')}>
                <ThemedText style={styles.comparadorButtonText}>⚖️ Comparar Gasolina vs. Etanol</ThemedText>
            </TouchableOpacity>
        </View>

        {/* Quantidade de Litros */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Quantidade de Litros *</ThemedText>
          <TextInput
            style={styles.input}
            value={litrosExibicao}
            onChangeText={handleNumericChange('litros', setLitrosExibicao)}
            placeholder="Ex: 45,5"
            keyboardType="decimal-pad"
            placeholderTextColor={Colors.light.text}
            onBlur={calcularPrecoPorLitro}
          />
        </View>

        {/* Preço por Litro */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Preço por Litro (R$) *</ThemedText>
          <TextInput
            style={styles.input}
            value={precoPorLitroExibicao}
            onChangeText={handleNumericChange('precoPorLitro', setPrecoPorLitroExibicao)}
            placeholder="Ex: 5,89"
            keyboardType="decimal-pad"
            placeholderTextColor={Colors.light.text}
            onBlur={calcularValorTotal}
          />
        </View>

        {/* Valor Total */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Valor Total Pago (R$) *</ThemedText>
          <TextInput
            style={styles.input}
            value={valorPagoExibicao}
            onChangeText={handleNumericChange('valorPago', setValorPagoExibicao)}
            placeholder="Ex: 268,00"
            keyboardType="decimal-pad"
            placeholderTextColor={Colors.light.text}
            onBlur={calcularPrecoPorLitro}
          />
        </View>

        {/* Botões */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()} disabled={loading}>
            <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
            onPress={showCalibrationModal}
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
      </KeyboardAvoidingView>
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Calibragem dos Pneus</ThemedText>
            <ThemedText style={styles.modalMessage}>
              Você aproveitou a parada para calibrar os pneus?
            </ThemedText>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => proceedToSave(false)}
              >
                <ThemedText style={styles.modalButtonTextSecondary}>Deixar para depois</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={() => proceedToSave(true)}
              >
                <ThemedText style={styles.modalButtonTextPrimary}>Sim, calibrei!</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  comparadorButton: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.tint,
  },
  comparadorButtonText: {
    color: Colors.light.tint,
    fontSize: 16,
    fontWeight: '600',
  },
  // Estilos do Modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: Colors.light.background,
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonPrimary: {
    backgroundColor: Colors.light.tint,
  },
  modalButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.tint,
  },
  modalButtonTextPrimary: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonTextSecondary: {
    color: Colors.light.tint,
    fontSize: 16,
    fontWeight: 'bold',
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
});
