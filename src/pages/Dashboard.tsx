import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Leaf,
  CloudSun,
  FlaskConical,
  Droplets,
  Bell,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Sprout,
  Thermometer,
  CloudRain,
} from 'lucide-react';
import { PageHeader, StatusDot } from '@/components/ui';
import { getWeather } from '@/lib/api';
import { store } from '@/lib/store';
import type {
  CropResult,
  SoilResult,
  WeatherData,
  PageKey,
} from '@/lib/types';

export default function Dashboard({
  onNavigate,
}: {
  onNavigate: (p: PageKey) => void;
}) {
  const [crop, setCrop] = useState<CropResult | null>(null);
  const [soil, setSoil] = useState<SoilResult | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = () => {
    setCrop(store.getCrop());
    setSoil(store.getSoil());
    setWeather(store.getWeather());
  };

  useEffect(() => {
    load();
  }, []);

  const refreshWeather = async () => {
    setRefreshing(true);
    try {
      const w = await getWeather(weather?.location ?? '');
      setWeather(w);
      store.setWeather(w);
    } catch {
      // keep existing
    } finally {
      setRefreshing(false);
    }
  };

  const cropStatus: 'good' | 'warn' | 'bad' | 'idle' =
    !crop ? 'idle' : crop.isHealthy ? 'good' : 'bad';
  const soilStatus: 'good' | 'warn' | 'bad' | 'idle' = !soil
    ? 'idle'
    : soil.status === 'Nutrient Balanced'
    ? 'good'
    : soil.status === 'Slight Imbalance'
    ? 'warn'
    : 'bad';
  const weatherStatus: 'good' | 'warn' | 'bad' | 'idle' = !weather
    ? 'idle'
    : weather.alerts.length > 1
    ? 'warn'
    : 'good';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <PageHeader
          eyebrow="Overview"
          title="Farmer Dashboard"
          subtitle="Everything in one place — crop health, weather, irrigation, soil, and alerts. Updates as you use the other tools."
          icon={<LayoutDashboard className="w-8 h-8 text-ag-600" />}
        />
        <button
          onClick={refreshWeather}
          disabled={refreshing}
          className="btn-secondary shrink-0"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
          />
          Refresh weather
        </button>
      </div>

      {/* Status summary strip */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard
          label="Crop Health"
          status={cropStatus}
          value={crop ? (crop.isHealthy ? 'Healthy' : crop.disease) : 'No scan'}
          icon={Leaf}
        />
        <SummaryCard
          label="Weather"
          status={weatherStatus}
          value={weather ? `${weather.temperatureC}°C · ${weather.condition}` : 'No data'}
          icon={CloudSun}
        />
        <SummaryCard
          label="Soil Health"
          status={soilStatus}
          value={soil ? soil.status : 'No test'}
          icon={FlaskConical}
        />
        <SummaryCard
          label="Farm Alerts"
          status={weather && weather.alerts.length > 1 ? 'warn' : 'good'}
          value={
            weather
              ? `${weather.alerts.length} active`
              : 'No data'
          }
          icon={Bell}
        />
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        {/* Crop Health */}
        <DashCard
          title="Crop Health"
          icon={Leaf}
          onAction={() => onNavigate('crop')}
          actionLabel="Scan a crop"
        >
          {crop ? (
            <div>
              <div className="flex items-center gap-3">
                {crop.imageDataUrl && (
                  <img
                    src={crop.imageDataUrl}
                    alt="Last scan"
                    className="w-16 h-16 rounded-lg object-cover border border-ag-100"
                  />
                )}
                <div>
                  <div className="text-xs text-ag-600 font-semibold uppercase">
                    {crop.crop}
                  </div>
                  <div
                    className={`font-bold ${
                      crop.isHealthy ? 'text-ag-700' : 'text-red-700'
                    }`}
                  >
                    {crop.isHealthy ? 'Healthy' : crop.disease}
                  </div>
                  <div className="text-xs text-ag-600">
                    {Math.round(crop.confidence * 100)}% confidence
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm text-ag-700 line-clamp-3">
                {crop.recommendation}
              </p>
              <p className="mt-2 text-xs text-ag-500">
                {timeAgo(crop.createdAt)}
              </p>
            </div>
          ) : (
            <EmptyState text="No crop scan yet. Upload a leaf photo to see results here." />
          )}
        </DashCard>

        {/* Disease Detection Status */}
        <DashCard
          title="Disease Detection Status"
          icon={AlertCircle}
          onAction={() => onNavigate('crop')}
          actionLabel="New scan"
        >
          <div className="flex items-center gap-3">
            <StatusDot status={cropStatus} />
            <span className="font-semibold text-ag-900">
              {!crop
                ? 'Awaiting first scan'
                : crop.isHealthy
                ? 'No disease detected'
                : 'Disease detected'}
            </span>
          </div>
          <p className="mt-3 text-sm text-ag-700">
            {crop
              ? `Last checked: ${crop.crop} — ${crop.disease}.`
              : 'Run a crop disease scan to populate this status.'}
          </p>
        </DashCard>

        {/* Weather */}
        <DashCard
          title="Weather"
          icon={CloudSun}
          onAction={() => onNavigate('advisory')}
          actionLabel="Full advisory"
        >
          {weather ? (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-ag-950 text-2xl">
                    {weather.temperatureC}°C
                  </div>
                  <div className="text-sm text-ag-600">
                    {weather.condition} · {weather.location}
                  </div>
                </div>
                <div className="text-right text-xs text-ag-600 space-y-1">
                  <div className="flex items-center gap-1.5 justify-end">
                    <Droplets className="w-3.5 h-3.5" /> {weather.humidity}%
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <CloudRain className="w-3.5 h-3.5" /> {weather.rainfallMm}mm
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <Thermometer className="w-3.5 h-3.5" /> {weather.temperatureC}°
                  </div>
                </div>
              </div>
              <p className="mt-2 text-xs text-ag-500">
                {timeAgo(weather.fetchedAt)}
              </p>
            </div>
          ) : (
            <EmptyState text="No weather data yet. Open Farm Advisory to load it." />
          )}
        </DashCard>

        {/* Irrigation */}
        <DashCard
          title="Irrigation"
          icon={Droplets}
          onAction={() => onNavigate('advisory')}
          actionLabel="Advisory"
        >
          {weather ? (
            <div className="flex items-start gap-2 text-sm text-ag-700 bg-sky-50 border border-sky-100 rounded-xl p-3">
              <Droplets className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
              <span>{weather.irrigationAdvice}</span>
            </div>
          ) : (
            <EmptyState text="Irrigation guidance appears after loading weather." />
          )}
        </DashCard>

        {/* Soil Health */}
        <DashCard
          title="Soil Health"
          icon={FlaskConical}
          onAction={() => onNavigate('soil')}
          actionLabel="New test"
        >
          {soil ? (
            <div>
              <div className="flex items-center gap-2">
                <StatusDot status={soilStatus} />
                <span className="font-semibold text-ag-900">
                  {soil.status}
                </span>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-ag-50/60 rounded-lg p-2">
                  <dt className="text-ag-600 font-semibold">pH</dt>
                  <dd className="font-bold text-ag-950">
                    {soil.input.ph} · {soil.phStatus.split('—')[0].trim()}
                  </dd>
                </div>
                <div className="bg-ag-50/60 rounded-lg p-2">
                  <dt className="text-ag-600 font-semibold">NPK</dt>
                  <dd className="font-bold text-ag-950">
                    {soil.input.nitrogen}/{soil.input.phosphorus}/{soil.input.potassium}
                  </dd>
                </div>
              </dl>
              <p className="mt-2 text-xs text-ag-500">
                {timeAgo(soil.createdAt)}
              </p>
            </div>
          ) : (
            <EmptyState text="No soil test yet. Enter pH and NPK to see status." />
          )}
        </DashCard>

        {/* Farm Alerts */}
        <DashCard
          title="Farm Alerts"
          icon={Bell}
          onAction={() => onNavigate('advisory')}
          actionLabel="View advisory"
        >
          {weather ? (
            <ul className="space-y-2">
              {weather.alerts.map((a, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-ag-700 bg-amber-50/70 border border-amber-100 rounded-lg p-2.5"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState text="Alerts appear once weather data is loaded." />
          )}
        </DashCard>
      </div>

      {/* Quick actions */}
      <div className="mt-8 card p-6 bg-gradient-to-br from-ag-50 to-white">
        <h3 className="font-bold text-ag-950 flex items-center gap-2">
          <Sprout className="w-5 h-5 text-ag-600" />
          Quick actions
        </h3>
        <div className="mt-4 flex flex-wrap gap-3">
          {([
            ['crop', 'Check My Crop', Leaf],
            ['advisory', 'Farm Advisory', CloudSun],
            ['soil', 'Soil Health', FlaskConical],
          ] as const).map(([p, label, Icon]) => (
            <button
              key={p}
              onClick={() => onNavigate(p)}
              className="btn-secondary"
            >
              <Icon className="w-4 h-4" />
              {label}
              <ArrowRight className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  status,
  value,
  icon: Icon,
}: {
  label: string;
  status: 'good' | 'warn' | 'bad' | 'idle';
  value: string;
  icon: typeof Leaf;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-ag-600 uppercase tracking-wider">
          {label}
        </span>
        <Icon className="w-4 h-4 text-ag-400" />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <StatusDot status={status} />
        <span className="font-bold text-ag-950 text-sm leading-tight">
          {value}
        </span>
      </div>
    </div>
  );
}

function DashCard({
  title,
  icon: Icon,
  children,
  onAction,
  actionLabel,
}: {
  title: string;
  icon: typeof Leaf;
  children: React.ReactNode;
  onAction: () => void;
  actionLabel: string;
}) {
  return (
    <div className="card p-5 flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-ag-950 flex items-center gap-2">
          <Icon className="w-5 h-5 text-ag-600" />
          {title}
        </h3>
        <button
          onClick={onAction}
          className="text-xs font-semibold text-ag-600 hover:text-ag-700 hover:underline flex items-center gap-1"
        >
          {actionLabel}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="mt-3 flex-1">{children}</div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="grid place-items-center py-6 text-center text-ag-500">
      <CheckCircle2 className="w-8 h-8 mb-1.5 opacity-40" />
      <p className="text-xs leading-relaxed">{text}</p>
    </div>
  );
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'Just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
