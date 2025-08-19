import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import * as database from '@/database/database'; // Importa o módulo do banco de dados
import { useVeiculos } from '@/hooks/useVeiculos'; // Importa o hook useVeiculos
import { router } from 'expo-router'; // Importa o router para navegação
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, TextInput, TouchableOpacity, View } from 'react-native';

export default function ConfiguracoesScreen() {
  const { veiculos } = useVeiculos(); // Obtém os veículos cadastrados
  const veiculoAtual = veiculos.length > 0 ? veiculos[0] : null; // Pega o primeiro veículo como o atual

  // Estados para as novas configurações
  const [consumoType, setConsumoType] = useState<'aprendido' | 'manual'>(veiculoAtual?.consumoManualGasolina ? 'manual' : 'aprendido'); // Inicializa com 'manual' se houver consumo manual, senão 'aprendido'
  const [pointerType, setPointerType] = useState<'analogico' | 'digital'>(veiculoAtual?.tipoPonteiro === 'Digital' ? 'digital' : 'analogico'); // Inicializa com base no tipoPonteiro do veículo
  const [salvarLocalizacao, setSalvarLocalizacao] = useState<boolean>(veiculoAtual?.salvarLocalizacao || false); // Inicializa com base no salvarLocalizacao do veículo
  const [lembreteCalibragem, setLembreteCalibragem] = useState<boolean>(veiculoAtual?.lembreteCalibragem || false); // Inicializa com base no lembreteCalibragem do veículo
  const [frequenciaLembrete, setFrequenciaLembrete] = useState<string>(veiculoAtual?.frequenciaLembrete?.toString() || '30'); // Inicializa com base na frequenciaLembrete do veículo

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

  const handleEditVehicle = () => {
    router.push('/veiculo-cadastro'); // Navega para a tela de cadastro/edição de veículo
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Ajustes e Personalização</ThemedText>
        </View>

        {/* Seção Dados do Veículo */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Dados do Veículo</ThemedText>
          {veiculoAtual ? (
            <View>
              <View style={styles.aboutItem}>
                <ThemedText style={styles.aboutLabel}>Veículo Atual:</ThemedText>
                <ThemedText style={styles.aboutValue}>{veiculoAtual.nome}</ThemedText>
              </View>
              <View style={styles.aboutItem}>
                <ThemedText style={styles.aboutLabel}>Capacidade do Tanque:</ThemedText>
                <ThemedText style={styles.aboutValue}>{veiculoAtual.capacidadeTanque} Litros</ThemedText>
              </View>
              <TouchableOpacity style={styles.optionButton} onPress={handleEditVehicle}>
                <ThemedText style={styles.optionButtonText}>EDITAR DADOS DO CARRO</ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <ThemedText style={styles.aboutLabel}>Nenhum veículo cadastrado.</ThemedText>
          )}
        </View>

        {/* Seção Consumo de Combustível */}
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
                {consumoType === 'manual' && veiculoAtual && ` (${veiculoAtual.consumoManualGasolina} km/L)`}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Seção Preferências de Exibição */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Preferências de Exibição</ThemedText>
          <ThemedText style={styles.label}>Tipo de Ponteiro de Combustível</ThemedText>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                pointerType === 'analogico' && styles.radioButtonSelected
              ]}
              onPress={() => setPointerType('analogico')}
            >
              <ThemedText style={[
                styles.radioText,
                pointerType === 'analogico' && styles.radioTextSelected
              ]}>
                Analógico (Ponteiro)
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                pointerType === 'digital' && styles.radioButtonSelected
              ]}
              onPress={() => setPointerType('digital')}
            >
              <ThemedText style={[
                styles.radioText,
                pointerType === 'digital' && styles.radioTextSelected
              ]}>
                Digital (Barra)
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Seção Funcionalidades Adicionais */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Funcionalidades Adicionais</ThemedText>
          <View style={styles.switchGroup}>
            <ThemedText style={styles.label}>Salvar Local do Abastecimento (GPS)</ThemedText>
            <Switch
              // TODO: Adicionar estado para salvarLocalizacao
              // value={salvarLocalizacao}
              // onValueChange={(value) => setSalvarLocalizacao(value)}
              trackColor={{ false: Colors.light.tint, true: Colors.light.tint }}
              // thumbColor={salvarLocalizacao ? Colors.light.background : Colors.light.text}
            />
          </View>

          <View style={styles.switchGroup}>
            <ThemedText style={styles.label}>Lembrete de Calibragem de Pneus</ThemedText>
            <Switch
              // TODO: Adicionar estado para lembreteCalibragem
              // value={lembreteCalibragem}
              // onValueChange={(value) => setLembreteCalibragem(value)}
              trackColor={{ false: Colors.light.tint, true: Colors.light.tint }}
              // thumbColor={lembreteCalibragem ? Colors.light.background : Colors.light.text}
            />
          </View>

          {/* TODO: Renderizar condicionalmente */}
          {/* {lembreteCalibragem && ( */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Lembrete a cada (dias)</ThemedText>
              <TextInput
                style={styles.input}
                // TODO: Adicionar estado para frequenciaLembrete
                // value={frequenciaLembrete}
                // onChangeText={(value) => setFrequenciaLembrete(value)}
                placeholder="30"
                keyboardType="numeric"
                placeholderTextColor={Colors.light.text}
              />
            </View>
          {/* )} */}
        </View>

        {/* Seção Opções de Dados */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Opções de Dados</ThemedText>
          <TouchableOpacity style={styles.optionButton} onPress={() => Alert.alert('Funcionalidade em desenvolvimento', 'A exportação de histórico será implementada em breve.')}>
            <ThemedText style={styles.optionButtonText}>EXPORTAR MEU HISTÓRICO</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optionButton, { marginTop: 10 }]} onPress={handleResetData}>
            <ThemedText style={styles.optionButtonText}>LIMPAR TODOS OS DADOS</ThemedText>
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
});