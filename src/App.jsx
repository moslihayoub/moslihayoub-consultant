import React, { Suspense, lazy } from 'react';
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

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="loading-spinner"></div></div>}>
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
        <div className="app-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <CustomCursor />
          <Navbar />
          <main style={{ flex: 1 }}>
            <AnimatedRoutes />
          </main>
          <Footer />
          <ScrollSpy />
          {import.meta.env.DEV && <ChatWidget />}
          <CookieBanner />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
