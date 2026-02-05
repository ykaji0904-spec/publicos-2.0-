'use client';

// PublicOS 2.0 - Main Map Container
// Mapbox GL JS v3 + deck.gl with Interleaved Rendering

import { useEffect, useRef, useCallback, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { ScatterplotLayer, PathLayer } from '@deck.gl/layers';
import { useMapStore } from '@/store/mapStore';
import type { ViewState, DroneData, CursorPosition } from '@/types/map';

import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox Access Token (public token for demo - replace with your own)
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoicHVibGljb3MiLCJhIjoiY2x4eXpkZmF5MDAwMTJxcHRveHV5OWRzcyJ9.placeholder';

interface MapContainerProps {
  className?: string;
}

export function MapContainer({ className = '' }: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const deckOverlay = useRef<MapboxOverlay | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const {
    viewState,
    setViewState,
    setMapInstance,
    drones,
    cursors,
    simulationParams,
    isSimulationRunning,
  } = useMapStore();

  // Initialize deck.gl layers
  const getDeckLayers = useCallback(() => {
    const layers = [];

    // Drone Layer (ScatterplotLayer for positions + IconLayer for 3D models)
    if (drones.length > 0) {
      layers.push(
        new ScatterplotLayer({
          id: 'drone-positions',
          data: drones,
          getPosition: (d: DroneData) => d.position,
          getRadius: 50,
          getFillColor: (d: DroneData) => {
            switch (d.status) {
              case 'flying': return [0, 200, 100, 200];
              case 'delivering': return [255, 165, 0, 200];
              case 'charging': return [100, 100, 255, 200];
              default: return [150, 150, 150, 200];
            }
          },
          pickable: true,
          radiusMinPixels: 8,
          radiusMaxPixels: 30,
        })
      );

      // Drone paths (simplified)
      interface DronePath {
        id: string;
        path: [number, number, number][];
        color: [number, number, number];
      }

      const dronePaths: DronePath[] = drones
        .filter(d => d.status === 'flying' || d.status === 'delivering')
        .map(d => ({
          id: d.id,
          path: [d.position, [d.position[0] + 0.001, d.position[1] + 0.001, d.position[2]]] as [number, number, number][],
          color: (d.status === 'flying' ? [0, 200, 100] : [255, 165, 0]) as [number, number, number],
        }));

      if (dronePaths.length > 0) {
        layers.push(
          new PathLayer<DronePath>({
            id: 'drone-paths',
            data: dronePaths,
            getPath: (d: DronePath) => d.path,
            getColor: (d: DronePath) => d.color,
            getWidth: 3,
            widthMinPixels: 2,
          })
        );
      }
    }

    // Cursor Layer (for collaborative editing)
    if (cursors.length > 0) {
      layers.push(
        new ScatterplotLayer({
          id: 'user-cursors',
          data: cursors,
          getPosition: (d: CursorPosition) => [d.longitude, d.latitude],
          getRadius: 20,
          getFillColor: (d: CursorPosition) => {
            // Parse hex color to RGB
            const hex = d.color.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return [r, g, b, 200];
          },
          pickable: true,
          radiusMinPixels: 10,
          radiusMaxPixels: 20,
        })
      );
    }

    // Wind Particles Layer (when simulation is running)
    if (isSimulationRunning && simulationParams.windSpeed > 0) {
      // Generate wind particles
      const windParticles = generateWindParticles(viewState, simulationParams);
      layers.push(
        new ScatterplotLayer({
          id: 'wind-particles',
          data: windParticles,
          getPosition: (d: { position: [number, number, number] }) => d.position,
          getRadius: 10,
          getFillColor: [200, 220, 255, 100],
          radiusMinPixels: 1,
          radiusMaxPixels: 3,
        })
      );
    }

    return layers;
  }, [drones, cursors, isSimulationRunning, simulationParams, viewState]);

  // Initialize Mapbox and deck.gl
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      pitch: viewState.pitch,
      bearing: viewState.bearing,
      antialias: true,
      projection: 'globe' as unknown as mapboxgl.Projection,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

    // Initialize deck.gl overlay with interleaved mode
    deckOverlay.current = new MapboxOverlay({
      interleaved: true, // Enable depth buffer sharing
      layers: getDeckLayers(),
    });

    map.current.addControl(deckOverlay.current as unknown as mapboxgl.IControl);

    map.current.on('load', () => {
      if (!map.current) return;
      setMapLoaded(true);
      setMapInstance(map.current);

      // Add 3D terrain
      map.current.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      });

      map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });

      // Add sky atmosphere for globe view
      map.current.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 90.0],
          'sky-atmosphere-sun-intensity': 15,
        },
      });

      // Add 3D buildings
      const layers = map.current.getStyle().layers;
      const labelLayerId = layers?.find(
        (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
      )?.id;

      map.current.addLayer(
        {
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 12,
          paint: {
            'fill-extrusion-color': '#242424',
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': 0.8,
          },
        },
        labelLayerId
      );
    });

    // Sync view state changes
    map.current.on('move', () => {
      if (!map.current) return;
      const center = map.current.getCenter();
      setViewState({
        longitude: center.lng,
        latitude: center.lat,
        zoom: map.current.getZoom(),
        pitch: map.current.getPitch(),
        bearing: map.current.getBearing(),
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update deck.gl layers when data changes
  useEffect(() => {
    if (deckOverlay.current) {
      deckOverlay.current.setProps({
        layers: getDeckLayers(),
      });
    }
  }, [getDeckLayers]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Loading Overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-cyan-400 font-mono">PublicOS 2.0 Loading...</p>
          </div>
        </div>
      )}

      {/* Map Info Overlay */}
      <div className="absolute bottom-4 right-4 bg-gray-900/90 text-white text-xs font-mono p-2 rounded z-10">
        <div>Lng: {viewState.longitude.toFixed(4)}</div>
        <div>Lat: {viewState.latitude.toFixed(4)}</div>
        <div>Zoom: {viewState.zoom.toFixed(2)}</div>
        <div>Pitch: {viewState.pitch.toFixed(1)}°</div>
      </div>
    </div>
  );
}

// Helper function to generate wind particles
function generateWindParticles(
  viewState: ViewState,
  params: { windSpeed: number; windDirection: number }
): Array<{ position: [number, number, number] }> {
  const particles: Array<{ position: [number, number, number] }> = [];
  const count = Math.min(params.windSpeed * 20, 200);
  const range = 0.01 / viewState.zoom;

  for (let i = 0; i < count; i++) {
    particles.push({
      position: [
        viewState.longitude + (Math.random() - 0.5) * range * 10,
        viewState.latitude + (Math.random() - 0.5) * range * 10,
        50 + Math.random() * 200,
      ],
    });
  }

  return particles;
}

export default MapContainer;
