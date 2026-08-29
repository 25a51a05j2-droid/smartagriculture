import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui';
import Home from '@/pages/Home';
import CropDisease from '@/pages/CropDisease';
import Advisory from '@/pages/Advisory';
import SoilHealth from '@/pages/SoilHealth';
import Dashboard from '@/pages/Dashboard';
import type { PageKey } from '@/lib/types';

function pageFromHash(): PageKey {
  const h = window.location.hash.replace('#/', '').replace('#', '');
  if (h === 'crop' || h === 'advisory' || h === 'soil' || h === 'dashboard')
    return h;
  return 'home';
}

export default function App() {
  const [page, setPage] = useState<PageKey>(pageFromHash());

  useEffect(() => {
    const onHash = () => setPage(pageFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (p: PageKey) => {
    window.location.hash = `/${p}`;
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar current={page} onNavigate={navigate} />
      <main className="flex-1">
        {page === 'home' && <Home onNavigate={navigate} />}
        {page === 'crop' && <CropDisease />}
        {page === 'advisory' && <Advisory />}
        {page === 'soil' && <SoilHealth />}
        {page === 'dashboard' && <Dashboard onNavigate={navigate} />}
      </main>
      <Footer onNavigate={navigate} />
      <Toaster />
    </div>
  );
}
