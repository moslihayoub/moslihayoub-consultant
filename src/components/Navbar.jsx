import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Home, User, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar = () => {
  const location = useLocation();
  const { lang, toggleLanguage, t } = useLanguage();

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
      {/* Top Navbar (Desktop only) */}
      <nav style={styles.nav} className="glass-panel hide-on-mobile">
        <div className="container" style={styles.navContainer}>
          <Link to="/" style={styles.logo}>
            <img src="/favicon.svg" alt="Ayoub MOSLIH Logo" style={{ width: '24px', height: '24px' }} />
            Ayoub MOSLIH
          </Link>
          
          <ul style={styles.navLinks}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.name} style={styles.navItem}>
                  <Link to={link.path} style={{ ...styles.navLink, color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }} className="hover-trigger" title={link.name} aria-label={link.name}>
                    {link.icon}
                    {isActive && (
                      <motion.div
                        layoutId="navIndicatorDesktop"
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
        </div>
      </nav>

      {/* Bottom Floating Navbar (Mobile only) */}
      <nav style={styles.bottomNav} className="glass-panel hide-on-desktop">
        <ul style={styles.bottomNavLinks}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <li key={link.name} style={{ position: 'relative' }}>
                <Link 
                  to={link.path} 
                  style={{ ...styles.bottomNavLink, color: isActive ? 'var(--color-electric-green)' : 'var(--color-text-secondary)' }}
                  className="hover-trigger"
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    {link.icon}
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="navIndicatorMobile"
                      style={styles.activeIndicatorBottom}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
          
          <li style={{ position: 'relative' }}>
            <button onClick={toggleLanguage} style={styles.bottomNavLink} className="hover-trigger">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--color-text-secondary)' }}>
                <Globe size={18} />
              </div>
            </button>
          </li>
        </ul>
      </nav>
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
  bottomNav: {
    position: 'fixed',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90%',
    padding: '12px 16px',
    borderRadius: 'var(--radius-full)',
    zIndex: 100,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  },
  bottomNavLinks: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    width: '100%',
  },
  bottomNavLink: {
    background: 'none',
    border: 'none',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textDecoration: 'none',
    cursor: 'none',
  },
  activeIndicatorBottom: {
    position: 'absolute',
    top: '-4px',
    left: '20%',
    right: '20%',
    height: '3px',
    backgroundColor: 'var(--color-electric-green)',
    borderRadius: '3px',
  },
};

export default Navbar;
