import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    functional: true,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent_choice');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(
      'cookie_consent_choice',
      JSON.stringify({ choice: 'accepted', preferences: { essential: true, analytics: true, functional: true } })
    );
    setIsVisible(false);
  };

  const handleRefuse = () => {
    localStorage.setItem(
      'cookie_consent_choice',
      JSON.stringify({ choice: 'refused', preferences: { essential: true, analytics: false, functional: false } })
    );
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem(
      'cookie_consent_choice',
      JSON.stringify({ choice: 'custom', preferences })
    );
    setIsVisible(false);
  };

  const handleClose = () => {
    localStorage.setItem(
      'cookie_consent_choice',
      JSON.stringify({ choice: 'closed', preferences: { essential: true, analytics: false, functional: false } })
    );
    setIsVisible(false);
  };

  const togglePreference = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div style={styles.backdrop}>
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            style={styles.container}
          >
            {/* Header */}
            <div style={styles.header}>
              <h3 style={styles.title}>Gérer le consentement</h3>
              <button
                onClick={handleClose}
                style={styles.closeBtn}
                className="hover-trigger"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            {!showPreferences ? (
              <>
                <p style={styles.description}>
                  Pour vous offrir la meilleure expérience possible, nous utilisons des technologies comme les cookies pour stocker et/ou accéder aux informations de votre appareil. En acceptant ces technologies, vous nous autorisez à traiter des données telles que votre comportement de navigation ou vos identifiants uniques sur ce site. Refuser ou retirer votre consentement peut affecter certaines fonctionnalités.
                </p>

                {/* Actions */}
                <div style={styles.actionsGroup}>
                  <button onClick={handleAccept} className="btn-primary hover-trigger" style={styles.btnCta}>
                    Accepter
                  </button>
                  <button onClick={handleRefuse} className="btn-secondary hover-trigger" style={styles.btnSecondary}>
                    Refuser
                  </button>
                  <button onClick={() => setShowPreferences(true)} className="btn-secondary hover-trigger" style={styles.btnSecondary}>
                    Afficher les préférences
                  </button>
                </div>
              </>
            ) : (
              <>
                <p style={styles.description}>
                  Personnalisez vos choix de confidentialité ci-dessous. Les cookies nécessaires au fonctionnement de base sont toujours activés.
                </p>

                <div style={styles.prefList}>
                  {/* Item 1 */}
                  <div style={styles.prefItem}>
                    <div style={styles.prefInfo}>
                      <span style={styles.prefLabel}>Cookies Nécessaires</span>
                      <p style={styles.prefDesc}>Requis pour le bon fonctionnement et la sécurité du site.</p>
                    </div>
                    <span style={styles.alwaysActive}>Toujours actif</span>
                  </div>

                  {/* Item 2 */}
                  <div style={styles.prefItem}>
                    <div style={styles.prefInfo}>
                      <span style={styles.prefLabel}>Cookies Analytiques</span>
                      <p style={styles.prefDesc}>Permettent de mesurer le trafic et la navigation sur le site.</p>
                    </div>
                    <div
                      onClick={() => togglePreference('analytics')}
                      className="hover-trigger"
                      style={{
                        ...styles.toggleTrack,
                        backgroundColor: preferences.analytics ? 'var(--color-electric-green)' : 'var(--color-border)',
                      }}
                    >
                      <div
                        style={{
                          ...styles.toggleThumb,
                          transform: preferences.analytics ? 'translateX(20px)' : 'translateX(0px)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div style={styles.prefItem}>
                    <div style={styles.prefInfo}>
                      <span style={styles.prefLabel}>Cookies Fonctionnels</span>
                      <p style={styles.prefDesc}>Mémorisent vos préférences d'affichage et de langue.</p>
                    </div>
                    <div
                      onClick={() => togglePreference('functional')}
                      className="hover-trigger"
                      style={{
                        ...styles.toggleTrack,
                        backgroundColor: preferences.functional ? 'var(--color-electric-green)' : 'var(--color-border)',
                      }}
                    >
                      <div
                        style={{
                          ...styles.toggleThumb,
                          transform: preferences.functional ? 'translateX(20px)' : 'translateX(0px)',
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={styles.actionsGroup}>
                  <button onClick={handleSavePreferences} className="btn-primary hover-trigger" style={styles.btnCta}>
                    Enregistrer les préférences
                  </button>
                  <button onClick={() => setShowPreferences(false)} className="btn-secondary hover-trigger" style={styles.btnSecondary}>
                    Retour
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const styles = {
  backdrop: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    left: 'auto',
    zIndex: 90000,
    display: 'flex',
    justifyContent: 'flex-end',
    pointerEvents: 'none',
    maxWidth: 'calc(100vw - 48px)',
  },
  container: {
    pointerEvents: 'auto',
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '24px',
    padding: '28px 32px',
    maxWidth: '520px',
    width: '100%',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.12)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.02em',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--color-text-secondary)',
    padding: '6px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    margin: 0,
    fontSize: '0.88rem',
    lineHeight: 1.6,
    color: 'var(--color-text-secondary)',
  },
  actionsGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '6px',
    alignItems: 'center',
  },
  btnCta: {
    color: '#ffffff',
    padding: '12px 24px',
    fontSize: '0.88rem',
  },
  btnSecondary: {
    padding: '12px 24px',
    fontSize: '0.88rem',
  },
  prefList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    margin: '4px 0',
  },
  prefItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '16px 20px',
    borderRadius: '16px',
    backgroundColor: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
  },
  prefInfo: {
    flex: 1,
  },
  prefLabel: {
    fontSize: '0.92rem',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    display: 'block',
  },
  prefDesc: {
    margin: '2px 0 0 0',
    fontSize: '0.78rem',
    color: 'var(--color-text-secondary)',
  },
  alwaysActive: {
    fontSize: '0.82rem',
    fontWeight: 700,
    color: 'var(--color-electric-green)',
    whiteSpace: 'nowrap',
  },
  toggleTrack: {
    width: '44px',
    height: '24px',
    borderRadius: '999px',
    position: 'relative',
    padding: '2px',
    transition: 'background-color 0.25s ease',
    flexShrink: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  toggleThumb: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 2px 5px rgba(0,0,0,0.25)',
    transition: 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
  },
};

export default CookieBanner;
