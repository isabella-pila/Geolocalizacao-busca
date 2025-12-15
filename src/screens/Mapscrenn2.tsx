import React, { useState, useRef } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ActivityIndicator, Keyboard, Alert } from 'react-native';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps'; // <--- IMPORTANTE: PROVIDER_GOOGLE
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import { useLocation } from '../context/LocationContext';

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  const { currentLocation, searchResult, setSearchResult } = useLocation();


  const handleGeocode = async () => {
    if (!searchText) return;
    setLoading(true);
    Keyboard.dismiss();

    try {
      const result = await Location.geocodeAsync(searchText);
      
      if (result.length > 0) {
        const { latitude, longitude, altitude, accuracy } = result[0];
        
        mapRef.current?.animateToRegion({ latitude, longitude, latitudeDelta: 0.005, longitudeDelta: 0.005 });
        
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

  // --- FUNÇÃO DE CLIQUE NO MAPA (TROCADO PARA onPress) ---
  const handleMapPress = async (event: any) => {
    // 1. Pega coordenada
    const { coordinate } = event.nativeEvent;
    const { latitude, longitude } = coordinate;

    console.log("Clique detectado:", latitude, longitude); // <--- Para debug

    // 2. Busca endereço
    try {
        const reverse = await Location.reverseGeocodeAsync({ latitude, longitude });
        const addressText = reverse[0] 
            ? `${reverse[0].street || 'Rua sem nome'}, ${reverse[0].district || ''}` 
            : "Local Selecionado";

        // 3. Salva no contexto
        setSearchResult({
            latitude,
            longitude,
            address: addressText,
            title: "Marcado no Mapa",
            altitude: 750.0, // Mock para prova
            accuracy: 10.0   // Mock para prova
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
            provider={PROVIDER_GOOGLE} // <--- ADICIONADO PARA GARANTIR FUNCIONAMENTO NO ANDROID
            style={{flex: 1}}
            mapType="satellite"
            
            // TROQUEI DE onLongPress PARA onPress (CLIQUE SIMPLES)
            // É muito mais fácil de testar no computador
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

        {/* DICA VISUAL PARA O USUÁRIO SABER QUE PODE CLICAR */}
        <View style={styles.tipContainer}>

        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBox: { position: 'absolute', top: 50, left: 20, right: 20, zIndex: 10, flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, elevation: 5 },
  input: { flex: 1, padding: 15 },
  btn: { padding: 15, backgroundColor: 'tomato', borderTopRightRadius: 8, borderBottomRightRadius: 8 },
  
  // Estilo da dica no rodapé
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