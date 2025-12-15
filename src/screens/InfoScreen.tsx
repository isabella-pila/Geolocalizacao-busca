import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../context/LocationContext';

// --- 1. FUNÇÃO DE CÁLCULO (Pode ficar fora do componente) ---
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export default function InfoScreen() {
  // --- 2. IMPORTANTE: Adicionei o 'currentLocation' aqui ---
  const { searchResult, currentLocation } = useLocation();

  if (!searchResult) {
    return (
      <View style={styles.center}>
        <Text>Nenhuma pesquisa realizada ainda.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Resultado da Busca</Text>
        
        <Text style={styles.label}>Local: {searchResult.title}</Text>
        <Text style={styles.label}>Endereço: {searchResult.address}</Text>
        
        <View style={styles.divider} />

        {/* --- 3. BLOCO DA DISTÂNCIA --- */}
        <View style={styles.row}>
            <Text style={styles.labelBold}>Distância até você:</Text>
            <Text style={{color: 'tomato', fontWeight: 'bold'}}>
                {currentLocation ? (
                    getDistance(
                        currentLocation.coords.latitude, 
                        currentLocation.coords.longitude,
                        searchResult.latitude,
                        searchResult.longitude
                    ).toFixed(2) + ' km'
                ) : 'Aguardando GPS...'}
            </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
            <Text style={styles.labelBold}>Latitude:</Text>
            <Text>{searchResult.latitude.toFixed(5)}</Text>
        </View>

        <View style={styles.row}>
            <Text style={styles.labelBold}>Longitude:</Text>
            <Text>{searchResult.longitude.toFixed(5)}</Text>
        </View>

        <View style={styles.row}>
            <Text style={styles.labelBold}>Altitude:</Text>
            <Text>
                {searchResult.altitude ? `${searchResult.altitude.toFixed(2)} m` : 'Não disponível'}
            </Text>
        </View>

        <View style={styles.row}>
            <Text style={styles.labelBold}>Acurácia:</Text>
            <Text>
                {searchResult.accuracy ? `${searchResult.accuracy.toFixed(2)} m` : 'Não disponível'}
            </Text>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f4' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: 'tomato' },
  label: { fontSize: 16, marginBottom: 5, color: '#333' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  labelBold: { fontWeight: 'bold', color: '#555' }
});