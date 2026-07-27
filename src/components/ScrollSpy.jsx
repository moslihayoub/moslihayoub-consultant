import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollSpy() {
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState('');
  const [activeProgress, setActiveProgress] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
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
      right: '24px',
      top: '50%',
      transform: 'translateY(-50%)',
      opacity: activeIndex > 0 ? 1 : 0,
      transition: 'opacity 0.4s ease',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 9990,
      pointerEvents: 'none',
      alignItems: 'flex-end',
      padding: '12px 8px',
    }} className="hide-on-mobile">
      {sections.map((section, index) => {
        const isActive = section.id === activeSection;
        const isPast = index < activeIndex;
        const isHovered = hoveredIndex === index;
        
        return (
          <div key={section.id} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            {index < sections.length - 1 && (
              <>
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '11px',
                  width: '2px',
                  height: 'calc(100% + 12px)',
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  zIndex: 1
                }} />
                <motion.div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '11px',
                  width: '2px',
                  height: 'calc(100% + 12px)',
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
              height: '36px',
              marginBottom: index < sections.length - 1 ? '12px' : '0',
              flexDirection: 'row-reverse',
              cursor: 'pointer',
              pointerEvents: 'auto',
              position: 'relative'
            }}
            className="hover-trigger"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
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
                width: isHovered || isActive ? '24px' : '20px',
                height: isHovered || isActive ? '24px' : '20px',
                borderRadius: '50%',
                backgroundColor: isActive ? 'var(--color-electric-green)' : 'var(--color-surface)',
                border: `2px solid ${isActive || isPast ? 'var(--color-electric-green)' : '#cbd5e1'}`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 3,
                boxShadow: isActive ? '0 0 12px oklch(51.1% 0.096 186.391 / 0.4)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}>
                {isActive && (
                  <motion.div
                    layoutId="activeScrollDot"
                    style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-surface)' }}
                  />
                )}
              </div>

              {/* Floating label on hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: 10, scale: 0.92 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 8, scale: 0.92 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    style={{
                      position: 'absolute',
                      right: '34px',
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-primary)',
                      padding: '6px 14px',
                      borderRadius: '10px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      border: '1px solid var(--color-border)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      zIndex: 10
                    }}
                  >
                    {section.title}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
