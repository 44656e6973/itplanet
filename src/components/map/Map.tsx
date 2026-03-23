import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import type { LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapStore } from '../../stores/mapStore';
import { useMarkers, useSelectedMarker } from '../../hooks/useMap';
import type { Coordinates } from '../../types';

// Компонент для обработки событий карты
function MapEventsHandler({ onMapClick }: { onMapClick?: (coords: Coordinates) => void }) {
  useMapEvents({
    click: (e: LeafletMouseEvent) => {
      if (onMapClick) {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
    zoomend: () => {
      const zoom = useMapStore.getState().zoom;
      useMapStore.setState({ zoom });
    },
    moveend: () => {
      const center = useMapStore.getState().center;
      useMapStore.setState({ center });
    },
  });

  return null;
}

interface MapProps {
  className?: string;
  onMarkerClick?: (id: string) => void;
  onMapClick?: (coords: Coordinates) => void;
}

export function Map({ className = 'h-full w-full', onMarkerClick, onMapClick }: MapProps) {
  const { markers, removeMarker } = useMarkers();
  const { selectMarker } = useSelectedMarker();

  const handleMarkerClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    selectMarker(id);
    onMarkerClick?.(id);
  };

  return (
    <MapContainer
      className={className}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.position.lat, marker.position.lng]}
          eventHandlers={{
            click: (e: LeafletMouseEvent) => {
              e.originalEvent.stopPropagation();
              handleMarkerClick(marker.id, e as unknown as React.MouseEvent);
            },
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold text-gray-900">{marker.title}</h3>
              {marker.description && (
                <p className="text-sm text-gray-600 mt-1">{marker.description}</p>
              )}
              <button
                onClick={() => removeMarker(marker.id)}
                className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
              >
                Удалить
              </button>
            </div>
          </Popup>
        </Marker>
      ))}

      <MapEventsHandler onMapClick={onMapClick} />
    </MapContainer>
  );
}
