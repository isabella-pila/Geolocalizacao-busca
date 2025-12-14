import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as Location from 'expo-location';

import TabNavigator from './src/navigation/TabButton';
import { LocationProvider, useLocation } from './src/context/LocationContext';
import DrawerNavigator from './src/navigation/DrawerNavigator';

// Componente auxiliar para carregar o GPS inicial
function AppContent() {
  const { setCurrentLocation } = useLocation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      let loc = await Location.getCurrentPositionAsync({});
      setCurrentLocation(loc);
    })();
  }, []);

  return <DrawerNavigator />;
}

export default function App() {
  return (
    // Envolvemos o App inteiro no Provider
    <LocationProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </LocationProvider>
  );
}