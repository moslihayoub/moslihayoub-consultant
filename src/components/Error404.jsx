import React from 'react';
import ErrorPage from './ErrorPage';

const Error404 = () => {
  return (
    <ErrorPage 
      code="404"
      title="Page introuvable"
      description="La page que vous cherchez n'existe pas, a été déplacée ou est temporairement indisponible."
      lottieUrl="/assets/lottie/404.json"
      ctaText="Retour à l'accueil"
      ctaAction="home"
      ctaIcon="home"
    />
  );
};

export default Error404;
