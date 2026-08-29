import { useEffect, useRef, useState, type ReactNode } from 'react';

interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

let pushExternal: ((t: Omit<Toast, 'id'>) => void) | null = null;

export function toast(message: string, type: Toast['type'] = 'info') {
  pushExternal?.({ message, type });
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    pushExternal = (t) => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { ...t, id }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== id));
      }, 3800);
    };
    return () => {
      pushExternal = null;
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 rounded-xl px-4 py-3 shadow-card border animate-fade-up max-w-sm ${
            t.type === 'success'
              ? 'bg-white border-ag-200 text-ag-800'
              : t.type === 'error'
              ? 'bg-white border-red-200 text-red-700'
              : 'bg-white border-ag-100 text-ag-800'
          }`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              t.type === 'success'
                ? 'bg-ag-500'
                : t.type === 'error'
                ? 'bg-red-500'
                : 'bg-ag-400'
            }`}
          />
          <span className="text-sm font-medium">{t.message}</span>
        </div>
      ))}
    </div>
  );
}

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-ag-200 border-t-ag-600 ${className}`}
      style={{ width: '1em', height: '1em' }}
      aria-hidden
    />
  );
}

export function StatusDot({
  status,
}: {
  status: 'good' | 'warn' | 'bad' | 'idle';
}) {
  const map = {
    good: 'bg-ag-500',
    warn: 'bg-amber-500',
    bad: 'bg-red-500',
    idle: 'bg-gray-300',
  };
  return (
    <span className="relative flex h-3 w-3">
      {status !== 'idle' && (
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${map[status]}`}
        />
      )}
      <span
        className={`relative inline-flex h-3 w-3 rounded-full ${map[status]}`}
      />
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  icon,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  icon?: ReactNode;
}) {
  return (
    <div className="animate-fade-up">
      <p className="text-ag-600 font-semibold text-sm uppercase tracking-wider">
        {eyebrow}
      </p>
      <h1 className="mt-1 text-3xl sm:text-4xl font-bold text-ag-950 flex items-center gap-3">
        {icon}
        {title}
      </h1>
      <p className="mt-2 text-ag-700 max-w-2xl">{subtitle}</p>
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-pop">
      {message}
    </div>
  );
}
