import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

// Telas
import MapScreen from '../screens/MapScreen';
import InfoScreen from '../screens/InfoScreen'; // Nome correto do componente

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Mapa"
      screenOptions={{
        drawerActiveTintColor: 'tomato',
        drawerInactiveTintColor: 'gray',
        headerTitleAlign: 'center',
        headerTintColor: '#333',
        headerStyle: {
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
        },
      }}
    >
      {/* ================= TELA 1: MAPA ================= */}
      <Drawer.Screen
        name="Mapa"
        component={MapScreen} // O Mapa usa o useLocation() internamente
        options={{
          headerTitle: 'Geolocalização',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />

      {/* ================= TELA 2: DADOS ================= */}
      <Drawer.Screen
        name="Dados" // Mudei para "Dados" para fazer sentido com o conteúdo
        component={InfoScreen} // A InfoScreen usa o useLocation() internamente
        options={{
          headerTitle: 'Dados Técnicos',
          drawerIcon: ({ color, size }) => (
            // Ícone de prancheta/relatório
            <Ionicons name="clipboard-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}