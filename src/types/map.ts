// PublicOS 2.0 - Map Types

export interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

export interface SimulationParams {
  windSpeed: number;
  windDirection: number;
  dronePayload: number;
  weatherCondition: 'clear' | 'rain' | 'typhoon' | 'snow';
}

export interface LayerConfig {
  id: string;
  type: 'scatterplot' | 'path' | 'polygon' | 'icon' | 'terrain' | 'buildings';
  visible: boolean;
  data?: unknown[];
  config?: Record<string, unknown>;
}

export interface CursorPosition {
  userId: string;
  userName: string;
  color: string;
  longitude: number;
  latitude: number;
  timestamp: number;
}

export interface DroneData {
  id: string;
  position: [number, number, number]; // [lng, lat, alt]
  heading: number;
  speed: number;
  battery: number;
  payload: number;
  status: 'idle' | 'flying' | 'charging' | 'delivering';
}

export interface WindParticle {
  id: number;
  position: [number, number, number];
  velocity: [number, number, number];
}

export interface Annotation {
  id: string;
  type: 'point' | 'line' | 'polygon' | 'text';
  coordinates: number[] | number[][] | number[][][];
  properties: {
    color?: string;
    text?: string;
    createdBy?: string;
    createdAt?: number;
  };
}
