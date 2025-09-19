import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAbastecimentos } from '@/hooks/useAbastecimentos';
import { consumoKmPorLitro } from '@/src/utils/consumo';
import { formatBRL } from '@/src/utils/format';
import { Abastecimento } from '@/types/veiculo';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function QuickStats() {
  const { abastecimentos, carregarTodosAbastecimentos } = useAbastecimentos();
  const [stats, setStats] = useState({
    gastoTotal: 0,
    litrosTotal: 0,
    kmTotal: 0,
    consumoMedio: 0,
  });

  // Adiciona o useFocusEffect para recarregar os dados quando a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      carregarTodosAbastecimentos();
    }, [carregarTodosAbastecimentos])
  );

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyAbastecimentos = abastecimentos.filter(a => {
        // A data está como string no formato 'YYYY-MM-DD HH:MM:SS' ou 'DD/MM/YYYY'
        // Precisamos normalizar para um objeto Date
        const dateStr = a.data.split(' ')[0]; // Pega apenas a parte da data
        const dateParts = dateStr.includes('-') ? dateStr.split('-') : dateStr.split('/');
        
        const year = dateParts[0].length === 4 ? parseInt(dateParts[0], 10) : parseInt(dateParts[2], 10);
        const month = dateParts[0].length === 4 ? parseInt(dateParts[1], 10) - 1 : parseInt(dateParts[1], 10) - 1;
        const day = dateParts[0].length === 4 ? parseInt(dateParts[2], 10) : parseInt(dateParts[0], 10);
        
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
            return false;
        }

        const data = new Date(year, month, day);
        return data.getMonth() === currentMonth && data.getFullYear() === currentYear;
    });

    let gastoTotal = 0;
    let litrosTotal = 0;
    let kmTotal = 0;
    let consumoMedioCalculado = 0;

    if (monthlyAbastecimentos.length > 0) {
      gastoTotal = monthlyAbastecimentos.reduce((acc: number, a: Abastecimento) => acc + a.valorPago, 0);
      litrosTotal = monthlyAbastecimentos.reduce((acc: number, a: Abastecimento) => acc + a.litros, 0);

      const sortedMonthly = [...monthlyAbastecimentos].sort((a, b) => a.quilometragem - b.quilometragem);
      const firstOfMonth = sortedMonthly[0];
      const endKm = sortedMonthly[sortedMonthly.length - 1].quilometragem;

      // Para o kmTotal do mês, precisamos do último abastecimento do mês anterior
      const lastOfPreviousMonth = abastecimentos
        .filter(a => a.quilometragem < firstOfMonth.quilometragem)
        .sort((a, b) => b.quilometragem - a.quilometragem)[0];

      const startKm = lastOfPreviousMonth ? lastOfPreviousMonth.quilometragem : firstOfMonth.quilometragem;
      kmTotal = endKm - startKm;

      // Calcular consumo médio mensal
      if (sortedMonthly.length > 1) {
        const ultimo = sortedMonthly[sortedMonthly.length - 1];
        const penultimo = sortedMonthly[sortedMonthly.length - 2];
        
        const kmRodadosConsumo = ultimo.quilometragem - penultimo.quilometragem;
        const litrosConsumidosConsumo = ultimo.litros; 

        if (kmRodadosConsumo > 0 && litrosConsumidosConsumo > 0) {
          consumoMedioCalculado = consumoKmPorLitro(kmRodadosConsumo, litrosConsumidosConsumo);
        }
      }
    }

    setStats({
      gastoTotal,
      litrosTotal,
      kmTotal,
      consumoMedio: consumoMedioCalculado,
    });

  }, [abastecimentos]);

  return (
    <View style={styles.statsSection}>
      <ThemedText style={styles.sectionTitle}>Resumo Mensal</ThemedText>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <ThemedText style={styles.statValue}>{formatBRL(stats.gastoTotal)}</ThemedText>
          <ThemedText style={styles.statLabel}>Gasto com Combustível</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statValue}>{stats.litrosTotal.toFixed(2)}L</ThemedText>
          <ThemedText style={styles.statLabel}>Litros Abastecidos</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statValue}>{stats.kmTotal.toFixed(1)} km</ThemedText>
          <ThemedText style={styles.statLabel}>Quilometragem</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statValue}>{stats.consumoMedio.toFixed(1)} km/L</ThemedText>
          <ThemedText style={styles.statLabel}>Consumo Médio</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: Colors.light.background,
    padding: 15,
    borderRadius: 12,
    width: '48%', // Two columns with a small gap
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.8,
    marginTop: 5,
    textAlign: 'center',
  },
});
