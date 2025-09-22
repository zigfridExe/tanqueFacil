import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useAbastecimentos } from '@/hooks/useAbastecimentos';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import * as Location from 'expo-location';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function AbastecimentoMapaScreen() {
  const { abastecimentos, loading, error, carregarTodosAbastecimentos } = useAbastecimentos();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locating, setLocating] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_KEY || '';

  useEffect(() => {
    // Carregar abastecimentos do banco
    carregarTodosAbastecimentos();
  }, [carregarTodosAbastecimentos]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLocating(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Permissão de localização negada.');
          return;
        }
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        if (!cancelled) {
          setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        }
      } catch (e: any) {
        if (!cancelled) setLocationError(e?.message || 'Falha ao obter localização.');
      } finally {
        if (!cancelled) setLocating(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const initialRegion = useMemo(() => {
    if (userLocation) {
      return {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
    }
    const primeiroComLoc = abastecimentos.find(ab => ab.latitude && ab.longitude);
    if (primeiroComLoc) {
      return {
        latitude: primeiroComLoc.latitude!,
        longitude: primeiroComLoc.longitude!,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
    }
    // Fallback: São Paulo
    return {
      latitude: -23.55052,
      longitude: -46.633309,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };
  }, [userLocation, abastecimentos]);

  if (loading || locating) {
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
          {locationError ? <ThemedText style={styles.errorText}>{locationError}</ThemedText> : null}
        </View>
      ) : (
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
        >
          {/* Tiles via MapTiler (conforme política de uso). Configure EXPO_PUBLIC_MAPTILER_KEY no .env */}
          <UrlTile
            urlTemplate={`https://api.maptiler.com/maps/openstreetmap/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`}
            maximumZ={19}
            flipY={false}
            zIndex={-1}
          />
          {/* Banner se a chave não estiver definida */}
          {!MAPTILER_KEY ? (
            <View style={styles.banner} pointerEvents="none">
              <ThemedText style={styles.bannerText}>Defina EXPO_PUBLIC_MAPTILER_KEY para exibir os tiles OSM (MapTiler)</ThemedText>
            </View>
          ) : null}
          {/* Posição atual do usuário */}
          {userLocation && (
            <Marker coordinate={userLocation} title="Você está aqui">
              <View style={styles.userDotOuter}>
                <View style={styles.userDotInner} />
              </View>
            </Marker>
          )}
          {abastecimentosComLocalizacao.map((abastecimento, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: abastecimento.latitude!,
                longitude: abastecimento.longitude!,
              }}
              title={`Abastecimento em ${abastecimento.data}`}
              description={`Litros: ${abastecimento.litros}, Valor: R$ ${abastecimento.valorPago.toFixed(2)}`}
            >
              <View style={styles.pumpMarker}>
                <MaterialIcons name="local-gas-station" size={24} color="#FF5722" />
              </View>
            </Marker>
          ))}
          {/* Atribuição (requerido) */}
          <View style={styles.attribution} pointerEvents="none">
            <ThemedText style={styles.attributionText}>© OpenStreetMap contributors | Tiles © MapTiler</ThemedText>
          </View>
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
  attribution: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  attributionText: {
    fontSize: 10,
    color: '#444',
  },
  banner: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    backgroundColor: '#FFF8E1',
    borderColor: '#FFECB3',
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
  },
  bannerText: {
    fontSize: 12,
    color: '#8D6E63',
  },
  userDotOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(24,118,242,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(24,118,242,0.35)'
  },
  userDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1876F2',
  },
  pumpMarker: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
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