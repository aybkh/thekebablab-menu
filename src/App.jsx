import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { useTenant } from './context/TenantContext';
import { SiteConfigProvider } from './context/SiteConfigContext';

// Pages
import LandingPage from './pages/LandingPage';
import POSPage from './pages/POSPage';
import NotFound from './pages/NotFound';

function App() {
  const { theme, isLoading, error } = useTenant();

  if (isLoading) {
    return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: 'var(--color-sidebar)', color: 'var(--color-primary)', fontFamily: "'Montserrat', sans-serif", fontWeight: 'bold', fontSize: '1.5rem' }}>CARGANDO...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>Error cargando configuración: {error}</div>;
  }

  return (
    <LanguageProvider>
      <SiteConfigProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/menu" element={<POSPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </SiteConfigProvider>
    </LanguageProvider>
  );
}

export default App;
