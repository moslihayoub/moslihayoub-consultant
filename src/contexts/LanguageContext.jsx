import React, { createContext, useState, useContext } from 'react';

const translations = {
  fr: {
    // Nav & Common
    nav_home: 'Accueil',
    nav_work: 'Projets',
    nav_about: 'À propos',
    btn_work: 'Voir mes projets',
    btn_exp: 'Expériences récentes',
    footer_rights: 'Tous droits réservés.',

    // Home Hero
    hero_title_1: 'Catalyser votre transformation digitale par ',
    hero_title_2: "l'innovation et l'IA.",
    hero_hi: 'Bonjour, je suis Ayoub MOSLIH. Je suis',
    hero_role: 'Consultant en Transformation Digitale & IA',
    hero_desc: "J'accompagne les organisations dans la refonte de leurs écosystèmes numériques, en alliant vision stratégique, design centré utilisateur et intégration de workflows intelligents.",
    
    // Home Sections
    home_section2_label: 'Experiences',
    home_section2_title: 'Expériences récentes',
    home_section2_desc: 'Un aperçu de projets de transformation numérique — du conseil stratégique au produit final livré.',
    home_section3_label: 'Trajectoires',
    home_section3_title: 'Trajectoire professionnelle',
    home_section3_desc: '19 ans de conseil et de conception d\'expériences, de la direction artistique à la stratégie IA.',
    home_section3_download: 'Télécharger mon CV',

    // Work Page
    work_hero_label: 'Valeurs',
    work_hero_title: 'Selected Work.',
    work_hero_desc: 'Une collection de projets en transformation digitale, UX/UI et stratégie IA.',
    work_hero_tag1: '10+ ans Transformation',
    work_hero_tag2: '7+ ans UX/UI',
    work_hero_tag3: '2+ ans Stratégie IA',
    
    work_grid_label: 'Portfolio',
    work_grid_title: 'Tous les projets',
    work_grid_desc: 'Cliquez pour explorer les détails techniques de chaque réalisation.',
    
    work_cert_label: 'Formation',
    work_cert_title: 'Certifications',
    work_cert_desc: 'Formations certifiantes en stratégie digitale, design thinking et IA.',

    // About Page
    about_hero_title1: 'Transformation & ',
    about_hero_title2: 'Stratégie.',
    about_hero_desc: 'Consultant passionné par la résolution de problèmes complexes à travers la technologie, le design et l\'humain.',
    
    about_expert_label: 'Expertise',
    about_expert_title: 'Ce que je fais',
    about_expert_desc: 'Mes piliers d\'intervention pour accélérer votre transition.',
    
    about_timeline_label: 'Parcours',
    about_timeline_title: 'Mon parcours',
    about_timeline_desc: 'Les grandes étapes de ma carrière.',
    
    about_cert_label: 'Formations',
    about_cert_title: 'Apprentissage continu',
    about_cert_desc: 'Je me forme continuellement pour rester à la pointe des technologies.',
    
    about_contact_label: 'Contact',
    about_contact_title: 'Échangeons',
    about_contact_desc: 'Prêt à transformer vos idées en réalité ? Discutons de votre prochain projet.',

    // Modal
    modal_title: 'Accès restreint',
    modal_desc: 'Ce prototype est confidentiel. Veuillez saisir le code d\'accès pour le visualiser.',
    modal_login: 'Code d\'accès',
    modal_pass: 'Mot de passe',
    modal_btn: 'Accéder au projet',

    // Chat
    chat_placeholder: 'Posez une question...',
    chat_online: 'En ligne',
    
    // Errors
    error_404_title: 'Page introuvable',
    error_404_desc: 'La page que vous cherchez n\'existe pas, a été déplacée ou est temporairement indisponible.',
    error_404_cta: 'Retour à l\'accueil',
    
    error_offline_title: 'Connexion Perdue',
    error_offline_desc: 'Il semble que vous n\'êtes plus connecté à internet. Veuillez vérifier votre connexion et réessayer.',
    error_offline_cta: 'Réessayer',
    
    error_401_title: 'Accès Non Autorisé',
    error_401_desc: 'Vous n\'êtes pas connecté ou votre session a expiré. Veuillez vous identifier pour accéder à cet espace.',
    error_401_cta: 'Se connecter',
    
    error_403_title: 'Accès Refusé',
    error_403_desc: 'Vous n\'avez pas les permissions nécessaires pour accéder à cette ressource.',
    error_403_cta: 'Retour à l\'accueil',
    
    error_500_title: 'Erreur Serveur',
    error_500_desc: 'Oups, quelque chose s\'est mal passé de notre côté. Nous travaillons pour résoudre le problème.',
    error_500_cta: 'Rafraîchir la page',
    
    error_503_title: 'Service en Maintenance',
    error_503_desc: 'Le site est actuellement en cours de mise à jour pour vous offrir une meilleure expérience. Nous serons de retour très vite !',
    error_503_cta: 'Rafraîchir la page'
  },
  en: {
    // Nav & Common
    nav_home: 'Home',
    nav_work: 'Work',
    nav_about: 'About',
    btn_work: 'View My Work',
    btn_exp: 'Recent Experiences',
    footer_rights: 'All rights reserved.',

    // Home Hero
    hero_title_1: 'Catalyzing your digital transformation through ',
    hero_title_2: 'innovation and AI.',
    hero_hi: "Hi, I'm Ayoub MOSLIH. I'm a",
    hero_role: 'Digital Transformation & AI Consultant',
    hero_desc: 'I empower organizations to reinvent their digital ecosystems, bridging strategic vision, human-centered design, and intelligent workflows.',
    
    // Home Sections
    home_section2_label: 'Experiences',
    home_section2_title: 'Recent Experiences',
    home_section2_desc: 'An overview of digital transformation projects — from strategic consulting to delivered products.',
    home_section3_label: 'Trajectories',
    home_section3_title: 'Professional Journey',
    home_section3_desc: '19 years of consulting and designing experiences, from art direction to AI strategy.',
    home_section3_download: 'Download Resume',

    // Work Page
    work_hero_label: 'Values',
    work_hero_title: 'Selected Work.',
    work_hero_desc: 'A collection of digital transformation, UX/UI design, and AI strategy projects.',
    work_hero_tag1: '10+ yrs Transformation',
    work_hero_tag2: '7+ yrs UX/UI',
    work_hero_tag3: '2+ yrs AI Strategy',
    
    work_grid_label: 'Portfolio',
    work_grid_title: 'All Projects',
    work_grid_desc: 'Click to explore the technical details of each implementation.',
    
    work_cert_label: 'Education',
    work_cert_title: 'Certifications',
    work_cert_desc: 'Certified training in digital strategy, design thinking, and AI.',

    // About Page
    about_hero_title1: 'Transformation & ',
    about_hero_title2: 'Strategy.',
    about_hero_desc: 'A consultant passionate about solving complex problems through technology, design, and people.',
    
    about_expert_label: 'Expertise',
    about_expert_title: 'What I do',
    about_expert_desc: 'My core pillars to accelerate your digital transition.',
    
    about_timeline_label: 'Journey',
    about_timeline_title: 'My Journey',
    about_timeline_desc: 'The key milestones of my career.',
    
    about_cert_label: 'Education',
    about_cert_title: 'Continuous Learning',
    about_cert_desc: 'Continuously learning to stay at the forefront of technology.',
    
    about_contact_label: 'Contact',
    about_contact_title: 'Let\'s Connect',
    about_contact_desc: 'Ready to turn your ideas into reality? Let\'s discuss your next project.',

    // Modal
    modal_title: 'Restricted Access',
    modal_desc: 'This prototype is confidential. Please enter the access code to view it.',
    modal_login: 'Access Code',
    modal_pass: 'Password',
    modal_btn: 'Access Project',

    // Chat
    chat_placeholder: 'Ask a question...',
    chat_online: 'Online',
    
    // Errors
    error_404_title: 'Page Not Found',
    error_404_desc: 'The page you are looking for does not exist, has been moved, or is temporarily unavailable.',
    error_404_cta: 'Back to Home',
    
    error_offline_title: 'Connection Lost',
    error_offline_desc: 'It seems you are no longer connected to the internet. Please check your connection and try again.',
    error_offline_cta: 'Retry',
    
    error_401_title: 'Unauthorized Access',
    error_401_desc: 'You are not logged in or your session has expired. Please log in to access this area.',
    error_401_cta: 'Log In',
    
    error_403_title: 'Access Denied',
    error_403_desc: 'You do not have the necessary permissions to access this resource.',
    error_403_cta: 'Back to Home',
    
    error_500_title: 'Server Error',
    error_500_desc: 'Oops, something went wrong on our end. We are working to fix the issue.',
    error_500_cta: 'Refresh Page',
    
    error_503_title: 'Service Maintenance',
    error_503_desc: 'The site is currently undergoing maintenance to offer you a better experience. We will be back shortly!',
    error_503_cta: 'Refresh Page'
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    // Detect browser language (fr or en, default to fr)
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang && browserLang.toLowerCase().startsWith('en')) {
      return 'en';
    }
    return 'fr';
  });

  const toggleLanguage = () => {
    setLang(prev => (prev === 'fr' ? 'en' : 'fr'));
  };

  const t = (key) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
