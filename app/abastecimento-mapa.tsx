import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { useAbastecimentos } from '@/hooks/useAbastecimentos';
import { Link } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function AbastecimentoMapaScreen() {
  const { abastecimentos, loading, error } = useAbastecimentos();

  const abastecimentosComLocalizacao = abastecimentos.filter(
    (a) => a.latitude && a.longitude
  );

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
        <ThemedText>Carregando mapa...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Erro ao carregar os dados: {error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Link href="/(tabs)/relatorios" style={styles.backButton}>
        <ThemedText type="link">Voltar</ThemedText>
      </Link>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: abastecimentosComLocalizacao[0]?.latitude ?? -14.235,
          longitude: abastecimentosComLocalizacao[0]?.longitude ?? -51.9253,
          latitudeDelta: 15,
          longitudeDelta: 15,
        }}
      >
        <UrlTile
          urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
          zIndex={-1}
        />
        {abastecimentosComLocalizacao.map((abastecimento) => (
          <Marker
            key={abastecimento.id}
            coordinate={{
              latitude: abastecimento.latitude!,
              longitude: abastecimento.longitude!,
            }}
            title={`Abastecimento #${abastecimento.id}`}
            description={`R$ ${abastecimento.valorPago.toFixed(2)}`}
          />
        ))}
      </MapView>
      {abastecimentosComLocalizacao.length === 0 && (
        <View style={styles.noDataContainer}>
          <ThemedText>Nenhum abastecimento com localização encontrada.</ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 10,
  },
  noDataContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  }
});
