import { useState } from 'react';
import {
  Sprout,
  Leaf,
  CloudSun,
  FlaskConical,
  LayoutDashboard,
  Menu,
  X,
} from 'lucide-react';
import type { PageKey } from '@/lib/types';

const LINKS: { key: PageKey; label: string; icon: typeof Leaf }[] = [
  { key: 'home', label: 'Home', icon: Sprout },
  { key: 'crop', label: 'Crop Disease', icon: Leaf },
  { key: 'advisory', label: 'Farm Advisory', icon: CloudSun },
  { key: 'soil', label: 'Soil Health', icon: FlaskConical },
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export default function Navbar({
  current,
  onNavigate,
}: {
  current: PageKey;
  onNavigate: (p: PageKey) => void;
}) {
  const [open, setOpen] = useState(false);

  const go = (p: PageKey) => {
    onNavigate(p);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-cream/85 backdrop-blur-md border-b border-ag-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => go('home')}
          className="flex items-center gap-2.5 group"
          aria-label="Smart Agriculture home"
        >
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-ag-600 text-white shadow-soft group-hover:bg-ag-700 transition-colors">
            <Sprout className="w-5 h-5" />
          </span>
          <span className="font-display font-bold text-ag-950 leading-tight text-left">
            Smart Agriculture
            <span className="block text-[11px] font-medium text-ag-600">
              Crop & Farm Advisory
            </span>
          </span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => {
            const Icon = l.icon;
            const active = current === l.key;
            return (
              <button
                key={l.key}
                onClick={() => go(l.key)}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-ag-600 text-white shadow-soft'
                    : 'text-ag-700 hover:bg-ag-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {l.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="md:hidden grid place-items-center w-10 h-10 rounded-lg text-ag-700 hover:bg-ag-100"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-ag-100 bg-cream animate-fade-up">
          <div className="px-4 py-3 flex flex-col gap-1">
            {LINKS.map((l) => {
              const Icon = l.icon;
              const active = current === l.key;
              return (
                <button
                  key={l.key}
                  onClick={() => go(l.key)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                    active ? 'bg-ag-600 text-white' : 'text-ag-700 hover:bg-ag-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {l.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
