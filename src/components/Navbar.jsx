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

  return (
    <>
      <nav style={styles.nav} className="glass-panel">
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
        </div>
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
  }
};

export default Navbar;
