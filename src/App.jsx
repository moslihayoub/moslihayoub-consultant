import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import ScrollSpy from './components/ScrollSpy';
import CookieBanner from './components/CookieBanner';
import PwaInstallPrompt from './components/PwaInstallPrompt';

import { LanguageProvider } from './contexts/LanguageContext';
import './index.css';

const Home = lazy(() => import('./pages/Home'));
const Work = lazy(() => import('./pages/Work'));
const About = lazy(() => import('./pages/About'));
const ChatWidget = lazy(() => import('./components/ChatWidget'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PageSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#cbd5e1', animation: 'pulse 1.5s infinite ease-in-out', marginBottom: '24px' }}></div>
    <div style={{ height: '12px', background: '#cbd5e1', borderRadius: '6px', animation: 'pulse 1.5s infinite ease-in-out', marginBottom: '12px', width: '200px' }}></div>
    <div style={{ height: '12px', background: '#cbd5e1', borderRadius: '6px', animation: 'pulse 1.5s infinite ease-in-out', marginBottom: '12px', width: '140px' }}></div>
    <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageSkeleton />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

function App() {
  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <div className="app-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <CustomCursor />
          <Navbar />
          <main style={{ flex: 1 }}>
            <AnimatedRoutes />
          </main>
          <Footer />
          <ScrollSpy />
          <Suspense fallback={null}>
            <ChatWidget />
          </Suspense>
          <CookieBanner />
          <PwaInstallPrompt />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
