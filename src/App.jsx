import React, { Suspense, lazy, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import ScrollSpy from './components/ScrollSpy';
import CookieBanner from './components/CookieBanner';
import PwaInstallPrompt from './components/PwaInstallPrompt';
import { isPortalMode, setAppMode } from './utils/appMode';

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

// Portal Routes (Espace Client / Missions B2B)
const PortalLogin = lazy(() => import('./pages/Portal/PortalLogin'));
const PortalLayout = lazy(() => import('./pages/Portal/PortalLayout'));
const PortalDashboard = lazy(() => import('./pages/Portal/PortalDashboard'));
const PortalReports = lazy(() => import('./pages/Portal/PortalReports'));
const PortalProjects = lazy(() => import('./pages/Portal/PortalProjects'));
const PortalTimesheet = lazy(() => import('./pages/Portal/PortalTimesheet'));

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

const AnimatedRoutes = ({ isPortalDomain }) => {
  const location = useLocation();
  
  // Do not animate transitions for admin and portal routes to avoid layout shifting
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isPortalRoute = location.pathname.startsWith('/portal');

  // Redirection automatique sur domaine M84 Ops (m84ops.vercel.app / ops.*)
  if (isPortalDomain && location.pathname === '/') {
    return <Navigate to="/portal" replace />;
  }
  if (isPortalDomain && location.pathname === '/login') {
    return <Navigate to="/portal/login" replace />;
  }

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
      ) : (isPortalRoute && (isPortalDomain || import.meta.env.DEV)) ? (
        <Suspense fallback={<PageSkeleton />}>
          <Routes location={location} key="portal">
            <Route path="/portal/login" element={<PortalLogin />} />
            <Route path="/portal" element={<PortalLayout />}>
              <Route index element={<PortalDashboard />} />
              <Route path="reports" element={<PortalReports />} />
              <Route path="projects" element={<PortalProjects />} />
              <Route path="timesheet" element={<PortalTimesheet />} />
              <Route path="absences" element={<Navigate to="/portal/timesheet#absences" replace />} />
            </Route>
            <Route path="/portal/*" element={<Error404 />} />
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
  const isPortalDomain = useMemo(() => isPortalMode(), []);
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isPortalRoute = location.pathname.startsWith('/portal');
  const isStandaloneApp = isAdminRoute || isPortalRoute || isPortalDomain;

  useEffect(() => {
    if (isPortalDomain) {
      document.title = "M84 Ops — Portail Collaborateur Client & CRA B2B";
    }
  }, [isPortalDomain]);

  useEffect(() => {
    if (!isStandaloneApp && !sessionStorage.getItem('m84_visited')) {
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
  }, [isStandaloneApp]);

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
      {!isStandaloneApp && <CustomCursor />}
      
      {/* Restore default cursor for Backoffice & Client Portal */}
      {isStandaloneApp && (
        <style>{`
          body, a, button, input, textarea, select { cursor: auto !important; }
          a, button { cursor: pointer !important; }
          input, textarea { cursor: text !important; }
        `}</style>
      )}

      {!isStandaloneApp && <Navbar />}
      
      <main style={{ flex: 1 }}>
        <AnimatedRoutes isPortalDomain={isPortalDomain} />
      </main>

      {!isStandaloneApp && <Footer />}
      {!isStandaloneApp && <ScrollSpy />}
      
      {!isStandaloneApp && (
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      )}
      {!isStandaloneApp && <CookieBanner />}
      <PwaInstallPrompt isAdminRoute={isAdminRoute} />

      {/* Sélecteur de test rapide en Dev Local (Exclu du bundle de prod) */}
      {import.meta.env.DEV && (
        <div style={{
          position: 'fixed',
          bottom: '12px',
          left: '12px',
          zIndex: 999999,
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '20px',
          padding: '4px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          fontSize: '0.75rem',
          color: '#94a3b8'
        }}>
          <span style={{ fontWeight: 600, color: isPortalDomain ? '#10b981' : '#38bdf8' }}>
            {isPortalDomain ? '⚡ Mode M84 Ops' : '🎨 Mode Portfolio'}
          </span>
          <button
            onClick={() => setAppMode(isPortalDomain ? 'portfolio' : 'portal')}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              padding: '2px 8px',
              cursor: 'pointer',
              fontSize: '0.72rem',
              fontWeight: 500
            }}
            title="Basculez entre le domaine Portfolio et le domaine Portail Client"
          >
            Basculer ⇄
          </button>
        </div>
      )}
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
