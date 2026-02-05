// PublicOS 2.0 - Map State Store (Zustand)

import { create } from 'zustand';
import type {
  ViewState,
  SimulationParams,
  LayerConfig,
  DroneData,
  Annotation,
  CursorPosition,
} from '@/types/map';

// Default view: Tokyo
const DEFAULT_VIEW_STATE: ViewState = {
  longitude: 139.7671,
  latitude: 35.6812,
  zoom: 14,
  pitch: 45,
  bearing: -17.6,
};

const DEFAULT_SIMULATION_PARAMS: SimulationParams = {
  windSpeed: 5,
  windDirection: 180,
  dronePayload: 2.5,
  weatherCondition: 'clear',
};

interface MapState {
  // View State
  viewState: ViewState;
  setViewState: (viewState: ViewState) => void;
  flyTo: (target: Partial<ViewState>) => void;

  // Simulation Parameters
  simulationParams: SimulationParams;
  setSimulationParams: (params: Partial<SimulationParams>) => void;

  // Layers
  layers: LayerConfig[];
  addLayer: (layer: LayerConfig) => void;
  removeLayer: (layerId: string) => void;
  toggleLayerVisibility: (layerId: string) => void;
  updateLayerConfig: (layerId: string, config: Partial<LayerConfig>) => void;

  // Drone Fleet
  drones: DroneData[];
  setDrones: (drones: DroneData[]) => void;
  updateDrone: (droneId: string, data: Partial<DroneData>) => void;

  // Annotations
  annotations: Annotation[];
  addAnnotation: (annotation: Annotation) => void;
  removeAnnotation: (annotationId: string) => void;

  // Collaboration - Cursors
  cursors: CursorPosition[];
  setCursors: (cursors: CursorPosition[]) => void;

  // UI State
  isSimulationRunning: boolean;
  setSimulationRunning: (running: boolean) => void;
  selectedTool: 'select' | 'point' | 'line' | 'polygon' | 'measure';
  setSelectedTool: (tool: 'select' | 'point' | 'line' | 'polygon' | 'measure') => void;

  // Map Instance Reference (for direct API access)
  mapInstance: mapboxgl.Map | null;
  setMapInstance: (map: mapboxgl.Map | null) => void;
}

export const useMapStore = create<MapState>((set, get) => ({
  // View State
  viewState: DEFAULT_VIEW_STATE,
  setViewState: (viewState) => set({ viewState }),
  flyTo: (target) => {
    const map = get().mapInstance;
    if (map) {
      map.flyTo({
        center: [target.longitude ?? get().viewState.longitude, target.latitude ?? get().viewState.latitude],
        zoom: target.zoom ?? get().viewState.zoom,
        pitch: target.pitch ?? get().viewState.pitch,
        bearing: target.bearing ?? get().viewState.bearing,
        duration: 2000,
      });
    }
    set((state) => ({
      viewState: { ...state.viewState, ...target },
    }));
  },

  // Simulation Parameters
  simulationParams: DEFAULT_SIMULATION_PARAMS,
  setSimulationParams: (params) =>
    set((state) => ({
      simulationParams: { ...state.simulationParams, ...params },
    })),

  // Layers
  layers: [
    { id: 'terrain', type: 'terrain', visible: true },
    { id: 'buildings', type: 'buildings', visible: true },
  ],
  addLayer: (layer) =>
    set((state) => ({
      layers: [...state.layers, layer],
    })),
  removeLayer: (layerId) =>
    set((state) => ({
      layers: state.layers.filter((l) => l.id !== layerId),
    })),
  toggleLayerVisibility: (layerId) =>
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === layerId ? { ...l, visible: !l.visible } : l
      ),
    })),
  updateLayerConfig: (layerId, config) =>
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === layerId ? { ...l, ...config } : l
      ),
    })),

  // Drone Fleet
  drones: [],
  setDrones: (drones) => set({ drones }),
  updateDrone: (droneId, data) =>
    set((state) => ({
      drones: state.drones.map((d) =>
        d.id === droneId ? { ...d, ...data } : d
      ),
    })),

  // Annotations
  annotations: [],
  addAnnotation: (annotation) =>
    set((state) => ({
      annotations: [...state.annotations, annotation],
    })),
  removeAnnotation: (annotationId) =>
    set((state) => ({
      annotations: state.annotations.filter((a) => a.id !== annotationId),
    })),

  // Collaboration
  cursors: [],
  setCursors: (cursors) => set({ cursors }),

  // UI State
  isSimulationRunning: false,
  setSimulationRunning: (running) => set({ isSimulationRunning: running }),
  selectedTool: 'select',
  setSelectedTool: (tool) => set({ selectedTool: tool }),

  // Map Instance
  mapInstance: null,
  setMapInstance: (map) => set({ mapInstance: map }),
}));
