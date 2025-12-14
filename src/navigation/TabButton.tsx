import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import MapScreen from '../screens/MapScreen';
import InfoScreen from '../screens/InfoScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: 'tomato' }}>
      
      <Tab.Screen 
        name="Mapa" 
        component={MapScreen} // <--- Olha como ficou limpo!
        options={{ tabBarIcon: ({color}) => <Ionicons name="map" size={24} color={color}/> }}
      />

      <Tab.Screen 
        name="Dados" 
        component={InfoScreen} // <--- Sem props!
        options={{ 
            headerShown: true, headerTitle: "Detalhes",
            tabBarIcon: ({color}) => <Ionicons name="document-text" size={24} color={color}/> 
        }}
      />
    </Tab.Navigator>
  );
}