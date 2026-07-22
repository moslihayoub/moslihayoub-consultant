import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ScrollSpy() {
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState('');
  const [activeProgress, setActiveProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // Wait for the page transition/rendering
    const timer = setTimeout(() => {
      const sectionElements = Array.from(document.querySelectorAll('section[data-scrollspy]'));
      if (sectionElements.length === 0) {
        setSections([]);
        return;
      }
      
      const sectionsData = sectionElements.map((el) => ({
        id: el.id,
        title: el.getAttribute('data-scrollspy'),
        top: el.offsetTop,
        height: el.offsetHeight
      }));
      setSections(sectionsData);
      if (sectionsData.length > 0 && !activeSection) {
        setActiveSection(sectionsData[0].id);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      const sectionElements = Array.from(document.querySelectorAll('section[data-scrollspy]'));
      if (sectionElements.length === 0) return;
      
      let current = '';
      let progress = 0;
      for (let i = 0; i < sectionElements.length; i++) {
        const el = sectionElements[i];
        const top = el.offsetTop;
        const height = el.offsetHeight;
        
        const sectionStart = top - windowHeight / 3;
        const sectionEnd = top + height - windowHeight / 3;
        
        if (scrollY >= sectionStart && scrollY < sectionEnd) {
          current = el.id;
          const p = (scrollY - sectionStart) / (sectionEnd - sectionStart);
          progress = Math.max(0, Math.min(1, p));
        }
      }
      
      // Force last section if scrolled to bottom
      if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
        current = sectionElements[sectionElements.length - 1].id;
        progress = 1;
      }
      
      // Force first section if scrolled to top
      if (scrollY < 50) {
        current = sectionElements[0].id;
        progress = 0;
      }

      setActiveSection(current);
      setActiveProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  if (sections.length <= 1) return null;

  const activeIndex = sections.findIndex(s => s.id === activeSection);

  return (
    <div style={{
      position: 'fixed',
      right: '32px',
      top: '50%',
      transform: 'translateY(-50%)',
      opacity: activeIndex > 0 ? 1 : 0,
      transition: 'opacity 0.4s ease',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 9990,
      pointerEvents: 'none',
      alignItems: 'flex-end',
      backgroundColor: 'transparent',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      padding: '24px 16px',
      borderRadius: '32px',
    }} className="hide-on-mobile">
      {sections.map((section, index) => {
        const isActive = section.id === activeSection;
        const isPast = index < activeIndex;
        
        return (
          <div key={section.id} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            {index < sections.length - 1 && (
              <>
                <div style={{
                  position: 'absolute',
                  top: '24px',
                  right: '11px',
                  width: '2px',
                  height: 'calc(100% + 16px)',
                  backgroundColor: '#e0e0e0',
                  zIndex: 1
                }} />
                <motion.div style={{
                  position: 'absolute',
                  top: '24px',
                  right: '11px',
                  width: '2px',
                  height: 'calc(100% + 16px)',
                  backgroundColor: 'var(--color-electric-green)',
                  zIndex: 2,
                  originY: 0
                }}
                initial={false}
                animate={{ scaleY: isPast ? 1 : (isActive ? activeProgress : 0) }}
                transition={{ duration: 0.1, ease: 'linear' }}
                />
              </>
            )}
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              height: '40px',
              marginBottom: index < sections.length - 1 ? '16px' : '0',
              flexDirection: 'row-reverse',
              cursor: 'pointer',
              pointerEvents: 'auto',
            }}
            className="hover-trigger"
            onClick={() => {
              const el = document.getElementById(section.id);
              if (el) {
                const offset = 80;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = el.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;
                
                window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth'
                });
              }
            }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: isActive ? 'var(--color-electric-green)' : 'var(--color-surface)',
                border: `2px solid ${isActive || isPast ? 'var(--color-electric-green)' : '#e0e0e0'}`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2,
                transition: 'all 0.4s ease',
              }}>
                {isActive && (
                  <motion.div
                    layoutId="activeScrollDot"
                    style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-surface)' }}
                  />
                )}
              </div>
              
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.05 : 1,
                  x: isActive ? -5 : 0,
                  color: isActive ? 'var(--color-text-primary)' : isPast ? 'var(--color-text-secondary)' : '#a0a0a0'
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 700 : 600,
                  textShadow: '0 0 10px rgba(255,255,255,1), 0 0 15px rgba(255,255,255,1)',
                  transformOrigin: 'right center'
                }}
              >
                {section.title}
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
