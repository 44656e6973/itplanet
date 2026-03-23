import { useMapStore } from '../stores/mapStore';

/**
 * Хук для получения данных о маркерах
 */
export const useMarkers = () => {
  const markers = useMapStore((state) => state.markers);
  const addMarker = useMapStore((state) => state.addMarker);
  const removeMarker = useMapStore((state) => state.removeMarker);
  const updateMarker = useMapStore((state) => state.updateMarker);

  return { markers, addMarker, removeMarker, updateMarker };
};

/**
 * Хук для управления видом карты
 */
export const useMapView = () => {
  const center = useMapStore((state) => state.center);
  const zoom = useMapStore((state) => state.zoom);
  const setCenter = useMapStore((state) => state.setCenter);
  const setZoom = useMapStore((state) => state.setZoom);
  const resetMap = useMapStore((state) => state.resetMap);

  return { center, zoom, setCenter, setZoom, resetMap };
};

/**
 * Хук для работы с выбранным маркером
 */
export const useSelectedMarker = () => {
  const selectedMarkerId = useMapStore((state) => state.selectedMarkerId);
  const selectMarker = useMapStore((state) => state.selectMarker);
  const selectedMarker = useMapStore((state) =>
    state.markers.find((m) => m.id === state.selectedMarkerId)
  );

  return { selectedMarkerId, selectedMarker, selectMarker };
};
