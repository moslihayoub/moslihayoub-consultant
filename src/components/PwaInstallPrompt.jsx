import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const PwaInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const { t, lang } = useLanguage();

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
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
          initial={{ opacity: 0, x: "-50%", y: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: "-50%", y: 0, scale: 1 }}
          exit={{ opacity: 0, x: "-50%", y: 50, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={styles.container}
          className="glass-panel"
        >
          <button onClick={handleClose} style={styles.closeBtn} aria-label="Close">
            <X size={16} />
          </button>
          <div style={styles.content}>
            <div style={styles.iconContainer}>
              <img src="/favicon.svg" alt="App Icon" style={styles.icon} />
            </div>
            <div style={styles.textContainer}>
              <h4 style={styles.title}>
                {lang === 'fr' ? 'Ayoub MOSLIH - Portfolio App' : 'Ayoub MOSLIH - Portfolio App'}
              </h4>
              <p style={styles.desc}>
                {lang === 'fr' 
                  ? 'Installez l\'application pour explorer confortablement mes projets Product Design & MVP IA. L\'expérience idéale pour les cabinets RH et décideurs.' 
                  : 'Install the app to comfortably explore my Product Design & AI MVP projects. The ideal experience for HR agencies and decision-makers.'}
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
    bottom: '90px', // Above the mobile nav bar
    left: '50%',
    width: '90%',
    maxWidth: '400px',
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
