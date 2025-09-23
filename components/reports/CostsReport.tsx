import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAbastecimentos } from '@/hooks/useAbastecimentos';

// Mock types for costs report
type MockFill = {
  data: string; // YYYY-MM-DD
  litros: number;
  valorPago: number;
  tipoCombustivel: 'Gasolina' | 'Etanol';
  quilometragem: number;
};

interface CostsReportProps {
  title?: string;
  mock?: boolean;
}

export default function CostsReport({ title = 'Custos', mock = true }: CostsReportProps) {
  const { abastecimentos, carregarTodosAbastecimentos, loading } = useAbastecimentos();
  const [range, setRange] = useState<'mes' | '30d' | 'custom'>('mes');
  const [showModal, setShowModal] = useState(false);
  const [customStart, setCustomStart] = useState<Date | null>(null);
  const [customEnd, setCustomEnd] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fmt = (d?: Date | null) => (d ? d.toISOString().slice(0,10) : '—');

  useEffect(() => {
    carregarTodosAbastecimentos();
  }, [carregarTodosAbastecimentos]);

  const dados = useMemo<MockFill[]>(() => {
    if (!mock) return [];
    // Dados mockados para exibição inicial
    return [
      { data: '2025-09-01', litros: 35, valorPago: 210, tipoCombustivel: 'Gasolina', quilometragem: 45210 },
      { data: '2025-09-08', litros: 32, valorPago: 188, tipoCombustivel: 'Etanol', quilometragem: 45540 },
      { data: '2025-09-15', litros: 38, valorPago: 228, tipoCombustivel: 'Gasolina', quilometragem: 45930 },
      { data: '2025-09-22', litros: 30, valorPago: 174, tipoCombustivel: 'Etanol', quilometragem: 46260 },
      { data: '2025-09-29', litros: 36, valorPago: 216, tipoCombustivel: 'Gasolina', quilometragem: 46620 },
    ];
  }, [mock]);

  const metrics = useMemo(() => {
    // Preferir dados reais
    let list = abastecimentos.length ? abastecimentos : dados;
    // Aplicar filtro por período
    const now = new Date();
    let start: Date | null = null;
    if (range === 'mes') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (range === '30d') {
      start = new Date(now);
      start.setDate(start.getDate() - 30);
    }
    if (range === 'custom' && customStart && customEnd) {
      const s = fmt(customStart);
      const e = fmt(customEnd);
      list = list.filter((d: any) => {
        const date = (d.data || '').slice(0, 10);
        return date >= s && date <= e;
      });
    } else if (start) {
      const s = start.toISOString().slice(0, 10);
      list = list.filter((d: any) => (d.data || '').slice(0, 10) >= s);
    }
    if (!list.length) {
      return {
        gastoTotal: 0,
        litrosTotal: 0,
        custoMedioLitro: 0,
        ticketMedio: 0,
        custoPorKm: 0,
        porCombustivel: { Gasolina: 0, Etanol: 0 },
      } as const;
    }

    const gastoTotal = list.reduce((s: number, d: any) => s + d.valorPago, 0);
    const litrosTotal = list.reduce((s: number, d: any) => s + d.litros, 0);
    const custoMedioLitro = gastoTotal / Math.max(litrosTotal, 1);
    const ticketMedio = gastoTotal / list.length;

    // Distância: somar por veículo (min->max quilometragem)
    const byCar = new Map<number, { min: number; max: number }>();
    list.forEach((d: any) => {
      const cur = byCar.get(d.carroId) || { min: d.quilometragem, max: d.quilometragem };
      cur.min = Math.min(cur.min, d.quilometragem);
      cur.max = Math.max(cur.max, d.quilometragem);
      byCar.set(d.carroId, cur);
    });
    const kmPercorridos = Array.from(byCar.values()).reduce((s, r) => s + Math.max(0, r.max - r.min), 0);
    const custoPorKm = kmPercorridos > 0 ? gastoTotal / kmPercorridos : 0;

    const porCombustivel = list.reduce(
      (acc: any, d: any) => ({ ...acc, [d.tipoCombustivel]: acc[d.tipoCombustivel] + d.valorPago }),
      { Gasolina: 0, Etanol: 0 } as Record<'Gasolina' | 'Etanol', number>
    );

    return { gastoTotal, litrosTotal, custoMedioLitro, ticketMedio, custoPorKm, porCombustivel } as const;
  }, [abastecimentos, dados]);

  const totalFuelSpend = metrics.porCombustivel.Gasolina + metrics.porCombustivel.Etanol || 1;
  const gasolinaPct = (metrics.porCombustivel.Gasolina / totalFuelSpend) * 100;
  const etanolPct = 100 - gasolinaPct;

  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>

      {/* filtros estilo chips */}
      <View style={styles.filtersRow}>
        <Chip text="Este mês" active={range==='mes'} onPress={() => setRange('mes')} />
        <Chip text="Últimos 30 dias" active={range==='30d'} onPress={() => setRange('30d')} />
        <Chip text="Personalizado" active={range==='custom'} onPress={() => { setRange('custom'); setShowModal(true); }} />
      </View>

      {/* Modal de intervalo personalizado */}
      <Modal transparent visible={showModal} animationType="fade" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <ThemedText style={styles.modalTitle}>Intervalo personalizado</ThemedText>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
              <Pressable onPress={() => setShowStartPicker(true)} style={styles.dateBtn}>
                <ThemedText>Início: {fmt(customStart)}</ThemedText>
              </Pressable>
              <Pressable onPress={() => setShowEndPicker(true)} style={styles.dateBtn}>
                <ThemedText>Fim: {fmt(customEnd)}</ThemedText>
              </Pressable>
            </View>

            {showStartPicker && (
              <DateTimePicker
                mode="date"
                value={customStart ?? new Date()}
                onChange={(_, d) => { setShowStartPicker(false); if (d) setCustomStart(d); }}
              />
            )}
            {showEndPicker && (
              <DateTimePicker
                mode="date"
                value={customEnd ?? new Date()}
                onChange={(_, d) => { setShowEndPicker(false); if (d) setCustomEnd(d); }}
              />
            )}

            {error ? <ThemedText style={{ color: '#D32F2F', marginTop: 8 }}>{error}</ThemedText> : null}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
              <Pressable onPress={() => setShowModal(false)}>
                <ThemedText>Cancelar</ThemedText>
              </Pressable>
              <Pressable
                onPress={() => {
                  if (!customStart || !customEnd) {
                    setError('Selecione as duas datas.');
                    return;
                  }
                  if (customStart > customEnd) {
                    setError('A data inicial deve ser anterior à final.');
                    return;
                  }
                  setError(null);
                  setShowModal(false);
                }}>
                <ThemedText style={{ color: Colors.light.tint, fontWeight: 'bold' }}>Aplicar</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Estatísticas resumidas (inspirado em cards do app de clima) */}
      <View style={styles.statsGrid}>
        <StatCard label="Gasto Total (mês)" value={`R$ ${metrics.gastoTotal.toFixed(2)}`} icon="chart.bar" />
        <StatCard label="Custo médio por litro" value={`R$ ${metrics.custoMedioLitro.toFixed(2)}/L`} icon="chart.bar" />
        <StatCard label="Ticket médio" value={`R$ ${metrics.ticketMedio.toFixed(2)}`} icon="chart.bar" />
        <StatCard label="Custo por km" value={`R$ ${metrics.custoPorKm.toFixed(2)}`} icon="chart.bar" />
      </View>

      {/* Distribuição por combustível com barras simples */}
      <View style={styles.card}>
        <View style={styles.titleRow}>
          <IconSymbol name="chart.bar" color={Colors.light.text} size={18} />
          <ThemedText style={styles.cardTitle}>Distribuição por combustível</ThemedText>
        </View>
        <ThemedText style={styles.smallMuted}>Total R$ {totalFuelSpend.toFixed(2)}</ThemedText>

        <View style={styles.barRow}>
          <View style={[styles.barBase, { backgroundColor: '#E6F0FF' }]}>
            <View style={[styles.barFill, { width: `${gasolinaPct}%`, backgroundColor: Colors.light.tint }]} />
          </View>
          <ThemedText style={styles.barLabel}>Gasolina {gasolinaPct.toFixed(0)}%</ThemedText>
        </View>

        <View style={styles.barRow}>
          <View style={[styles.barBase, { backgroundColor: '#FFF0E6' }]}>
            <View style={[styles.barFill, { width: `${etanolPct}%`, backgroundColor: '#FF9800' }]} />
          </View>
          <ThemedText style={styles.barLabel}>Etanol {etanolPct.toFixed(0)}%</ThemedText>
        </View>
      </View>
    </View>
  );
}

function Chip({ text, active = false, onPress }: { text: string; active?: boolean; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.chip, active && styles.chipActive]}>
        <ThemedText style={[styles.chipText, active && styles.chipTextActive]}>{text}</ThemedText>
      </View>
    </TouchableOpacity>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon?: 'chart.bar' }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        {icon && <IconSymbol name={icon} color={Colors.light.text} size={18} />}
        <ThemedText style={styles.statValue}>{value}</ThemedText>
      </View>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 15,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#EDF1F7',
  },
  chipActive: {
    backgroundColor: Colors.light.tint,
  },
  chipText: {
    fontSize: 12,
    color: Colors.light.text,
  },
  chipTextActive: {
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: Colors.light.background,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.light.text,
    textAlign: 'center',
    opacity: 0.8,
  },
  card: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  smallMuted: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 12,
  },
  barRow: {
    marginBottom: 12,
  },
  barBase: {
    width: '100%',
    height: 16,
    borderRadius: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 10,
  },
  barLabel: {
    fontSize: 13,
    marginTop: 6,
  },
  // Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dateBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E1E4E8',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E1E4E8',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
});
