import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import ErrorPage from './ErrorPage';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('m84_admin_token');
    if (token === 'authenticated_admin_moslih') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
        <div className="loader" style={{ border: '4px solid #e2e8f0', borderTop: '4px solid #0f172a', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <ErrorPage 
        code="401"
        title="Accès Non Autorisé"
        description="Vous n'êtes pas connecté ou votre session a expiré. Veuillez vous identifier pour accéder à cet espace."
        lottieUrl="/assets/lottie/401.json"
        ctaText="Se connecter"
        ctaAction={() => window.location.href = '/admin/login'}
        ctaIcon="dashboard"
      />
    );
  }

  return children;
};

export default ProtectedRoute;
