import { useRef } from 'react';
import type { StyleSpecification } from 'maplibre-gl';
import MapGL, { Marker, type MapRef } from 'react-map-gl/maplibre';
import type { MapMarker } from '../../types';

const MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {},
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#ECFFFD',
      },
    },
  ],
};

const DEFAULT_VIEW_STATE = {
  longitude: 60,
  latitude: 55,
  zoom: 3.05,
};

const PinIcon = () => (
  <svg
    aria-hidden="true"
    className="h-8 w-8 text-[#4b429e]"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 2.667c-4.785 0-8.667 3.88-8.667 8.666 0 6.5 8.667 18 8.667 18s8.667-11.5 8.667-18c0-4.785-3.882-8.666-8.667-8.666Zm0 12a3.333 3.333 0 1 1 0-6.667 3.333 3.333 0 0 1 0 6.667Z"
      fill="currentColor"
    />
  </svg>
);

const ZoomControl = ({ onZoomIn, onZoomOut }: { onZoomIn: () => void; onZoomOut: () => void }) => (
  <div className="pointer-events-none absolute inset-y-0 right-6 hidden items-center sm:flex">
    <div className="pointer-events-auto flex h-[390px] flex-col items-center justify-between py-2 text-[#a2aedf]">
      <button
        type="button"
        onClick={onZoomIn}
        className="text-[34px] leading-none transition-colors hover:text-[#615ab3]"
        aria-label="Увеличить карту"
      >
        +
      </button>
      <div className="relative flex-1">
        <div className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 rounded-full bg-[#aeb7e2]" />
        <div className="absolute left-1/2 top-3 h-4 w-4 -translate-x-1/2 rounded-full bg-[#98a6de]" />
      </div>
      <button
        type="button"
        onClick={onZoomOut}
        className="text-[34px] leading-none transition-colors hover:text-[#615ab3]"
        aria-label="Уменьшить карту"
      >
        -
      </button>
    </div>
  </div>
);

interface MapProps {
  className?: string;
  markers: MapMarker[];
}

export function Map({ className = 'h-full w-full', markers }: MapProps) {
  const mapRef = useRef<MapRef | null>(null);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <MapGL
        ref={mapRef}
        initialViewState={DEFAULT_VIEW_STATE}
        minZoom={2.2}
        maxZoom={6.2}
        dragRotate={false}
        touchZoomRotate={false}
        attributionControl={false}
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            longitude={marker.position.lng}
            latitude={marker.position.lat}
            anchor="bottom"
          >
            <div title={marker.title} className="drop-shadow-[0_4px_5px_rgba(75,66,158,0.15)]">
              <PinIcon />
            </div>
          </Marker>
        ))}
      </MapGL>

      <ZoomControl
        onZoomIn={() => mapRef.current?.zoomIn({ duration: 250 })}
        onZoomOut={() => mapRef.current?.zoomOut({ duration: 250 })}
      />
    </div>
  );
}
