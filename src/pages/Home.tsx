import {
  Leaf,
  CloudSun,
  FlaskConical,
  LayoutDashboard,
  ArrowRight,
  ShieldCheck,
  Sun,
  Droplets,
  Sprout,
  Camera,
  Brain,
  ChevronRight,
} from 'lucide-react';
import type { PageKey } from '@/lib/types';

const FEATURES: {
  key: PageKey;
  icon: typeof Leaf;
  title: string;
  desc: string;
  cta: string;
  accent: string;
}[] = [
  {
    key: 'crop',
    icon: Leaf,
    title: 'Crop Disease Detection',
    desc: 'Upload a leaf photo and get an instant read on crop health — disease name, confidence, and a care recommendation.',
    cta: 'Check My Crop',
    accent: 'from-ag-500 to-ag-700',
  },
  {
    key: 'advisory',
    icon: CloudSun,
    title: 'Farm Advisory',
    desc: 'See current weather, rainfall, humidity, irrigation guidance, and active farm alerts for your area.',
    cta: 'Farm Advisory',
    accent: 'from-sky-500 to-sky-700',
  },
  {
    key: 'soil',
    icon: FlaskConical,
    title: 'Soil Health',
    desc: 'Enter pH and NPK values to get a basic soil status and practical nutrient recommendations.',
    cta: 'Soil Health',
    accent: 'from-clay-500 to-clay-700',
  },
];

const STEPS = [
  { icon: Camera, title: 'Snap a leaf', text: 'Upload a photo of your crop leaf from your phone or computer.' },
  { icon: Brain, title: 'Get analysis', text: 'The system checks for disease signs and returns a confidence score.' },
  { icon: ShieldCheck, title: 'Act on advice', text: 'Follow clear, farmer-friendly recommendations to protect your crop.' },
];

const STATS = [
  { icon: Sprout, value: '5+', label: 'Crops covered' },
  { icon: Leaf, value: '10+', label: 'Disease classes' },
  { icon: Sun, value: 'Live', label: 'Weather advisory' },
  { icon: Droplets, value: 'NPK', label: 'Soil checks' },
];

