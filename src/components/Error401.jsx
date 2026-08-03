import React from 'react';
import ErrorPage from './ErrorPage';

const Error401 = () => {
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
};

export default Error401;
