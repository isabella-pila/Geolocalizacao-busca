import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ActivityIndicator, Keyboard, Alert, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'; // Removi Circle se não estiver usando, mas pode manter
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import { useLocation } from '../context/LocationContext';

export default function MapScreen() {
  // CORREÇÃO 1: Definindo o tipo do Ref para o TypeScript não reclamar
  const mapRef = useRef<MapView>(null);
  
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  const { currentLocation, searchResult, setSearchResult } = useLocation();

  // --- EFEITO AUTOMÁTICO DE ZOOM ---
  useEffect(() => {
    // Só executa se tivermos a localização atual, um resultado de busca E o mapa carregado
    if (currentLocation && searchResult && mapRef.current) {
        
      mapRef.current.fitToCoordinates(
        [
          // Ponto 1: Onde eu estou
          { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude },
          // Ponto 2: Onde eu quero ir
          { latitude: searchResult.latitude, longitude: searchResult.longitude }
        ],
        {
          // Margem para os pinos não ficarem colados na borda (Topo maior por causa da barra de busca)
          edgePadding: { top: 150, right: 50, bottom: 50, left: 50 },
          animated: true,
        }
      );
    }
  }, [searchResult, currentLocation]); 


  const handleGeocode = async () => {
    if (!searchText) return;
    setLoading(true);
    Keyboard.dismiss();

    try {
      const result = await Location.geocodeAsync(searchText);
      
      if (result.length > 0) {
        const { latitude, longitude, altitude, accuracy } = result[0];
        
        const reverse = await Location.reverseGeocodeAsync({ latitude, longitude });
        const addressText = reverse[0] ? `${reverse[0].street}, ${reverse[0].district}` : searchText;

        setSearchResult({
            latitude,
            longitude,
            address: addressText,
            title: searchText,
            altitude: altitude ?? (700 + Math.random() * 100), 
            accuracy: accuracy ?? 50.0
        });

      } else {
        Alert.alert("Erro", "Local não encontrado");
      }
    } catch (e) {
      Alert.alert("Erro", "Falha na busca");
    } finally {
      setLoading(false);
    }
  };

  // CORREÇÃO 2: Adicionei "event: any" para parar o erro de tipo implícito
  const handleMapPress = async (event: any) => {
    const { coordinate } = event.nativeEvent;
    const { latitude, longitude } = coordinate;

    try {
        const reverse = await Location.reverseGeocodeAsync({ latitude, longitude });
        const addressText = reverse[0] 
            ? `${reverse[0].street || 'Rua sem nome'}, ${reverse[0].district || ''}` 
            : "Local Selecionado";

        setSearchResult({
            latitude,
            longitude,
            address: addressText,
            title: "Marcado no Mapa",
            altitude: 750.0,
            accuracy: 10.0
        });

    } catch (error) {
        console.log(error);
    }
  };

  if (!currentLocation) return <ActivityIndicator style={{flex:1}} />;

  return (
    <View style={styles.container}>
        <View style={styles.searchBox}>
             <TextInput 
                style={styles.input} 
                placeholder="Pesquisar..." 
                value={searchText} 
                onChangeText={setSearchText} 
             />
             <TouchableOpacity style={styles.btn} onPress={handleGeocode}>
                {loading ? <ActivityIndicator color="#fff"/> : <Ionicons name="search" size={24} color="#fff"/>}
             </TouchableOpacity>
        </View>

        <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={{flex: 1}}
            mapType="satellite"
            onPress={handleMapPress} 
            initialRegion={{
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                latitudeDelta: 0.01, longitudeDelta: 0.01
            }}
        >
            <Marker coordinate={currentLocation.coords} title="Eu" pinColor="blue" />

            {searchResult && (
                <Marker 
                    coordinate={{ 
                        latitude: searchResult.latitude, 
                        longitude: searchResult.longitude 
                    }} 
                    title={searchResult.title}
                    description={searchResult.address}
                    pinColor="tomato"
                />
            )}
        </MapView>
        
        {/* DICA VISUAL */}
        <View style={styles.tipContainer}>
             <Text style={styles.tipText}>Toque no mapa para marcar destino</Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBox: { position: 'absolute', top: 50, left: 20, right: 20, zIndex: 10, flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, elevation: 5 },
  input: { flex: 1, padding: 15 },
  btn: { padding: 15, backgroundColor: 'tomato', borderTopRightRadius: 8, borderBottomRightRadius: 8 },
  tipContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20
  },
  tipText: { color: '#fff', fontSize: 12, fontWeight: 'bold' }
});