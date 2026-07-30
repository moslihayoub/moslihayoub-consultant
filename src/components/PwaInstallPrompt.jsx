import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const PwaInstallPrompt = ({ isAdminRoute }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const { t, lang } = useLanguage();

  useEffect(() => {
    let fired = false;
    const handler = (e) => {
      fired = true;
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Fallback for iOS / Safari or when beforeinstallprompt doesn't fire
    const timer = setTimeout(() => {
      if (!fired && !window.matchMedia('(display-mode: standalone)').matches && !window.navigator.standalone) {
        setIsVisible(true);
      }
    }, 3500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert(lang === 'fr' 
        ? "Pour installer l'application, appuyez sur l'icône de partage ⍗ (iOS) ou sur le menu ⋮ (Android/Chrome) puis choisissez 'Ajouter sur l'écran d'accueil'." 
        : "To install the app, tap the share icon ⍗ (iOS) or the menu ⋮ (Android/Chrome) and select 'Add to Home Screen'.");
      setIsVisible(false);
      return;
    }
    // Hide our user interface that shows our A2HS button
    setIsVisible(false);
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={styles.container}
          className="glass-panel pwa-toaster"
        >
          <style>{`
            .pwa-toaster {
              left: 50%;
              transform: translateX(-50%) !important;
            }
            @media (min-width: 768px) {
              .pwa-toaster {
                bottom: auto !important;
                top: 24px !important;
                left: auto !important;
                right: 24px !important;
                transform: none !important;
              }
            }
          `}</style>
          <button onClick={handleClose} style={styles.closeBtn} aria-label="Close">
            <X size={16} />
          </button>
          <div style={styles.content}>
            <div style={styles.iconContainer}>
              <img src={isAdminRoute ? "/admin-icon.svg" : "/favicon.svg"} alt="App Icon" style={styles.icon} />
            </div>
            <div style={styles.textContainer}>
              <h4 style={styles.title}>
                {isAdminRoute 
                  ? 'M84 Admin' 
                  : (lang === 'fr' ? 'Ayoub MOSLIH - Portfolio' : 'Ayoub MOSLIH - Portfolio')}
              </h4>
              <p style={styles.desc}>
                {isAdminRoute 
                  ? (lang === 'fr' ? 'Installez le Backoffice pour gérer vos leads.' : 'Install the Backoffice to manage leads.')
                  : (lang === 'fr' ? 'Installez l\'application pour explorer mes projets.' : 'Install the app to explore my projects.')}
              </p>
            </div>
          </div>
          <button onClick={handleInstallClick} className="btn-primary hover-trigger" style={styles.installBtn}>
            <Download size={16} />
            {lang === 'fr' ? 'Installer' : 'Install'}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: '100px', // Fallback for mobile (above navbar)
    left: '50%',
    transform: 'translateX(-50%)', // Note: Framer Motion overrides this with its own x/y
    width: '90%',
    maxWidth: '380px',
    padding: '20px',
    borderRadius: '24px',
    zIndex: 9999,
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    backgroundColor: 'var(--color-surface)',
  },
  // We'll use a media query for desktop top-right positioning

  closeBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'transparent',
    border: 'none',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
  },
  content: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    paddingRight: '20px', // Space for close button
  },
  iconContainer: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: 'rgba(57,255,20,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    border: '1px solid rgba(57,255,20,0.2)',
  },
  icon: {
    width: '28px',
    height: '28px',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    margin: '0 0 6px 0',
    fontSize: '1.05rem',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
  },
  desc: {
    margin: 0,
    fontSize: '0.85rem',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.4,
  },
  installBtn: {
    width: '100%',
    justifyContent: 'center',
    padding: '12px',
    fontSize: '0.95rem',
    margin: 0,
  }
};

export default PwaInstallPrompt;
