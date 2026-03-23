import { create } from 'zustand';
import type { MapStore } from '../types';

const DEFAULT_CENTER = { lat: 55.7558, lng: 37.6173 }; // Москва
const DEFAULT_ZOOM = 10;

export const useMapStore = create<MapStore>((set) => ({
  // State
  center: DEFAULT_CENTER,
  zoom: DEFAULT_ZOOM,
  markers: [],
  selectedMarkerId: null,

  // Actions
  setCenter: (center) => set({ center }),

  setZoom: (zoom) => set({ zoom }),

  addMarker: (marker) =>
    set((state) => ({
      markers: [
        ...state.markers,
        { ...marker, id: crypto.randomUUID() },
      ],
    })),

  removeMarker: (id) =>
    set((state) => ({
      markers: state.markers.filter((marker) => marker.id !== id),
      selectedMarkerId: state.selectedMarkerId === id ? null : state.selectedMarkerId,
    })),

  updateMarker: (id, updates) =>
    set((state) => ({
      markers: state.markers.map((marker) =>
        marker.id === id ? { ...marker, ...updates } : marker
      ),
    })),

  selectMarker: (id) => set({ selectedMarkerId: id }),

  resetMap: () =>
    set({
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      markers: [],
      selectedMarkerId: null,
    }),
}));
