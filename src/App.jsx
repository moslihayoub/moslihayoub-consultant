import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import ChatWidget from './components/ChatWidget';
import ScrollSpy from './components/ScrollSpy';
import CookieBanner from './components/CookieBanner';

import { LanguageProvider } from './contexts/LanguageContext';
import './index.css';

const Home = lazy(() => import('./pages/Home'));
const Work = lazy(() => import('./pages/Work'));
const About = lazy(() => import('./pages/About'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PageSkeleton = () => (
  <div style={{ minHeight: '100vh', padding: '120px 24px', display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px', margin: '0 auto' }}>
    <div className="skeleton-box" style={{ width: '40%', height: '40px', borderRadius: '12px' }}></div>
    <div className="skeleton-box" style={{ width: '80%', height: '80px', borderRadius: '12px' }}></div>
    <div className="skeleton-box" style={{ width: '100%', height: '200px', borderRadius: '24px' }}></div>
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
          <main style={{ flex: 1, paddingBottom: '80px' /* Espace pour la bottom navbar sur mobile */ }}>
            <AnimatedRoutes />
          </main>
          <Footer />
          <ScrollSpy />
          <ChatWidget />
          <CookieBanner />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
