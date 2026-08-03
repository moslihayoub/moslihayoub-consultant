import React from 'react';
import ErrorPage from './ErrorPage';

const Error403 = () => {
  return (
    <ErrorPage 
      code="403"
      title="Accès Refusé"
      description="Vous n'avez pas les permissions nécessaires pour accéder à cette ressource."
      lottieUrl="/assets/lottie/403.json"
      ctaText="Retour à l'accueil"
      ctaAction="home"
      ctaIcon="home"
    />
  );
};

export default Error403;
