import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAbastecimentos } from '@/hooks/useAbastecimentos';

export default function PerformanceReport() {
  const { abastecimentos, carregarTodosAbastecimentos } = useAbastecimentos();
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

  // Dados mockados para representar medições de desempenho
  const mock = useMemo(() => ({
    porCombustivel: {
      Gasolina: 11.8,
      Etanol: 8.7,
    },
    porTrajeto: {
      Cidade: 9.6,
      Estrada: 13.4,
      Misto: 11.2,
    },
    calibragem: {
      calibrado: 11.9,
      descalibrado: 10.8,
    },
  }), []);

  // Cálculos reais a partir da lista de abastecimentos
  const realStats = useMemo(() => {
    if (!abastecimentos.length) return null;
    // Filtro por período
    const now = new Date();
    let start: Date | null = null;
    if (range === 'mes') start = new Date(now.getFullYear(), now.getMonth(), 1);
    else if (range === '30d') {
      start = new Date(now);
      start.setDate(start.getDate() - 30);
    }
    let filtered = start
      ? abastecimentos.filter((a) => (a.data || '').slice(0, 10) >= start!.toISOString().slice(0, 10))
      : abastecimentos;
    if (range === 'custom' && customStart && customEnd) {
      const s = fmt(customStart);
      const e = fmt(customEnd);
      filtered = abastecimentos.filter((a) => (a.data || '').slice(0, 10) >= s && (a.data || '').slice(0, 10) <= e);
    }
    // Agrupar por veículo e ordenar por quilometragem para calcular trechos
    const byCar = new Map<number, typeof filtered>();
    filtered.forEach((ab) => {
      const arr = byCar.get(ab.carroId) || [];
      arr.push(ab);
      byCar.set(ab.carroId, arr);
    });

    let fuelDist: Record<'Gasolina' | 'Etanol', { km: number; litros: number }> = {
      Gasolina: { km: 0, litros: 0 },
      Etanol: { km: 0, litros: 0 },
    };
    let routeDist: Record<'Cidade' | 'Estrada' | 'Misto', { km: number; litros: number }> = {
      Cidade: { km: 0, litros: 0 },
      Estrada: { km: 0, litros: 0 },
      Misto: { km: 0, litros: 0 },
    };
    let calib: { calibrado: { km: number; litros: number }; descalibrado: { km: number; litros: number } } = {
      calibrado: { km: 0, litros: 0 },
      descalibrado: { km: 0, litros: 0 },
    };

    byCar.forEach((list) => {
      const ordered = [...list].sort((a, b) => a.quilometragem - b.quilometragem || a.data.localeCompare(b.data));
      for (let i = 0; i < ordered.length - 1; i++) {
        const cur = ordered[i];
        const next = ordered[i + 1];
        const dist = next.quilometragem - cur.quilometragem;
        if (dist <= 0) continue;
        // Atribuímos o trecho ao abastecimento "cur"
        fuelDist[cur.tipoCombustivel].km += dist;
        fuelDist[cur.tipoCombustivel].litros += cur.litros;

        routeDist[cur.tipoTrajeto].km += dist;
        routeDist[cur.tipoTrajeto].litros += cur.litros;

        if (cur.calibragemPneus) {
          calib.calibrado.km += dist;
          calib.calibrado.litros += cur.litros;
        } else {
          calib.descalibrado.km += dist;
          calib.descalibrado.litros += cur.litros;
        }
      }
    });

    const porCombustivel = {
      Gasolina: fuelDist.Gasolina.litros > 0 ? fuelDist.Gasolina.km / fuelDist.Gasolina.litros : 0,
      Etanol: fuelDist.Etanol.litros > 0 ? fuelDist.Etanol.km / fuelDist.Etanol.litros : 0,
    } as const;
    const porTrajeto = {
      Cidade: routeDist.Cidade.litros > 0 ? routeDist.Cidade.km / routeDist.Cidade.litros : 0,
      Estrada: routeDist.Estrada.litros > 0 ? routeDist.Estrada.km / routeDist.Estrada.litros : 0,
      Misto: routeDist.Misto.litros > 0 ? routeDist.Misto.km / routeDist.Misto.litros : 0,
    } as const;
    const calibragem = {
      calibrado: calib.calibrado.litros > 0 ? calib.calibrado.km / calib.calibrado.litros : 0,
      descalibrado: calib.descalibrado.litros > 0 ? calib.descalibrado.km / calib.descalibrado.litros : 0,
    } as const;

    return { porCombustivel, porTrajeto, calibragem } as const;
  }, [abastecimentos, range]);

  const ganhoCalibragemPct = useMemo(() => {
    const base = realStats || mock;
    const { calibrado, descalibrado } = base.calibragem;
    if (descalibrado <= 0) return 0;
    return ((calibrado - descalibrado) / descalibrado) * 100;
  }, [realStats, mock]);

  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Desempenho</ThemedText>

      {/* filtros simples */}
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
              <DateTimePicker mode="date" value={customStart ?? new Date()} onChange={(_, d) => { setShowStartPicker(false); if (d) setCustomStart(d); }} />
            )}
            {showEndPicker && (
              <DateTimePicker mode="date" value={customEnd ?? new Date()} onChange={(_, d) => { setShowEndPicker(false); if (d) setCustomEnd(d); }} />
            )}
            {error ? <ThemedText style={{ color: '#D32F2F', marginTop: 8 }}>{error}</ThemedText> : null}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
              <Pressable onPress={() => setShowModal(false)}>
                <ThemedText>Cancelar</ThemedText>
              </Pressable>
              <Pressable onPress={() => {
                if (!customStart || !customEnd) { setError('Selecione as duas datas.'); return; }
                if (customStart > customEnd) { setError('A data inicial deve ser anterior à final.'); return; }
                setError(null); setShowModal(false);
              }}>
                <ThemedText style={{ color: Colors.light.tint, fontWeight: 'bold' }}>Aplicar</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Consumo por combustível */}
      <View style={styles.card}>
        <View style={styles.titleRow}>
          <IconSymbol name="chart.bar" color={Colors.light.text} size={18} />
          <ThemedText style={styles.cardTitle}>Consumo por combustível</ThemedText>
        </View>
        <View style={styles.statsRow}>
          <StatCard label="Gasolina" value={`${(realStats?.porCombustivel.Gasolina ?? mock.porCombustivel.Gasolina).toFixed(1)} km/L`} />
          <StatCard label="Etanol" value={`${(realStats?.porCombustivel.Etanol ?? mock.porCombustivel.Etanol).toFixed(1)} km/L`} />
        </View>
        <MiniBars
          items={[
            { label: 'Gasolina', value: realStats?.porCombustivel.Gasolina ?? mock.porCombustivel.Gasolina, color: Colors.light.tint },
            { label: 'Etanol', value: realStats?.porCombustivel.Etanol ?? mock.porCombustivel.Etanol, color: '#FF9800' },
          ]}
          max={14}
        />
      </View>

      {/* Consumo por tipo de trajeto */}
      <View style={styles.card}>
        <View style={styles.titleRow}>
          <IconSymbol name="chart.bar" color={Colors.light.text} size={18} />
          <ThemedText style={styles.cardTitle}>Consumo por tipo de trajeto</ThemedText>
        </View>
        <View style={styles.statsRow}>
          <StatCard label="Cidade" value={`${(realStats?.porTrajeto.Cidade ?? mock.porTrajeto.Cidade).toFixed(1)} km/L`} />
          <StatCard label="Estrada" value={`${(realStats?.porTrajeto.Estrada ?? mock.porTrajeto.Estrada).toFixed(1)} km/L`} />
        </View>
        <View style={styles.statsRow}>
          <StatCard label="Misto" value={`${(realStats?.porTrajeto.Misto ?? mock.porTrajeto.Misto).toFixed(1)} km/L`} />
        </View>
        <MiniBars
          items={[
            { label: 'Cidade', value: realStats?.porTrajeto.Cidade ?? mock.porTrajeto.Cidade, color: '#9C27B0' },
            { label: 'Estrada', value: realStats?.porTrajeto.Estrada ?? mock.porTrajeto.Estrada, color: '#4CAF50' },
            { label: 'Misto', value: realStats?.porTrajeto.Misto ?? mock.porTrajeto.Misto, color: '#03A9F4' },
          ]}
          max={14}
        />
      </View>

      {/* Impacto da calibragem */}
      <View style={styles.card}>
        <View style={styles.titleRow}>
          <IconSymbol name="chart.bar" color={Colors.light.text} size={18} />
          <ThemedText style={styles.cardTitle}>Impacto da calibragem de pneus</ThemedText>
        </View>
        <View style={styles.statsRow}>
          <StatCard label="Calibrado" value={`${(realStats?.calibragem.calibrado ?? mock.calibragem.calibrado).toFixed(1)} km/L`} />
          <StatCard label="Descalibrado" value={`${(realStats?.calibragem.descalibrado ?? mock.calibragem.descalibrado).toFixed(1)} km/L`} />
        </View>
        <ThemedText style={styles.smallMuted}>
          Ganho estimado: {ganhoCalibragemPct.toFixed(1)}%
        </ThemedText>
        <MiniBars
          items={[
            { label: 'Calibrado', value: realStats?.calibragem.calibrado ?? mock.calibragem.calibrado, color: '#2E7D32' },
            { label: 'Descalibrado', value: realStats?.calibragem.descalibrado ?? mock.calibragem.descalibrado, color: '#F44336' },
          ]}
          max={14}
        />
      </View>
    </View>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
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

function MiniBars({
  items,
  max,
}: {
  items: { label: string; value: number; color: string }[];
  max: number;
}) {
  const clamped = items.map((it) => ({
    ...it,
    pct: Math.max(0, Math.min(100, (it.value / max) * 100)),
  }));
  return (
    <View style={{ marginTop: 12 }}>
      {clamped.map((it) => (
        <View key={it.label} style={{ marginBottom: 10 }}>
          <View style={[styles.barBase, { backgroundColor: '#EDEFF3' }]}>
            <View style={[styles.barFill, { width: `${it.pct}%`, backgroundColor: it.color }]} />
          </View>
          <ThemedText style={styles.barLabel}>{it.label} — {it.value.toFixed(1)} km/L</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  smallMuted: {
    fontSize: 14,
    opacity: 0.7,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statCard: {
    width: '48%',
    backgroundColor: Colors.light.background,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.8,
    marginTop: 4,
  },
  barBase: {
    width: '100%',
    height: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 8,
  },
  barLabel: {
    fontSize: 12,
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
});
