import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useAbastecimentos } from '@/hooks/useAbastecimentos';
import { useSettingsStore } from '@/src/store/useSettingsStore';
import { useVehicleStore } from '@/src/store/useVehicleStore';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Region, UrlTile } from 'react-native-maps';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function AbastecimentoMapaScreen() {
  // Proteção contra crash no carregamento inicial
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <ThemedText>Inicializando mapa...</ThemedText>
      </ThemedView>
    );
  }
  const { abastecimentos, loading, error, carregarTodosAbastecimentos, carregarAbastecimentosPorVeiculo } = useAbastecimentos();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locating, setLocating] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_KEY || '';
  const mapRef = useRef<MapView>(null);
  const [styleId, setStyleId] = useState<'osm' | 'streets' | 'dark'>('osm');
  const navigation = useNavigation();
  const { clusterRadiusMeters } = useSettingsStore();
  const { selectedVehicle } = useVehicleStore();
  const params = useLocalSearchParams<{ scope?: string }>();
  const scope: 'all' | 'active' = params?.scope === 'active' ? 'active' : 'all';
  const [selected, setSelected] = useState<{ lat: number; lon: number; title?: string } | null>(null);
  const [previewShown, setPreviewShown] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions?.({ title: 'Mapa de Abastecimentos' });
  }, [navigation]);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        if (scope === 'active' && selectedVehicle?.id) {
          await carregarAbastecimentosPorVeiculo(selectedVehicle.id);
        } else {
          await carregarTodosAbastecimentos();
        }
      } catch (error) {
        console.error('Erro ao carregar dados do mapa:', error);
      }
    };
    
    carregarDados();
  }, [scope, selectedVehicle?.id, carregarAbastecimentosPorVeiculo, carregarTodosAbastecimentos]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLocating(true);
        setLocationError(null);
        
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (!cancelled) {
            setLocationError('Permissão de localização negada.');
          }
          return;
        }
        
        const pos = await Location.getCurrentPositionAsync({ 
          accuracy: Location.Accuracy.Balanced,
          timeout: 10000,
          maximumAge: 300000 // 5 minutos
        });
        
        if (!cancelled && pos?.coords) {
          setUserLocation({ 
            latitude: pos.coords.latitude, 
            longitude: pos.coords.longitude 
          });
        }
      } catch (e: any) {
        if (!cancelled) {
          console.error('Erro de localização:', e);
          setLocationError(e?.message || 'Falha ao obter localização.');
        }
      } finally {
        if (!cancelled) {
          setLocating(false);
        }
      }
    })();
    
    return () => { 
      cancelled = true; 
    };
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
    return {
      latitude: -23.55052,
      longitude: -46.633309,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };
  }, [userLocation, abastecimentos]);

  const goToUser = () => {
    const target = userLocation
      ? { ...userLocation, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA }
      : initialRegion;
    mapRef.current?.animateToRegion(target as Region, 450);
  };

  const cycleStyle = () => {
    setStyleId((prev) => (prev === 'osm' ? 'streets' : prev === 'streets' ? 'dark' : 'osm'));
  };

  const tileUrl = useMemo(() => {
    if (!MAPTILER_KEY) return '';
    const base = 'https://api.maptiler.com/maps';
    const variant = styleId === 'osm' ? 'openstreetmap' : styleId === 'streets' ? 'streets-v2' : 'streets-v2-dark';
    return `${base}/${variant}/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`;
  }, [MAPTILER_KEY, styleId]);

  const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getResumo = useCallback((lat: number, lon: number, radiusMeters: number) => {
    try {
      const raioKm = Math.max(50, Math.min(5000, Math.round(radiusMeters))) / 1000;
      const proximos = abastecimentos.filter(a => 
        a && 
        typeof a.latitude === 'number' && 
        typeof a.longitude === 'number' && 
        !isNaN(a.latitude) && 
        !isNaN(a.longitude) &&
        haversineKm(lat, lon, a.latitude, a.longitude) <= raioKm
      );
      const count = proximos.length;
      if (count === 0) return null;
      
      const totalLitros = proximos.reduce((s, a) => s + (a.litros || 0), 0);
      const totalGasto = proximos.reduce((s, a) => s + (a.valorPago || 0), 0);
      const precoMedio = totalLitros > 0 ? totalGasto / totalLitros : 0;
      const dataMaisRecente = proximos
        .map(p => p.data)
        .filter(data => data)
        .sort()
        .slice(-1)[0] || null;
        
      return { quantidade: count, dataMaisRecente, totalLitros, precoMedio, totalGasto } as const;
    } catch (error) {
      console.error('Erro ao calcular resumo:', error);
      return null;
    }
  }, [abastecimentos]);

  const abastecimentosComLocalizacao = useMemo(
    () => abastecimentos.filter((ab) => 
      ab && 
      typeof ab.latitude === 'number' && 
      typeof ab.longitude === 'number' && 
      !isNaN(ab.latitude) && 
      !isNaN(ab.longitude)
    ),
    [abastecimentos]
  );

  useEffect(() => {
    if (loading || locating || previewShown) return;
    if (abastecimentosComLocalizacao.length === 0) return;
    
    try {
      const primeiroAbaste = abastecimentosComLocalizacao[0];
      if (!primeiroAbaste || typeof primeiroAbaste.latitude !== 'number' || typeof primeiroAbaste.longitude !== 'number') {
        return;
      }
      
      const baseLat = userLocation?.latitude ?? primeiroAbaste.latitude;
      const baseLon = userLocation?.longitude ?? primeiroAbaste.longitude;
      
      let best = primeiroAbaste;
      let bestDist = haversineKm(baseLat, baseLon, best.latitude, best.longitude);
      
      for (const ab of abastecimentosComLocalizacao) {
        if (ab && typeof ab.latitude === 'number' && typeof ab.longitude === 'number') {
          const d = haversineKm(baseLat, baseLon, ab.latitude, ab.longitude);
          if (d < bestDist) { 
            best = ab; 
            bestDist = d; 
          }
        }
      }
      
      setSelected({ 
        lat: best.latitude, 
        lon: best.longitude, 
        title: `Abastecimento ${best.data || 'N/A'}` 
      });
      setPreviewShown(true);
    } catch (error) {
      console.error('Erro na seleção automática:', error);
    }
  }, [loading, locating, previewShown, abastecimentosComLocalizacao, userLocation]);

  const selectedResumo = useMemo(() => {
    if (!selected) return null;
    return getResumo(selected.lat, selected.lon, clusterRadiusMeters);
  }, [selected, clusterRadiusMeters, getResumo]);

  const markers = useMemo(() => (
    abastecimentosComLocalizacao
      .filter((abastecimento) => 
        abastecimento && 
        typeof abastecimento.latitude === 'number' && 
        typeof abastecimento.longitude === 'number'
      )
      .map((abastecimento) => (
        <Marker
          key={abastecimento.id ?? `${abastecimento.carroId}-${abastecimento.data}-${abastecimento.latitude}-${abastecimento.longitude}`}
          coordinate={{ latitude: abastecimento.latitude, longitude: abastecimento.longitude }}
          title={`Abastecimento em ${abastecimento.data || 'N/A'}`}
          description={`Litros: ${abastecimento.litros || 0}, Valor: R$ ${(abastecimento.valorPago || 0).toFixed(2)}`}
          onPress={() => setSelected({ 
            lat: abastecimento.latitude, 
            lon: abastecimento.longitude, 
            title: `Abastecimento ${abastecimento.data || 'N/A'}` 
          })}
        >
          <View style={styles.pumpMarker}>
            <MaterialIcons name="local-gas-station" size={24} color="#FF5722" />
          </View>
        </Marker>
      ))
  ), [abastecimentosComLocalizacao]);

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
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {scope === 'active' && !selectedVehicle?.id ? (
        <View style={styles.banner} pointerEvents="none">
          <ThemedText style={styles.bannerText}>Selecione um veículo ativo para filtrar o mapa. Exibindo todos.</ThemedText>
        </View>
      ) : null}
      {abastecimentosComLocalizacao.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>Nenhum abastecimento com localização registrada.</ThemedText>
          <ThemedText style={styles.emptyText}>Certifique-se de ativar &quot;Salvar Local do Abastecimento (GPS)&quot; nas configurações do veículo e registrar novos abastecimentos.</ThemedText>
          {locationError ? <ThemedText style={styles.errorText}>{locationError}</ThemedText> : null}
        </View>
      ) : (
        <>
          <MapView
            style={styles.map}
            initialRegion={initialRegion}
            ref={mapRef}
            showsUserLocation={false}
            showsMyLocationButton={false}
            loadingEnabled={true}
            showsBuildings={false}
            showsIndoors={false}
            showsCompass={false}
            provider={undefined}
            moveOnMarkerPress={true}
          >
            {MAPTILER_KEY ? (
              <UrlTile
                urlTemplate={tileUrl}
                maximumZ={19}
                flipY={false}
                zIndex={-1}
              />
            ) : null}
            {userLocation && (
              <Marker coordinate={userLocation} title="Você está aqui">
                <View style={styles.userDotOuter}>
                  <View style={styles.userDotInner} />
                </View>
              </Marker>
            )}
            {markers}
          </MapView>
          {!MAPTILER_KEY ? (
            <View style={styles.banner} pointerEvents="none">
              <ThemedText style={styles.bannerText}>Defina EXPO_PUBLIC_MAPTILER_KEY para exibir os tiles OSM (MapTiler)</ThemedText>
            </View>
          ) : null}
          <View style={styles.attribution} pointerEvents="none">
            <ThemedText style={styles.attributionText}> OpenStreetMap contributors | Tiles MapTiler</ThemedText>
          </View>

          {selected && (
            <View style={styles.bottomSheet}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>Abastecimentos ({clusterRadiusMeters}m): {selectedResumo?.quantidade ?? 1}</Text>
              <Text style={styles.sheetLine}>Data (mais recente): {selectedResumo?.dataMaisRecente ?? selected.title?.replace('Abastecimento ', '')}</Text>
              <Text style={styles.sheetLine}>Litros: {(selectedResumo?.totalLitros ?? 0).toFixed(2)} L</Text>
              <Text style={styles.sheetLine}>Valor do litro: R$ {(selectedResumo?.precoMedio ?? 0).toFixed(2)}</Text>
              <Text style={styles.sheetLine}>Total gasto: R$ {(selectedResumo?.totalGasto ?? 0).toFixed(2)}</Text>
              <View style={styles.sheetActions}>
                <Pressable style={[styles.actionBtn, styles.googleBtn]} onPress={async () => {
                  const url = Platform.select({
                    ios: `comgooglemaps://?daddr=${selected.lat},${selected.lon}&directionsmode=driving`,
                    android: `google.navigation:q=${selected.lat},${selected.lon}`,
                    default: `https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lon}`,
                  });
                  const webFallback = `https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lon}`;
                  if (!url) return Linking.openURL(webFallback);
                  const can = await Linking.canOpenURL(url);
                  return Linking.openURL(can ? url : webFallback);
                }}>
                  <MaterialIcons name="map" size={18} color="#FFFFFF" />
                  <Text style={styles.actionBtnText}>Google Maps</Text>
                </Pressable>
                <Pressable style={[styles.actionBtn, styles.wazeBtn]} onPress={async () => {
                  const url = `waze://?ll=${selected.lat},${selected.lon}&navigate=yes`;
                  const webFallback = `https://waze.com/ul?ll=${selected.lat},${selected.lon}&navigate=yes`;
                  const can = await Linking.canOpenURL(url);
                  return Linking.openURL(can ? url : webFallback);
                }}>
                  <MaterialIcons name="directions" size={18} color="#FFFFFF" />
                  <Text style={styles.actionBtnText}>Waze</Text>
                </Pressable>
                <Pressable style={styles.sheetClose} onPress={() => setSelected(null)}>
                  <MaterialIcons name="close" size={18} color="#555" />
                </Pressable>
              </View>
            </View>
          )}

          <View style={styles.fabContainer}>
            <Pressable style={styles.fab} onPress={goToUser} android_ripple={{ color: '#E3F2FD' }}>
              <MaterialIcons name="my-location" size={22} color="#1976D2" />
            </Pressable>
            <Pressable style={[styles.fab, styles.fabSecondary]} onPress={cycleStyle} android_ripple={{ color: '#F3E5F5' }}>
              <MaterialIcons name="layers" size={22} color="#6A1B9A" />
            </Pressable>
          </View>
        </>
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
  overlayHeader: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overlayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  overlaySubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  fabContainer: {
    position: 'absolute',
    right: 12,
    bottom: 24,
    gap: 12,
    alignItems: 'flex-end',
  },
  fab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  fabSecondary: {
    backgroundColor: '#FFFFFF',
  },
  actionBar: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 4,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  googleBtn: {
    backgroundColor: '#1A73E8',
  },
  wazeBtn: {
    backgroundColor: '#4CAF50',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F4F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calloutCard: {
    minWidth: 260,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  calloutCardAndroid: {
    minWidth: 260,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    // Sem sombras/elevation para evitar glitches no Android
  },
  calloutTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  calloutLine: {
    fontSize: 13,
    marginTop: 2,
  },
  calloutActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 8,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    marginBottom: 10,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  sheetLine: {
    fontSize: 14,
    marginTop: 2,
  },
  sheetActions: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sheetClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F4F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
});