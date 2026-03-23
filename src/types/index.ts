// Типы для приложения

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MapMarker {
  id: string;
  position: Coordinates;
  title: string;
  description?: string;
}

export interface MapState {
  center: Coordinates;
  zoom: number;
  markers: MapMarker[];
  selectedMarkerId: string | null;
}

export interface MapActions {
  setCenter: (center: Coordinates) => void;
  setZoom: (zoom: number) => void;
  addMarker: (marker: Omit<MapMarker, 'id'>) => void;
  removeMarker: (id: string) => void;
  updateMarker: (id: string, marker: Partial<MapMarker>) => void;
  selectMarker: (id: string | null) => void;
  resetMap: () => void;
}

export type MapStore = MapState & MapActions;
