import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import ScrollSpy from './components/ScrollSpy';
import CookieBanner from './components/CookieBanner';
import PwaInstallPrompt from './components/PwaInstallPrompt';

import { LanguageProvider } from './contexts/LanguageContext';
import './index.css';
import { db } from './utils/firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

const Home = lazy(() => import('./pages/Home'));
const Work = lazy(() => import('./pages/Work'));
const About = lazy(() => import('./pages/About'));
const ChatWidget = lazy(() => import('./components/ChatWidget'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Error404 = lazy(() => import('./components/Error404'));
const Error401 = lazy(() => import('./components/Error401'));
const Error403 = lazy(() => import('./components/Error403'));
const Error500 = lazy(() => import('./components/Error500'));
const Error503 = lazy(() => import('./components/Error503'));
const OfflineDetector = lazy(() => import('./components/OfflineDetector'));

// Admin Routes
const AdminLogin = lazy(() => import('./pages/Admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

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

import ErrorBoundary from './components/ErrorBoundary';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  // Do not animate transitions for admin routes to avoid layout shifting
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <ErrorBoundary>
      {isAdminRoute ? (
        <Suspense fallback={<PageSkeleton />}>
          <Routes location={location} key="admin">
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/*" element={<Error404 />} />
          </Routes>
        </Suspense>
      ) : (
        <AnimatePresence mode="wait">
          <Suspense fallback={<PageSkeleton />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/work" element={<Work />} />
              <Route path="/about" element={<About />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
              <Route path="/test-401" element={<Error401 />} />
              <Route path="/test-403" element={<Error403 />} />
              <Route path="/test-500" element={<Error500 />} />
              <Route path="/test-503" element={<Error503 />} />
              <Route path="*" element={<Error404 />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      )}
    </ErrorBoundary>
  );
};

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (!isAdminRoute && !sessionStorage.getItem('m84_visited')) {
      const trackVisit = async () => {
        try {
          if (!db) return;
          sessionStorage.setItem('m84_visited', 'true');
          const today = new Date().toISOString().split('T')[0];
          const docRef = doc(db, 'analytics', today);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            await updateDoc(docRef, { visites: increment(1) });
          } else {
            await setDoc(docRef, { visites: 1, date: today, name: today.slice(5) }); // name: MM-DD for chart
          }
        } catch (e) {
          console.warn("Analytics error:", e);
        }
      };
      trackVisit();
    }
  }, [isAdminRoute]);

  useEffect(() => {
    let manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      document.head.appendChild(manifestLink);
    }
    if (isAdminRoute) {
      manifestLink.href = '/manifest-admin.json';
    } else {
      // The default VitePWA manifest
      manifestLink.href = '/manifest.webmanifest'; 
    }
  }, [isAdminRoute]);

  return (
    <div className="app-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAdminRoute && <CustomCursor />}
      
      {/* Restore default cursor for Backoffice */}
      {isAdminRoute && (
        <style>{`
          body, a, button, input, textarea, select { cursor: auto !important; }
          a, button { cursor: pointer !important; }
          input, textarea { cursor: text !important; }
        `}</style>
      )}

      {!isAdminRoute && <Navbar />}
      
      <main style={{ flex: 1 }}>
        <AnimatedRoutes />
      </main>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <ScrollSpy />}
      
      {!isAdminRoute && (
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      )}
      {!isAdminRoute && <CookieBanner />}
      <PwaInstallPrompt isAdminRoute={isAdminRoute} />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <OfflineDetector>
        <Router>
          <ScrollToTop />
          <AppContent />
        </Router>
      </OfflineDetector>
    </LanguageProvider>
  );
}

export default App;
