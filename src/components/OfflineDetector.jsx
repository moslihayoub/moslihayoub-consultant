import React, { useState, useEffect } from 'react';
import ErrorPage from './ErrorPage';

const OfflineDetector = ({ children }) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOffline) {
    return (
      <ErrorPage 
        code="OFFLINE"
        title="Connexion Perdue"
        description="Il semble que vous n'êtes plus connecté à internet. Veuillez vérifier votre connexion et réessayer."
        lottieUrl="/assets/lottie/offline.json"
        ctaText="Réessayer"
        ctaAction="reload"
        ctaIcon="reload"
      />
    );
  }

  return children;
};

export default OfflineDetector;
