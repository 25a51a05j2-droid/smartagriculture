import { useState } from 'react';
import {
  CloudSun,
  MapPin,
  Sun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  Droplets,
  Droplet,
  Thermometer,
  Bell,
  Sprout,
  Loader2,
  Search,
  AlertTriangle,
} from 'lucide-react';
import { PageHeader, ErrorBanner, toast } from '@/components/ui';
import { getWeather } from '@/lib/api';
import { store } from '@/lib/store';
import type { WeatherData } from '@/lib/types';

const ICONS: Record<string, typeof Sun> = {
  sun: Sun,
  'cloud-sun': Cloud,
  cloud: Cloud,
  'cloud-rain': CloudRain,
  'cloud-drizzle': CloudDrizzle,
};

export default function Advisory() {
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<WeatherData | null>(null);

  const fetchWeather = async (loc?: string) => {
    setLoading(true);
    setError('');
    try {
      const w = await getWeather(loc ?? location);
      setData(w);
      store.setWeather(w);
      toast('Weather updated', 'success');
    } catch {
      setError('Could not load weather. Showing is unavailable right now. Please try again.');
      toast('Weather fetch failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const WeatherIcon = data ? ICONS[data.icon] ?? Sun : Sun;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        eyebrow="Tool"
        title="Farm Advisory"
        subtitle="Get current weather, irrigation guidance, farm alerts, and general crop-care advice for your area."
        icon={<CloudSun className="w-8 h-8 text-ag-600" />}
      />

      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
        <span>
          Demo mode: weather values are simulated. A live weather API can be
          connected later using an environment variable — see the README.
        </span>
      </div>

      {/* Location input */}
      <div className="mt-6 card p-5">
        <label className="label" htmlFor="loc">
          Your location
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ag-400" />
            <input
              id="loc"
              className="input pl-10"
              placeholder="e.g. Pune, Maharashtra"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchWeather()}
            />
          </div>
          <button
            onClick={() => fetchWeather()}
            disabled={loading}
            className="btn-primary sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading…
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Get Advisory
              </>
            )}
          </button>
        </div>
        <p className="mt-2 text-xs text-ag-600">
          Leave blank to use a default region.
        </p>
      </div>

      {error && (
        <div className="mt-4">
          <ErrorBanner message={error} />
        </div>
      )}

      {data && !error && (
        <div className="mt-6 space-y-6 animate-fade-up">
          {/* Weather card */}
          <div className="card p-6 bg-gradient-to-br from-ag-600 to-ag-800 text-white relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <MapPin className="w-4 h-4" />
                  {data.location}
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <WeatherIcon className="w-12 h-12" />
                  <div>
                    <div className="text-4xl font-bold">
                      {data.temperatureC}°C
                    </div>
                    <div className="text-white/85 text-sm">
                      {data.condition}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                <Metric
                  icon={Droplets}
                  label="Humidity"
                  value={`${data.humidity}%`}
                />
                <Metric
                  icon={Droplet}
                  label="Rainfall"
                  value={`${data.rainfallMm}mm`}
                />
                <Metric
                  icon={Thermometer}
                  label="Temp"
                  value={`${data.temperatureC}°`}
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Irrigation */}
            <div className="card p-6">
              <h3 className="font-bold text-ag-950 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-sky-600" />
                Irrigation Advice
              </h3>
              <p className="mt-3 text-sm text-ag-700 leading-relaxed bg-sky-50 border border-sky-100 rounded-xl p-4">
                {data.irrigationAdvice}
              </p>
            </div>

            {/* Alerts */}
            <div className="card p-6">
              <h3 className="font-bold text-ag-950 flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-600" />
                Farm Alerts
              </h3>
              <ul className="mt-3 space-y-2">
                {data.alerts.map((a, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-ag-700 bg-amber-50/70 border border-amber-100 rounded-lg p-3"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Crop care */}
          <div className="card p-6">
            <h3 className="font-bold text-ag-950 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-ag-600" />
              General Crop-Care Advice
            </h3>
            <ul className="mt-3 grid sm:grid-cols-3 gap-3">
              {data.cropCare.map((c, i) => (
                <li
                  key={i}
                  className="rounded-xl bg-ag-50/70 border border-ag-100 p-4 text-sm text-ag-700"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-ag-500 text-center">
            Advisory data is simulated for demonstration.
          </p>
        </div>
      )}

      {!data && !error && !loading && (
        <div className="mt-6 card p-10 text-center text-ag-500">
          <CloudSun className="w-12 h-12 mx-auto opacity-50" />
          <p className="mt-3 text-sm">
            Enter a location and tap <strong>Get Advisory</strong> to see
            weather and farm guidance.
          </p>
        </div>
      )}
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Sun;
  label: string;
  value: string;
}) {
  return (
    <div className="text-center">
      <Icon className="w-5 h-5 mx-auto text-white/80" />
      <div className="mt-1 text-lg font-bold leading-none">{value}</div>
      <div className="text-[11px] text-white/70 mt-1">{label}</div>
    </div>
  );
}
