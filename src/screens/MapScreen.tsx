import React, { useState, useRef } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ActivityIndicator, Keyboard, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
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
      // Busca as coordenadas
      const result = await Location.geocodeAsync(searchText);
      
      if (result.length > 0) {
        // AQUI ESTÁ A MUDANÇA: Pegamos altitude e accuracy também
        const { latitude, longitude, altitude, accuracy } = result[0];
        
        mapRef.current?.animateToRegion({ latitude, longitude, latitudeDelta: 0.005, longitudeDelta: 0.005 });
        
        // Busca o nome da rua (Reverso)
        const reverse = await Location.reverseGeocodeAsync({ latitude, longitude });
        const addressText = reverse[0] ? `${reverse[0].street}, ${reverse[0].district}` : searchText;

        // Gravamos TUDO no contexto
        setSearchResult({
            latitude,
            longitude,
            address: addressText,
            title: searchText,
            altitude: altitude, // Salva altitude
            accuracy: accuracy  // Salva acurácia
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
            style={{flex: 1}}
            initialRegion={{
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                latitudeDelta: 0.01, longitudeDelta: 0.01
            }}
        >
            <Marker coordinate={currentLocation.coords} title="Eu" pinColor="blue" />

            {/* Marcador da Pesquisa com Descrição Completa */}
            {searchResult && (
                <Marker 
                    coordinate={{ 
                        latitude: searchResult.latitude, 
                        longitude: searchResult.longitude 
                    }} 
                    title={searchResult.title}
                    // Exibe um resumo ao clicar no pino
                    description={`Alt: ${searchResult.altitude?.toFixed(1) || 'N/A'}m | Acc: ${searchResult.accuracy?.toFixed(1) || 'N/A'}m`}
                    pinColor="tomato"
                />
            )}
        </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBox: { position: 'absolute', top: 50, left: 20, right: 20, zIndex: 10, flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, elevation: 5 },
  input: { flex: 1, padding: 15 },
  btn: { padding: 15, backgroundColor: 'tomato', borderTopRightRadius: 8, borderBottomRightRadius: 8 }
});