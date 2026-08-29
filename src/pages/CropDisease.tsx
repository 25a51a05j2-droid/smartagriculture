import { useRef, useState } from 'react';
import {
  Leaf,
  Upload,
  ImageIcon,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Camera,
  RotateCcw,
  Info,
} from 'lucide-react';
import { PageHeader, ErrorBanner, Spinner, toast } from '@/components/ui';
import { analyzeCrop } from '@/lib/api';
import { store } from '@/lib/store';
import type { CropResult } from '@/lib/types';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_MB = 8;

type Phase = 'idle' | 'loading' | 'result' | 'error';

export default function CropDisease() {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<CropResult | null>(null);
  const [error, setError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setImageDataUrl(null);
    setFileName('');
    setResult(null);
    setError('');
    setPhase('idle');
    if (inputRef.current) inputRef.current.value = '';
  };

  const onFile = (file: File | undefined) => {
    setError('');
    setResult(null);
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      setError('Invalid file type. Please upload a JPG, PNG, or WEBP image.');
      setPhase('error');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${MAX_MB}MB.`);
      setPhase('error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setImageDataUrl(url);
      setFileName(file.name);
      setPhase('idle');
    };
    reader.onerror = () => {
      setError('Could not read the selected image. Please try another file.');
      setPhase('error');
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!imageDataUrl) {
      setError('Please select a leaf image first.');
      setPhase('error');
      return;
    }
    setPhase('loading');
    setError('');
    try {
      const res = await analyzeCrop(imageDataUrl);
      setResult(res);
      setPhase('result');
      store.setCrop(res);
      toast('Analysis complete', 'success');
    } catch {
      setError(
        'Could not analyze the image. The backend may be offline. Please try again.'
      );
      setPhase('error');
      toast('Analysis failed', 'error');
    }
  };

  const confPct = result ? Math.round(result.confidence * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        eyebrow="Tool"
        title="Crop Disease Detection"
        subtitle="Upload a photo of a crop leaf to check its health. You'll get a disease name, confidence score, and a care recommendation."
        icon={<Leaf className="w-8 h-8 text-ag-600" />}
      />

      <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        <span>
          Demo mode: results are simulated and clearly labelled. The API is
          structured so a real AI model can be connected later without UI
          changes.
        </span>
      </div>

      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        {/* Upload panel */}
        <div className="card p-6">
          <h2 className="font-bold text-ag-950 flex items-center gap-2">
            <Upload className="w-5 h-5 text-ag-600" />
            Upload leaf image
          </h2>

          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              onFile(e.dataTransfer.files?.[0]);
            }}
            className="mt-4 cursor-pointer rounded-xl border-2 border-dashed border-ag-200 hover:border-ag-400 hover:bg-ag-50/50 transition-colors p-6 text-center"
          >
            {imageDataUrl ? (
              <div className="relative inline-block">
                <img
                  src={imageDataUrl}
                  alt="Selected leaf"
                  className="max-h-64 rounded-lg shadow-soft mx-auto object-contain"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    reset();
                  }}
                  className="absolute -top-2 -right-2 grid place-items-center w-7 h-7 rounded-full bg-red-500 text-white shadow-card hover:bg-red-600"
                  aria-label="Remove image"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="py-6">
                <span className="grid place-items-center w-14 h-14 rounded-2xl bg-ag-50 text-ag-500 mx-auto">
                  <ImageIcon className="w-7 h-7" />
                </span>
                <p className="mt-3 text-sm font-semibold text-ag-800">
                  Tap to upload or drag a leaf photo here
                </p>
                <p className="mt-1 text-xs text-ag-600">
                  JPG, PNG, or WEBP · up to {MAX_MB}MB
                </p>
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED.join(',')}
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0] ?? undefined)}
            />
          </div>

          {fileName && (
            <p className="mt-3 text-xs text-ag-600 truncate">
              Selected: <span className="font-medium text-ag-800">{fileName}</span>
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={analyze}
              disabled={phase === 'loading' || !imageDataUrl}
              className="btn-primary flex-1 min-w-[180px]"
            >
              {phase === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  Analyze Crop
                </>
              )}
            </button>
            <button
              onClick={reset}
              disabled={phase === 'loading'}
              className="btn-secondary"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {phase === 'loading' && (
            <div className="mt-4">
              <div className="h-1.5 rounded-full shimmer-bg overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
              </div>
              <p className="mt-2 text-xs text-ag-600 flex items-center gap-1.5">
                <Spinner className="w-3 h-3" /> Sending image to backend…
              </p>
            </div>
          )}
        </div>

        {/* Result panel */}
        <div className="card p-6">
          <h2 className="font-bold text-ag-950 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-ag-600" />
            Result
          </h2>

          {phase === 'error' && (
            <div className="mt-4">
              <ErrorBanner message={error} />
            </div>
          )}

          {phase === 'idle' && !error && (
            <div className="mt-4 grid place-items-center py-10 text-center text-ag-500">
              <Leaf className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm">
                Upload an image and click <strong>Analyze Crop</strong> to see
                the result here.
              </p>
            </div>
          )}

          {phase === 'loading' && (
            <div className="mt-4 space-y-3">
              <div className="h-24 rounded-xl shimmer-bg" />
              <div className="h-5 w-1/2 rounded shimmer-bg" />
              <div className="h-5 w-2/3 rounded shimmer-bg" />
              <div className="h-16 rounded-xl shimmer-bg" />
            </div>
          )}

          {phase === 'result' && result && (
            <div className="mt-4 animate-pop">
              <div
                className={`rounded-xl p-4 flex items-center gap-3 ${
                  result.isHealthy
                    ? 'bg-ag-50 border border-ag-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                {result.isHealthy ? (
                  <CheckCircle2 className="w-8 h-8 text-ag-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-red-600 shrink-0" />
                )}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-ag-600">
                    Status
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      result.isHealthy ? 'text-ag-800' : 'text-red-700'
                    }`}
                  >
                    {result.isHealthy ? 'Healthy' : 'Disease detected'}
                  </div>
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-ag-50/60 border border-ag-100 p-3">
                  <dt className="text-xs text-ag-600 font-semibold uppercase">
                    Crop
                  </dt>
                  <dd className="mt-0.5 font-bold text-ag-950">
                    {result.crop}
                  </dd>
                </div>
                <div className="rounded-lg bg-ag-50/60 border border-ag-100 p-3">
                  <dt className="text-xs text-ag-600 font-semibold uppercase">
                    Disease
                  </dt>
                  <dd className="mt-0.5 font-bold text-ag-950">
                    {result.disease}
                  </dd>
                </div>
              </dl>

              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-ag-800">
                    Confidence score
                  </span>
                  <span className="font-bold text-ag-950">{confPct}%</span>
                </div>
                <div className="mt-2 h-2.5 rounded-full bg-ag-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-ag-400 to-ag-600 transition-all duration-700"
                    style={{ width: `${confPct}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-white border border-ag-100 p-4">
                <h3 className="text-sm font-bold text-ag-900 flex items-center gap-2">
                  <Info className="w-4 h-4 text-ag-600" />
                  Recommendation
                </h3>
                <p className="mt-2 text-sm text-ag-700 leading-relaxed">
                  {result.recommendation}
                </p>
              </div>

              <p className="mt-3 text-xs text-ag-500">
                Demo result — not a professional diagnosis. Confirm with an
                agronomist before treatment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
