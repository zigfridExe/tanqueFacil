import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useAbastecimentos } from '@/hooks/useAbastecimentos';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View, Dimensions, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_OSM } from 'react-native-maps';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function AbastecimentoMapaScreen() {
  const { abastecimentos, loading, error } = useAbastecimentos();

  const initialRegion = useMemo(() => {
    if (abastecimentos.length > 0 && abastecimentos[0].latitude && abastecimentos[0].longitude) {
      return {
        latitude: abastecimentos[0].latitude,
        longitude: abastecimentos[0].longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
    }
    // Default region if no abastecimentos with location data
    return {
      latitude: -23.55052, // São Paulo coordinates
      longitude: -46.633309,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };
  }, [abastecimentos]);

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <ThemedText>Carregando dados do mapa...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>Erro ao carregar abastecimentos: {error}</ThemedText>
        {/* Add a retry button if needed */}
      </ThemedView>
    );
  }

  const abastecimentosComLocalizacao = abastecimentos.filter(ab => ab.latitude && ab.longitude);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Mapa de Abastecimentos</ThemedText>
      </View>
      {abastecimentosComLocalizacao.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>Nenhum abastecimento com localização registrada.</ThemedText>
          <ThemedText style={styles.emptyText}>Certifique-se de ativar &quot;Salvar Local do Abastecimento (GPS)&quot; nas configurações do veículo e registrar novos abastecimentos.</ThemedText>
        </View>
      ) : (
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          provider={PROVIDER_OSM}
        >
          {abastecimentosComLocalizacao.map((abastecimento, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: abastecimento.latitude!,
                longitude: abastecimento.longitude!,
              }}
              title={`Abastecimento em ${abastecimento.data}`}
              description={`Litros: ${abastecimento.litros}, Valor: R$ ${abastecimento.valorPago.toFixed(2)}`}
            />
          ))}
        </MapView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red', // Fallback color, as Colors.light.error is not defined
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 10,
  },
});