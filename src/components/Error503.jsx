import React from 'react';
import ErrorPage from './ErrorPage';

const Error503 = () => {
  return (
    <ErrorPage 
      code="503"
      title="Service en Maintenance"
      description="Le site est actuellement en cours de mise à jour pour vous offrir une meilleure expérience. Nous serons de retour très vite !"
      lottieUrl="/assets/lottie/503.json"
      ctaText="Rafraîchir la page"
      ctaAction="reload"
      ctaIcon="reload"
    />
  );
};

export default Error503;
