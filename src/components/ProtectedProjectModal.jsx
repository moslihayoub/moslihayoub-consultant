import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ExternalLink, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import CryptoJS from 'crypto-js';

const ProtectedProjectModal = ({ isOpen, onClose, onProceed, project }) => {
  const { lang, t } = useLanguage();
  const [code, setCode] = useState('');

  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCode('');
      setError(false);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    
    try {
      // Attempt to decrypt the URL
      const bytes = CryptoJS.AES.decrypt(project.url, code.trim());
      const decryptedUrl = bytes.toString(CryptoJS.enc.Utf8);
      
      // If it successfully decrypted to a valid URL string
      if (decryptedUrl && decryptedUrl.startsWith('http')) {
        setError(false);
        onProceed(decryptedUrl);
      } else {
        // Incorrect password results in empty string or gibberish
        setError(true);
      }
    } catch (err) {
      setError(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={styles.modalWrapper}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.overlay}
            onClick={onClose}
          />
          <div style={styles.modalContainer}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={styles.modal}
            >
              <button style={styles.closeBtn} onClick={onClose} className="hover-trigger">
                <X size={20} />
              </button>
              
              <div style={styles.iconContainer}>
                <Lock size={32} color="var(--color-electric-green)" />
              </div>
              
              <h3 style={styles.title}>{t('modal_title')}</h3>
              <p style={styles.description}>
                {lang === 'fr' ? (
                  <>L'accès à <strong>{project.title || 'ce projet'}</strong> est restreint. Ce prototype contient des <strong>données fictives de démonstration</strong> à des fins d'illustration et de test.</>
                ) : (
                  <>Access to <strong>{project.title || 'this project'}</strong> is restricted. This prototype contains <strong>fictional demonstration data</strong> for illustration and testing purposes.</>
                )}
              </p>
              
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label htmlFor="access-code" style={styles.inputLabel}>
                    {t('modal_login')}
                  </label>
                  <input
                    id="access-code"
                    type="password"
                    value={code}
                    onChange={(e) => { setCode(e.target.value); setError(false); }}
                    placeholder={lang === 'fr' ? "Saisir le code d'accès..." : "Enter access code..."}
                    style={{...styles.input, borderColor: error ? 'var(--color-error, #ff4444)' : 'var(--color-border)'}}
                    autoFocus
                  />
                  {error && <span style={{ color: 'var(--color-error, #ff4444)', fontSize: '0.8rem', marginTop: '4px' }}>{lang === 'fr' ? 'Mot de passe incorrect' : 'Incorrect password'}</span>}
                </div>
                
                <button
                  type="submit"
                  disabled={!code.trim()}
                  className="btn-primary hover-trigger"
                  style={{
                    ...styles.cta,
                    opacity: code.trim() ? 1 : 0.4,
                    cursor: code.trim() ? 'pointer' : 'not-allowed',
                    pointerEvents: code.trim() ? 'auto' : 'none',
                  }}
                >
                  <span>{t('modal_btn')}</span>
                  <ExternalLink size={18} />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

const styles = {
  modalWrapper: {
    position: 'fixed',
    inset: 0,
    zIndex: 10000,
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(4px)',
  },
  modalContainer: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  modal: {
    backgroundColor: 'var(--color-surface)',
    padding: '40px 32px',
    borderRadius: 'var(--radius-lg)',
    width: '90%',
    maxWidth: '440px',
    boxShadow: 'var(--shadow-lg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative',
    pointerEvents: 'auto',
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    color: 'var(--color-text-secondary)',
    padding: '8px',
  },
  iconContainer: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  title: {
    marginBottom: '10px',
    fontSize: '1.5rem',
  },
  description: {
    marginBottom: '24px',
    fontSize: '0.92rem',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.5,
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '8px',
    width: '100%',
  },
  inputLabel: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg)',
    color: 'var(--color-text-primary)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  cta: {
    width: '100%',
    justifyContent: 'center',
    transition: 'all 0.25s ease',
  }
};

export default ProtectedProjectModal;

