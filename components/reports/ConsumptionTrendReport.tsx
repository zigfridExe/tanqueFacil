import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAbastecimentos } from '@/hooks/useAbastecimentos';

export default function ConsumptionTrendReport() {
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

  // Série real: calcular km/L por trecho entre abastecimentos dentro de cada veículo
  const realSerie = useMemo(() => {
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
    const byCar = new Map<number, typeof abastecimentos>();
    filtered.forEach((ab) => {
      const arr = byCar.get(ab.carroId) || [];
      arr.push(ab);
      byCar.set(ab.carroId, arr);
    });
    const segments: { endDate: string; kml: number }[] = [];
    byCar.forEach((list) => {
      const ordered = [...list].sort((a, b) => a.quilometragem - b.quilometragem || a.data.localeCompare(b.data));
      for (let i = 0; i < ordered.length - 1; i++) {
        const cur = ordered[i];
        const next = ordered[i + 1];
        const dist = next.quilometragem - cur.quilometragem;
        if (dist <= 0 || cur.litros <= 0) continue;
        segments.push({ endDate: next.data, kml: dist / cur.litros });
      }
    });
    // Ordenar por data final e pegar os últimos 8
    const orderedSeg = segments.sort((a, b) => a.endDate.localeCompare(b.endDate));
    return orderedSeg.slice(-8).map((s) => s.kml);
  }, [abastecimentos, range]);

  // Fallback mock caso não haja dados
  const serie = realSerie ?? [9.8, 10.4, 11.2, 10.9, 11.6, 12.1, 11.7, 11.4];
  const media = useMemo(() => (serie.length ? serie.reduce((s, v) => s + v, 0) / serie.length : 0), [serie]);
  const max = Math.max(...serie, 12.5);

  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Tendência de Consumo</ThemedText>

      {/* Filtros */}
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

      <View style={styles.card}>
        <ThemedText style={styles.cardTitle}>Média móvel</ThemedText>
        <ThemedText style={styles.smallMuted}>Atual: {media.toFixed(1)} km/L</ThemedText>

        {/* Linha de pílulas/barras proporcional, estilo "hourly" do app de clima */}
        <View style={styles.pillsRow}>
          {serie.map((v, i) => {
            const pct = Math.max(8, Math.min(100, (v / max) * 100));
            const bg = v >= media ? Colors.light.tint : '#FF9800';
            return (
              <View key={i} style={styles.pillItem}>
                <View style={[styles.pillBarBase]}> 
                  <View style={[styles.pillBarFill, { height: `${pct}%`, backgroundColor: bg }]} />
                </View>
                <ThemedText style={styles.pillLabel}>{v.toFixed(1)}</ThemedText>
              </View>
            );
          })}
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
  pillsRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  pillItem: {
    width: 30,
    alignItems: 'center',
  },
  pillBarBase: {
    width: 24,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F5F7FA',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  pillBarFill: {
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  pillLabel: {
    fontSize: 12,
    marginTop: 6,
  },
  // Modal styles (reusing same pattern)
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