export default function Home({
  onNavigate,
}: {
  onNavigate: (p: PageKey) => void;
}) {
  return (
    <div className="animate-fade-up">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.pexels.com/photos/32417756/pexels-photo-32417756.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            alt="Lush green wheat field under summer sun"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ag-950/70 via-ag-900/55 to-ag-900/75" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="max-w-2xl">
            <span className="chip bg-white/15 text-white backdrop-blur-sm border border-white/20">
              <span className="w-2 h-2 rounded-full bg-ag-400 animate-pulse" />
              Hackathon Prototype · Demo Mode
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05]">
              Smart Agriculture for
              <span className="block text-ag-300">healthier crops</span>
            </h1>
            <p className="mt-5 text-lg text-white/85 leading-relaxed max-w-xl">
              Detect crop disease from a leaf photo, get farm & weather
              advisory, check your soil, and see everything in one
              farmer-friendly dashboard.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('crop')}
                className="btn bg-white text-ag-700 px-6 py-3.5 hover:bg-ag-50 shadow-card active:scale-[0.98] text-base"
              >
                <Camera className="w-5 h-5" />
                Check My Crop
              </button>
              <button
                onClick={() => onNavigate('advisory')}
                className="btn bg-ag-600 text-white px-6 py-3.5 hover:bg-ag-700 shadow-card active:scale-[0.98] text-base"
              >
                <CloudSun className="w-5 h-5" />
                Farm Advisory
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={() => onNavigate('soil')}
                className="chip bg-white/10 text-white border border-white/20 hover:bg-white/15 backdrop-blur-sm pr-4 py-1.5"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                Soil Health
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="chip bg-white/10 text-white border border-white/20 hover:bg-white/15 backdrop-blur-sm pr-4 py-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Farmer Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* wave divider */}
        <div className="relative -mb-px">
          <svg viewBox="0 0 1440 80" className="w-full h-12 sm:h-16" preserveAspectRatio="none">
            <path d="M0,40 C240,80 480,0 720,30 C960,60 1200,90 1440,40 L1440,80 L0,80 Z" fill="#fbfdf8" />
          </svg>
        </div>
      </section>

      {/* Stats strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
        <div className="card grid grid-cols-2 md:grid-cols-4 divide-x divide-ag-100">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex items-center gap-3 p-4 sm:p-5">
                <span className="grid place-items-center w-10 h-10 rounded-xl bg-ag-50 text-ag-600 shrink-0">
                  <Icon className="w-5 h-5" />
                </span>
                <div>
                  <div className="font-display font-bold text-lg text-ag-950 leading-none">
                    {s.value}
                  </div>
                  <div className="text-xs text-ag-600 mt-0.5">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* About */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-ag-600 font-semibold text-sm uppercase tracking-wider">
              The project
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-ag-950">
              One tool for crop health, weather & soil
            </h2>
            <p className="mt-4 text-ag-700 leading-relaxed">
              Farmers lose yield every season to diseases they spot too late,
              unpredictable weather, and unbalanced soil. Smart Agriculture
              brings three core checks into a single, simple app — designed so
              even first-time users can get answers in seconds.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Photo-based crop disease detection with confidence score',
                'Location-aware weather, irrigation & farm alerts',
                'Quick soil pH and NPK assessment with clear guidance',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-ag-800">
                  <ShieldCheck className="w-5 h-5 text-ag-500 mt-0.5 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/16678079/pexels-photo-16678079.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt="Farmer using a smartphone to examine a plant in a field"
              className="rounded-2xl shadow-card w-full h-72 sm:h-96 object-cover"
            />
            <div className="absolute -bottom-5 -left-5 hidden sm:block card p-4 w-56 animate-float">
              <div className="flex items-center gap-2 text-ag-700">
                <span className="w-2.5 h-2.5 rounded-full bg-ag-500" />
                <span className="text-xs font-semibold">Crop: Tomato</span>
              </div>
              <div className="mt-1 text-sm font-bold text-ag-950">Healthy</div>
              <div className="mt-1 text-xs text-ag-600">Confidence 94%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-ag-600 font-semibold text-sm uppercase tracking-wider">
            What you can do
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-ag-950">
            Three simple checks, one dashboard
          </h2>
          <p className="mt-3 text-ag-700">
            Tap any card to get started — each tool is built to work even when
            the live backend or AI model isn&apos;t connected.
          </p>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.key}
                onClick={() => onNavigate(f.key)}
                className="card p-6 text-left group hover:shadow-glow hover:-translate-y-1 transition-all duration-200 animate-fade-up"
              >
                <span
                  className={`grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br ${f.accent} text-white shadow-soft`}
                >
                  <Icon className="w-6 h-6" />
                </span>
                <h3 className="mt-4 text-xl font-bold text-ag-950">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-ag-700 leading-relaxed">
                  {f.desc}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ag-600 group-hover:gap-2 transition-all">
                  {f.cta}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-20">
        <div className="card p-8 sm:p-10 bg-gradient-to-br from-ag-50 to-white">
          <div className="text-center">
            <p className="text-ag-600 font-semibold text-sm uppercase tracking-wider">
              How it works
            </p>
            <h2 className="mt-2 text-3xl font-bold text-ag-950">
              From leaf to advice in three steps
            </h2>
          </div>
          <div className="mt-8 grid sm:grid-cols-3 gap-6">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="relative">
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center w-11 h-11 rounded-xl bg-ag-600 text-white font-bold shadow-soft">
                      {i + 1}
                    </span>
                    <Icon className="w-6 h-6 text-ag-500" />
                  </div>
                  <h3 className="mt-3 font-bold text-ag-950">{s.title}</h3>
                  <p className="mt-1 text-sm text-ag-700">{s.text}</p>
                  {i < STEPS.length - 1 && (
                    <ChevronRight className="hidden sm:block absolute top-3 -right-3 w-6 h-6 text-ag-300" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-20">
        <div className="relative overflow-hidden rounded-2xl bg-ag-700 text-white p-8 sm:p-12">
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-ag-600/40 blur-2xl" />
          <div className="absolute -left-8 -bottom-12 w-40 h-40 rounded-full bg-ag-500/30 blur-2xl" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">
                Ready to check your crop?
              </h2>
              <p className="mt-2 text-white/85">
                Upload a leaf photo and get an instant health read.
              </p>
            </div>
            <button
              onClick={() => onNavigate('crop')}
              className="btn bg-white text-ag-700 px-6 py-3.5 hover:bg-ag-50 shadow-card active:scale-[0.98] text-base shrink-0"
            >
              <Leaf className="w-5 h-5" />
              Check My Crop
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
