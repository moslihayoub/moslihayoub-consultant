import React from 'react';
import ErrorPage from './ErrorPage';

const Error500 = () => {
  return (
    <ErrorPage 
      code="500"
      title="Erreur Serveur"
      description="Oups, quelque chose s'est mal passé de notre côté. Nous travaillons pour résoudre le problème."
      lottieUrl="/assets/lottie/500.json"
      ctaText="Rafraîchir la page"
      ctaAction="reload"
      ctaIcon="reload"
    />
  );
};

export default Error500;
