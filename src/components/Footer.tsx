import { Sprout, Github, Heart } from 'lucide-react';
import type { PageKey } from '@/lib/types';

export default function Footer({
  onNavigate,
}: {
  onNavigate: (p: PageKey) => void;
}) {
  return (
    <footer className="mt-20 border-t border-ag-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-ag-600 text-white">
              <Sprout className="w-5 h-5" />
            </span>
            <span className="font-display font-bold text-ag-950">
              Smart Agriculture
            </span>
          </div>
          <p className="mt-3 text-sm text-ag-700 max-w-xs">
            A farmer-friendly system for crop disease detection, weather
            advisory, and soil health — built as a hackathon prototype.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold text-ag-900 uppercase tracking-wider">
            Pages
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              ['home', 'Home'],
              ['crop', 'Crop Disease Detection'],
              ['advisory', 'Farm Advisory'],
              ['soil', 'Soil Health'],
              ['dashboard', 'Farmer Dashboard'],
            ].map(([k, label]) => (
              <li key={k}>
                <button
                  onClick={() => onNavigate(k as PageKey)}
                  className="text-ag-700 hover:text-ag-600 hover:underline"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-ag-900 uppercase tracking-wider">
            About this prototype
          </h4>
          <p className="mt-3 text-sm text-ag-700">
            Disease detection and weather data use clearly-labelled demo
            results. The API structure is ready for a real AI model and live
            weather service to be connected later.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-ag-600">
            <Github className="w-4 h-4" />
            <span>Hackathon project</span>
          </div>
        </div>
      </div>
      <div className="border-t border-ag-100 py-4 text-center text-xs text-ag-600 flex items-center justify-center gap-1.5">
        Built with <Heart className="w-3.5 h-3.5 text-ag-500" /> for farmers
      </div>
    </footer>
  );
}
