import { useEffect, useState } from 'react';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Features } from './components/Features';
import { Portfolio } from './components/Portfolio';
import { Studio } from './components/Studio';
import { Credits } from './components/Credits';
import { Clients } from './components/Clients';
import { Admin } from './admin/Admin';
import { SiteProvider } from './store';

const isAdmin = () => window.location.hash.startsWith('#/admin');

export default function App() {
  const [admin, setAdmin] = useState(isAdmin);

  useEffect(() => {
    const onHash = () => { setAdmin(isAdmin()); if (window.location.hash === '#/') window.scrollTo(0, 0); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return (
    <SiteProvider>
      <main className="bg-black">
        {admin ? (
          <Admin />
        ) : (
          <>
            <Hero />
            <About />
            <Features />
            <Portfolio />
            <Studio />
            <Credits />
            <Clients />
          </>
        )}
      </main>
    </SiteProvider>
  );
}
