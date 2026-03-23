import { useState } from 'react';
import { Map } from '../components/map/Map';
import { AddMarkerForm } from '../components/map/AddMarkerForm';
import { Header } from '../components/common/Header';
import { useMarkers, useMapView } from '../hooks/useMap';
import type { Coordinates } from '../types';

export function MapPage() {
  const [showAddMarker, setShowAddMarker] = useState(false);
  const [clickPosition, setClickPosition] = useState<Coordinates | null>(null);
  const { markers } = useMarkers();
  const { center, zoom, resetMap } = useMapView();

  const handleMapClick = (coords: Coordinates) => {
    setClickPosition(coords);
    setShowAddMarker(true);
  };

  const handleCloseForm = () => {
    setShowAddMarker(false);
    setClickPosition(null);
  };

  return (
    <div className="relative h-screen w-screen">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1001]">
        <Header />
      </div>

      {/* Карта */}
      <Map onMapClick={handleMapClick} />

      {/* UI панель */}
      <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-4 min-w-[200px]">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Панель управления</h2>
        
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            <p>Маркеров: <span className="font-medium text-gray-900">{markers.length}</span></p>
            <p>Центр: <span className="font-mono text-gray-900">{center.lat.toFixed(4)}, {center.lng.toFixed(4)}</span></p>
            <p>Зум: <span className="font-medium text-gray-900">{zoom}</span></p>
          </div>

          <button
            onClick={resetMap}
            className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
          >
            Сбросить карту
          </button>
        </div>
      </div>

      {/* Кнопка помощи */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur rounded-lg shadow-lg p-3 max-w-xs">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">Кликните по карте</span> чтобы добавить маркер
        </p>
      </div>

      {/* Форма добавления маркера */}
      {showAddMarker && clickPosition && (
        <AddMarkerForm position={clickPosition} onClose={handleCloseForm} />
      )}
    </div>
  );
}
