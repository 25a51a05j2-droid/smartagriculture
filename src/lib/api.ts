import type {
  CropResult,
  SoilInput,
  SoilResult,
  WeatherData,
} from './types';

/**
 * Simulated backend API.
 *
 * This module mimics a Flask backend with latency and graceful fallbacks.
 * The response shapes match the documented /api/predict, /api/soil and
 * /api/weather endpoints so the real backend can be dropped in later
 * by swapping the function bodies for fetch() calls.
 */

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const CROPS = [
  {
    crop: 'Tomato',
    disease: 'Early Blight',
    isHealthy: false,
    recommendation:
      'Remove affected lower leaves and apply a copper-based fungicide. Improve airflow by staking plants and avoid overhead watering.',
  },
  {
    crop: 'Tomato',
    disease: 'Healthy',
    isHealthy: true,
    recommendation:
      'Crop looks healthy. Continue regular monitoring, consistent watering, and balanced fertilization.',
  },
  {
    crop: 'Maize',
    disease: 'Northern Corn Leaf Blight',
    isHealthy: false,
    recommendation:
      'Remove infected debris, rotate crops next season, and consider a foliar fungicide if infection is widespread.',
  },
  {
    crop: 'Maize',
    disease: 'Healthy',
    isHealthy: true,
    recommendation:
      'No disease symptoms detected. Maintain weed control and consistent soil moisture during tasseling.',
  },
  {
    crop: 'Potato',
    disease: 'Late Blight',
    isHealthy: false,
    recommendation:
      'Act fast — late blight spreads quickly. Destroy infected plants and apply a recommended fungicide. Avoid working with wet foliage.',
  },
  {
    crop: 'Potato',
    disease: 'Healthy',
    isHealthy: true,
    recommendation:
      'Healthy foliage. Keep hilling soil around stems and maintain even moisture to encourage tuber growth.',
  },
  {
    crop: 'Rice',
    disease: 'Brown Spot',
    isHealthy: false,
    recommendation:
      'Improve nutrient management (especially potassium) and use disease-free certified seed for the next planting.',
  },
  {
    crop: 'Rice',
    disease: 'Healthy',
    isHealthy: true,
    recommendation:
      'No signs of disease. Maintain proper water level in the field and monitor for pests during tillering.',
  },
  {
    crop: 'Apple',
    disease: 'Apple Scab',
    isHealthy: false,
    recommendation:
      'Rake and destroy fallen leaves. Apply a dormant spray before bud break and a fungicide during early growth.',
  },
  {
    crop: 'Apple',
    disease: 'Healthy',
    isHealthy: true,
    recommendation:
      'Leaves appear healthy. Maintain pruning for airflow and a regular scouting schedule.',
  },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function analyzeCrop(
  imageDataUrl: string
): Promise<CropResult> {
  if (!imageDataUrl) throw new Error('No image provided');
  await delay(1400 + Math.random() * 800);
  const sample = pick(CROPS);
  const confidence =
    sample.isHealthy
      ? 0.9 + Math.random() * 0.08
      : 0.72 + Math.random() * 0.23;
  return {
    success: true,
    crop: sample.crop,
    disease: sample.disease,
    isHealthy: sample.isHealthy,
    confidence: Math.round(confidence * 100) / 100,
    recommendation: sample.recommendation,
    imageDataUrl,
    createdAt: Date.now(),
  };
}

export async function analyzeSoil(input: SoilInput): Promise<SoilResult> {
  const { ph, nitrogen, phosphorus, potassium } = input;
  if (
    [ph, nitrogen, phosphorus, potassium].some(
      (v) => v === undefined || v === null || Number.isNaN(v)
    )
  ) {
    throw new Error('Missing soil values');
  }
  await delay(900 + Math.random() * 600);

  // ph status
  let phStatus = 'Optimal range (6.0–7.0)';
  if (ph < 5.5) phStatus = 'Acidic — consider liming';
  else if (ph < 6.0) phStatus = 'Slightly acidic';
  else if (ph > 7.5) phStatus = 'Alkaline — consider sulfur or organic matter';
  else if (ph > 7.0) phStatus = 'Slightly alkaline';

  // npk
  const ideal = { n: 50, p: 25, k: 40 };
  const diffs = {
    n: nitrogen - ideal.n,
    p: phosphorus - ideal.p,
    k: potassium - ideal.k,
  };
  const maxDiff = Math.max(Math.abs(diffs.n), Math.abs(diffs.p), Math.abs(diffs.k));
  let status: SoilResult['status'] = 'Nutrient Balanced';
  if (maxDiff > 25) status = 'Imbalanced';
  else if (maxDiff > 12) status = 'Slight Imbalance';

  const parts: string[] = [];
  if (diffs.n < -10) parts.push('Nitrogen is low — add composted manure or urea.');
  else if (diffs.n > 15) parts.push('Nitrogen is high — reduce N fertilizer to avoid lodging.');
  if (diffs.p < -10) parts.push('Phosphorus is low — apply bone meal or DAP.');
  if (diffs.k < -10) parts.push('Potassium is low — apply muriate of potash.');

  const recommendation =
    parts.length === 0
      ? 'NPK levels look balanced. Maintain current practices and re-test each season.'
      : parts.join(' ');

  const npkStatus =
    status === 'Nutrient Balanced'
      ? 'NPK within ideal range'
      : status === 'Slight Imbalance'
      ? 'Minor NPK deviation'
      : 'Significant NPK imbalance';

  return {
    success: true,
    status,
    phStatus,
    npkStatus,
    recommendation,
    input,
    createdAt: Date.now(),
  };
}

const WEATHER_CONDITIONS = [
  { condition: 'Sunny', icon: 'sun', temp: [26, 36], rain: [0, 2] },
  { condition: 'Partly Cloudy', icon: 'cloud-sun', temp: [22, 30], rain: [0, 5] },
  { condition: 'Cloudy', icon: 'cloud', temp: [20, 27], rain: [2, 12] },
  { condition: 'Light Rain', icon: 'cloud-rain', temp: [18, 24], rain: [8, 25] },
  { condition: 'Heavy Rain', icon: 'cloud-drizzle', temp: [17, 22], rain: [25, 60] },
];

function randInt(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}

export async function getWeather(location: string): Promise<WeatherData> {
  await delay(800 + Math.random() * 700);
  const w = pick(WEATHER_CONDITIONS);
  const temperatureC = randInt(w.temp[0], w.temp[1]);
  const humidity = randInt(45, 90);
  const rainfallMm = randInt(w.rain[0], w.rain[1]);
  const loc = location.trim() || 'Your Region';

  let irrigationAdvice: string;
  if (rainfallMm > 25)
    irrigationAdvice = 'Skip irrigation today — heavy rainfall expected. Ensure drainage to avoid waterlogging.';
  else if (rainfallMm > 8)
    irrigationAdvice = 'Reduce irrigation — light rainfall will cover most crop water needs.';
  else if (temperatureC > 32)
    irrigationAdvice = 'Irrigate early morning or late evening. High temperature increases crop water demand.';
  else
    irrigationAdvice = 'Apply regular irrigation. Monitor soil moisture before the next watering.';

  const alerts: string[] = [];
  if (temperatureC > 34)
    alerts.push('Heat advisory: provide shade or mulch to sensitive crops.');
  if (rainfallMm > 30)
    alerts.push('Waterlogging risk in low-lying fields — clear drainage channels.');
  if (humidity > 80)
    alerts.push('High humidity raises fungal disease risk — scout for leaf spots and blight.');
  if (alerts.length === 0)
    alerts.push('No active alerts. Conditions are favorable for field work.');

  const cropCare: string[] = [
    `Current weather suits ${temperatureC > 28 ? 'heat-tolerant' : 'most'} crops. Keep monitoring leaf health.`,
    rainfallMm < 5
      ? 'Dry spell — water deeply and mulch to retain soil moisture.'
      : 'Moisture adequate — avoid over-irrigating.',
    'Inspect crops for pests in the early morning when insects are active.',
  ];

  return {
    location: loc,
    temperatureC,
    humidity,
    rainfallMm,
    condition: w.condition,
    icon: w.icon,
    irrigationAdvice,
    alerts,
    cropCare,
    fetchedAt: Date.now(),
  };
}
