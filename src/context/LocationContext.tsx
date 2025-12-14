import React, { createContext, useState, useContext, ReactNode } from 'react';
import * as Location from 'expo-location';

// 1. ATUALIZAMOS A TIPAGEM AQUI
export interface SearchResult {
  latitude: number;
  longitude: number;
  address: string;
  title: string;
  // Novos campos opcionais (?)
  altitude?: number | null;
  accuracy?: number | null;
}

interface LocationContextData {
  currentLocation: Location.LocationObject | null;
  searchResult: SearchResult | null;
  setCurrentLocation: (loc: Location.LocationObject | null) => void;
  setSearchResult: (res: SearchResult | null) => void;
}

const LocationContext = createContext<LocationContextData>({} as LocationContextData);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  return (
    <LocationContext.Provider 
      value={{ currentLocation, setCurrentLocation, searchResult, setSearchResult }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation deve ser usado dentro de um LocationProvider');
  return context;
}