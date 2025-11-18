export interface SceneSettings {
  sunAzimuth: number;   // 0-360
  sunElevation: number; // 0-90
  windIntensity: number; // 0-1
  showTourists: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum LibertyPart {
  TORCH = 'Torch',
  CROWN = 'Crown',
  TABLET = 'Tablet',
  ROBE = 'Robe',
  PEDESTAL = 'Pedestal'
}