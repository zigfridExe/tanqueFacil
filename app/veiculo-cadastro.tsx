import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
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
    quilometragem: '',
  });

  const [currentVeiculo, setCurrentVeiculo] = useState<Veiculo | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      
      const fetchVeiculo = async () => {
        if (isEditing && typeof veiculoId === 'string') {
          const id = parseInt(veiculoId, 10);
          if (!isNaN(id)) {
            try {
              const veiculo = await buscarVeiculoPorId(id);
              if (isActive && veiculo) {
                setCurrentVeiculo(veiculo);
                setForm({
                  nome: veiculo.nome,
                  capacidadeTanque: veiculo.capacidadeTanque.toString(),
                  quilometragem: veiculo.quilometragem.toString(),
                });
              } else if (isActive) {
                Alert.alert('Erro', 'Veículo não encontrado.');
                router.back();
              }
            } catch (err) {
              if (isActive) {
                Alert.alert('Erro', 'Não foi possível carregar os dados do veículo.');
                router.back();
              }
            }
          }
        }
      };
      
      fetchVeiculo();
      
      return () => {
        isActive = false;
      };
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
    if (!form.capacidadeTanque || parseFloat(form.capacidadeTanque.replace(',', '.')) <= 0) {
      Alert.alert('Erro', 'Por favor, informe a capacidade do tanque');
      return false;
    }
    if (!form.quilometragem || parseFloat(form.quilometragem.replace(',', '.')) <= 0) {
      Alert.alert('Erro', 'Por favor, informe a quilometragem atual do veículo');
      return false;
    }
    return true;
  };

  const handleSalvar = async () => {
    if (!validarFormulario()) return;

    const dadosParaSalvar: VeiculoForm = {
      nome: form.nome,
      capacidadeTanque: form.capacidadeTanque.replace(',', '.'),
      quilometragem: form.quilometragem.replace(',', '.'),
    };

    let sucesso = false;
    if (isEditing && currentVeiculo && currentVeiculo.id !== undefined) {
      sucesso = await atualizarVeiculo(currentVeiculo.id, dadosParaSalvar);
    } else {
      sucesso = await criarVeiculo(dadosParaSalvar);
    }

    if (sucesso) {
      // Força um refresh na tela anterior
      router.replace({
        pathname: '/(tabs)/veiculos',
        params: { refresh: Date.now() }
      });
    } else {
      Alert.alert('Erro', error || (isEditing ? 'Erro ao atualizar veículo' : 'Erro ao cadastrar veículo'));
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

        {/* Quilometragem Atual */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Quilometragem Atual (km) *</ThemedText>
          <TextInput
            style={styles.input}
            value={form.quilometragem}
            onChangeText={(value) => handleInputChange('quilometragem', value)}
            placeholder="Ex: 25000"
            keyboardType="numeric"
            placeholderTextColor={Colors.light.text}
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