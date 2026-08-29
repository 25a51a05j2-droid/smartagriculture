export type PageKey = 'home' | 'crop' | 'advisory' | 'soil' | 'dashboard';

export interface CropResult {
  success: boolean;
  crop: string;
  disease: string;
  isHealthy: boolean;
  confidence: number;
  recommendation: string;
  imageDataUrl: string | null;
  createdAt: number;
}

export interface SoilInput {
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

export interface SoilResult {
  success: boolean;
  status: 'Nutrient Balanced' | 'Slight Imbalance' | 'Imbalanced';
  phStatus: string;
  npkStatus: string;
  recommendation: string;
  input: SoilInput;
  createdAt: number;
}

export interface WeatherData {
  location: string;
  temperatureC: number;
  humidity: number;
  rainfallMm: number;
  condition: string;
  icon: string;
  irrigationAdvice: string;
  alerts: string[];
  cropCare: string[];
  fetchedAt: number;
}

export interface DashboardState {
  lastCrop: CropResult | null;
  lastSoil: SoilResult | null;
  lastWeather: WeatherData | null;
}
