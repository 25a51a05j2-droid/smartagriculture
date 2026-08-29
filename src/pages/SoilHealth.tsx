import { useState } from 'react';
import {
  FlaskConical,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Info,
  RotateCcw,
} from 'lucide-react';
import { PageHeader, ErrorBanner, toast } from '@/components/ui';
import { analyzeSoil } from '@/lib/api';
import { store } from '@/lib/store';
import type { SoilInput, SoilResult } from '@/lib/types';

const FIELDS: {
  key: keyof SoilInput;
  label: string;
  unit: string;
  placeholder: string;
  min: number;
  max: number;
  hint: string;
}[] = [
  { key: 'ph', label: 'Soil pH', unit: 'pH', placeholder: '6.5', min: 0, max: 14, hint: 'Ideal 6.0–7.0' },
  { key: 'nitrogen', label: 'Nitrogen (N)', unit: 'kg/ha', placeholder: '50', min: 0, max: 300, hint: 'Ideal ~50' },
  { key: 'phosphorus', label: 'Phosphorus (P)', unit: 'kg/ha', placeholder: '25', min: 0, max: 200, hint: 'Ideal ~25' },
  { key: 'potassium', label: 'Potassium (K)', unit: 'kg/ha', placeholder: '40', min: 0, max: 300, hint: 'Ideal ~40' },
];

const empty: SoilInput = { ph: NaN, nitrogen: NaN, phosphorus: NaN, potassium: NaN };

export default function SoilHealth() {
  const [input, setInput] = useState<SoilInput>(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<SoilResult | null>(null);
  const [missing, setMissing] = useState<string[]>([]);

  const update = (key: keyof SoilInput, raw: string) => {
    const v = raw === '' ? NaN : Number(raw);
    setInput((p) => ({ ...p, [key]: v }));
  };

  const analyze = async () => {
    setError('');
    setResult(null);
    const miss = FIELDS.filter((f) => Number.isNaN(input[f.key])).map(
      (f) => f.label
    );
    if (miss.length > 0) {
      setMissing(miss);
      setError(`Please fill in all fields. Missing: ${miss.join(', ')}.`);
      return;
    }
    setMissing([]);
    setLoading(true);
    try {
      const res = await analyzeSoil(input);
      setResult(res);
      store.setSoil(res);
      toast('Soil assessment ready', 'success');
    } catch {
      setError('Could not analyze soil. Please try again.');
      toast('Soil analysis failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setInput(empty);
    setResult(null);
    setError('');
    setMissing([]);
  };

  const statusColor =
    result?.status === 'Nutrient Balanced'
      ? 'ag'
      : result?.status === 'Slight Imbalance'
      ? 'amber'
      : 'red';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        eyebrow="Tool"
        title="Soil Health"
        subtitle="Enter your soil pH and NPK values for a basic soil status and nutrient recommendations."
        icon={<FlaskConical className="w-8 h-8 text-ag-600" />}
      />

      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        <span>
          This is a basic assessment for demo purposes — not professional
          agricultural advice. Always confirm with a soil testing lab before
          major decisions.
        </span>
      </div>

      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="card p-6">
          <h2 className="font-bold text-ag-950">Enter soil values</h2>
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            {FIELDS.map((f) => {
              const isMissing = missing.includes(f.label);
              return (
                <div key={f.key}>
                  <label className="label" htmlFor={f.key}>
                    {f.label}
                  </label>
                  <div className="relative">
                    <input
                      id={f.key}
                      type="number"
                      inputMode="decimal"
                      min={f.min}
                      max={f.max}
                      step="0.1"
                      className={`input pr-16 ${
                        isMissing ? 'border-red-300 ring-1 ring-red-200' : ''
                      }`}
                      placeholder={f.placeholder}
                      value={Number.isNaN(input[f.key]) ? '' : input[f.key]}
                      onChange={(e) => update(f.key, e.target.value)}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ag-500 font-medium">
                      {f.unit}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ag-500">{f.hint}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={analyze}
              disabled={loading}
              className="btn-primary flex-1 min-w-[180px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <FlaskConical className="w-5 h-5" />
                  Analyze Soil
                </>
              )}
            </button>
            <button onClick={reset} disabled={loading} className="btn-secondary">
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Result */}
        <div className="card p-6">
          <h2 className="font-bold text-ag-950 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-ag-600" />
            Soil Assessment
          </h2>

          {error && (
            <div className="mt-4">
              <ErrorBanner message={error} />
            </div>
          )}

          {!result && !error && (
            <div className="mt-4 grid place-items-center py-10 text-center text-ag-500">
              <FlaskConical className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm">
                Fill in all values and tap <strong>Analyze Soil</strong>.
              </p>
            </div>
          )}

          {result && (
            <div className="mt-4 animate-pop space-y-4">
              <div
                className={`rounded-xl p-4 flex items-center gap-3 ${
                  statusColor === 'ag'
                    ? 'bg-ag-50 border border-ag-200'
                    : statusColor === 'amber'
                    ? 'bg-amber-50 border border-amber-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                {statusColor === 'ag' ? (
                  <CheckCircle2 className="w-8 h-8 text-ag-600 shrink-0" />
                ) : (
                  <AlertTriangle
                    className={`w-8 h-8 shrink-0 ${
                      statusColor === 'amber' ? 'text-amber-600' : 'text-red-600'
                    }`}
                  />
                )}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-ag-600">
                    Overall status
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      statusColor === 'ag'
                        ? 'text-ag-800'
                        : statusColor === 'amber'
                        ? 'text-amber-700'
                        : 'text-red-700'
                    }`}
                  >
                    {result.status}
                  </div>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-ag-50/60 border border-ag-100 p-3">
                  <dt className="text-xs text-ag-600 font-semibold uppercase">
                    pH status
                  </dt>
                  <dd className="mt-0.5 font-bold text-ag-950">
                    {result.phStatus}
                  </dd>
                </div>
                <div className="rounded-lg bg-ag-50/60 border border-ag-100 p-3">
                  <dt className="text-xs text-ag-600 font-semibold uppercase">
                    NPK status
                  </dt>
                  <dd className="mt-0.5 font-bold text-ag-950">
                    {result.npkStatus}
                  </dd>
                </div>
              </dl>

              <div className="rounded-xl bg-white border border-ag-100 p-4">
                <h3 className="text-sm font-bold text-ag-900 flex items-center gap-2">
                  <Info className="w-4 h-4 text-ag-600" />
                  Recommendation
                </h3>
                <p className="mt-2 text-sm text-ag-700 leading-relaxed">
                  {result.recommendation}
                </p>
              </div>

              <p className="text-xs text-ag-500">
                Basic assessment — demo only, not professional advice.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
