import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Home, User, Globe, Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar = () => {
  const location = useLocation();
  const { lang, toggleLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: t('nav_home'), path: '/', icon: <Home size={18} /> },
    { name: t('nav_work'), path: '/work', icon: <Briefcase size={18} /> },
    { name: t('nav_about'), path: '/about', icon: <User size={18} /> },
  ];

  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Ayoub MOSLIH
TITLE:Lead Product Designer & AI Product Strategy Manager
TEL:+212626084793
EMAIL:moslihayoub@gmail.com
URL:https://www.linkedin.com/in/moslih84/
END:VCARD`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(vcard)}&color=000000&bgcolor=ffffff`;

  return (
    <>
      <nav style={styles.nav} className="glass-panel">
        <div className="container" style={styles.navContainer}>
          <Link to="/" style={styles.logo}>
            <img src="/favicon.svg" alt="Ayoub MOSLIH Logo" style={{ width: '24px', height: '24px' }} />
            Ayoub MOSLIH
          </Link>
          
          <ul style={styles.navLinks} className="hide-on-mobile">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.name} style={styles.navItem}>
                  <Link to={link.path} style={{ ...styles.navLink, color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }} className="hover-trigger" title={link.name} aria-label={link.name}>
                    {link.icon}
                    {isActive && (
                      <motion.div
                        layoutId="navIndicator"
                        style={styles.activeIndicator}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
            
            <li style={styles.navItem}>
              <button onClick={toggleLanguage} style={styles.langBtn} className="hover-trigger" aria-label="Toggle language">
                <Globe size={18} color="var(--color-text-secondary)" />
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>
                  {lang.toUpperCase()}
                </span>
              </button>
            </li>
          </ul>

          <button 
            className="hide-on-desktop hover-trigger" 
            onClick={() => setIsMobileMenuOpen(true)}
            style={styles.burgerBtn}
            aria-label="Open menu"
          >
            <Menu size={24} color="var(--color-text-primary)" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={styles.mobileOverlay}
          >
            <div style={styles.mobileHeader}>
              <Link to="/" style={styles.logo} onClick={() => setIsMobileMenuOpen(false)}>
                <img src="/favicon.svg" alt="Ayoub MOSLIH Logo" style={{ width: '24px', height: '24px' }} />
                Ayoub MOSLIH
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                style={styles.closeBtn}
                className="hover-trigger"
              >
                <X size={32} color="var(--color-text-primary)" />
              </button>
            </div>

            <div style={styles.mobileContent}>
              <ul style={styles.mobileNavLinks}>
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <li key={link.name} style={{ width: '100%' }}>
                      <Link 
                        to={link.path} 
                        style={{ ...styles.mobileNavLink, color: isActive ? 'var(--color-electric-green)' : 'var(--color-text-primary)' }}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.icon}
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <button onClick={toggleLanguage} style={styles.mobileLangBtn} className="hover-trigger">
                <Globe size={24} color="var(--color-text-primary)" />
                <span style={{ fontWeight: 600 }}>{lang === 'fr' ? 'Switch to English' : 'Passer en Français'}</span>
              </button>

              <div style={styles.mobileQrContainer}>
                <span style={{ fontSize: '1rem', color: 'var(--color-electric-green)', fontWeight: 800 }}>↓</span>
                <img src={qrCodeUrl} alt="QR Code" style={styles.mobileQr} />
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
                  {lang === 'fr' ? "Scanner Contact" : "Scan Contact"}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const styles = {
  nav: {
    position: 'fixed',
    top: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90%',
    maxWidth: '800px',
    padding: '16px 24px',
    borderRadius: 'var(--radius-full)',
    zIndex: 100,
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 0,
  },
  logo: {
    fontSize: '1.25rem',
    fontWeight: 700,
    textDecoration: 'none',
    color: 'var(--color-text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  navLinks: {
    display: 'flex',
    gap: '24px',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    alignItems: 'center',
  },
  navItem: {
    position: 'relative',
  },
  navLink: {
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 0',
    transition: 'color 0.2s',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: '-8px',
    left: 0,
    right: 0,
    height: '2px',
    backgroundColor: 'var(--color-electric-green)',
    borderRadius: '2px',
  },
  langBtn: {
    background: 'none',
    border: 'none',
    padding: '4px 0',
    cursor: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  burgerBtn: {
    background: 'none',
    border: 'none',
    padding: '4px',
    cursor: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'var(--color-surface)',
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
  },
  mobileHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '48px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    padding: '8px',
    cursor: 'none',
    display: 'flex',
  },
  mobileContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '48px',
  },
  mobileNavLinks: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    gap: '32px',
  },
  mobileNavLink: {
    fontSize: '2rem',
    fontWeight: 700,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'color 0.2s',
  },
  mobileQrContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    marginTop: 'auto',
    marginBottom: '24px',
  },
  mobileQr: {
    width: '140px',
    height: '140px',
    borderRadius: '16px',
    padding: '8px',
    backgroundColor: '#fff',
    border: '1px solid var(--color-border)',
  },
  mobileLangBtn: {
    background: 'rgba(0, 0, 0, 0.05)',
    border: 'none',
    padding: '16px 24px',
    borderRadius: 'var(--radius-full)',
    cursor: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '12px',
    fontSize: '1.1rem',
    width: '100%',
  }
};

export default Navbar;
