import type { CropResult, SoilResult, WeatherData } from './types';

const KEYS = {
  crop: 'sa.lastCrop',
  soil: 'sa.lastSoil',
  weather: 'sa.lastWeather',
};

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full (image dataUrl may be large) — fail silently
  }
}

export const store = {
  getCrop: () => read<CropResult>(KEYS.crop),
  setCrop: (v: CropResult) => write(KEYS.crop, v),
  getSoil: () => read<SoilResult>(KEYS.soil),
  setSoil: (v: SoilResult) => write(KEYS.soil, v),
  getWeather: () => read<WeatherData>(KEYS.weather),
  setWeather: (v: WeatherData) => write(KEYS.weather, v),
  clear: () => {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  },
};
