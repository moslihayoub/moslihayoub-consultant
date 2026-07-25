import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Brain, Layout, PenTool, Sparkles } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import { useLanguage } from '../contexts/LanguageContext';

const TwitterIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const HeroShape = React.lazy(() => import('../components/HeroShape'));

const TwitterTimeline = () => {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    // Clear the container
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      
      // Inject the exact HTML provided by the user
      const a = document.createElement('a');
      a.className = 'twitter-timeline';
      a.href = 'https://x.com/moslih84?ref_src=twsrc%5Etfw';
      a.setAttribute('data-theme', 'dark');
      a.textContent = 'Posts by moslih84';
      
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://platform.x.com/widgets.js';
      script.charset = 'utf-8';
      
      containerRef.current.appendChild(a);
      containerRef.current.appendChild(script);
      
      if (window.twttr && window.twttr.widgets) {
        window.twttr.widgets.load(containerRef.current);
      }
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '600px', margin: '0 auto', minHeight: '600px', borderRadius: '16px', overflow: 'hidden' }}
    />
  );
};

export default function XPost() {
  const { lang } = useLanguage();

  return (
    <AnimatedPage>
      <div className="page-wrapper" style={{ fontFamily: 'var(--font-family)' }}>
          
          {/* HERO SECTION */}
          <section className="section-margin">
            <div className="container page-hero-grid">
            <motion.div className="hero-text-container" style={{ minWidth: 0, width: '100%', maxWidth: '100%', overflow: 'visible' }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="section-label">X-Post</span>
              <h1 style={{ marginBottom: '8px' }}>Timeline.</h1>
              <h3 style={{ color: 'var(--color-electric-green)', marginBottom: '24px', fontWeight: 600 }}>{lang === 'fr' ? 'Mes dernières pensées' : 'My latest thoughts'}</h3>
              
              <div className="hero-tags-container" style={{ display: 'flex', gap: '10px', marginBottom: '32px', width: '100%' }}>
                {['Design', 'AI', 'Thoughts'].map((s, i) => (
                  <div key={i} style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', backgroundColor: '#333333', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '6px 16px', letterSpacing: '0.01em' }}>
                    {s}
                  </div>
                ))}
              </div>

              <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', marginBottom: '32px', maxWidth: '500px', lineHeight: 1.7 }}>
                {lang === 'fr' 
                  ? "Découvrez mes dernières réflexions sur le design, l'intelligence artificielle et l'innovation."
                  : "Discover my latest thoughts on design, artificial intelligence, and innovation."}
              </p>
            </motion.div>

            <motion.div className="page-hero-shape-wrapper" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} style={{ position: 'relative', minWidth: 0, width: '100%', maxWidth: '100%' }}>
              <div style={{ position: 'relative', width: '100%', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Suspense fallback={<div style={{ width: '100%', height: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}><div style={{ width: 120, height: 120, borderRadius: '50%', border: '2px solid #666666', animation: 'pulse 2s infinite' }} /></div>}>
                  <HeroShape height={480} variant="ring" color="#888888" />
                </Suspense>

                {/* Floating element 1 (Top right) */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="floating-tag-right"
                  style={{ position: 'absolute', top: '10%', backgroundColor: 'var(--color-surface)', padding: '12px 20px', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Sparkles size={18} color="var(--color-electric-green)" />
                  <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>{lang === 'fr' ? 'Inspiration' : 'Inspiration'}</h3>
                </motion.div>

                {/* Floating element 2 (Bottom left) */}
                <motion.div 
                  animate={{ y: [0, 15, 0] }} 
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="floating-tag-left"
                  style={{ position: 'absolute', bottom: '15%', backgroundColor: 'var(--color-surface)', padding: '12px 20px', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Brain size={18} color="var(--color-electric-green)" />
                  <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>{lang === 'fr' ? 'Pensées IA' : 'AI Thoughts'}</h3>
                </motion.div>

                {/* Floating element 3 (Top left) */}
                <motion.div 
                  animate={{ y: [0, -12, 0] }} 
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                  className="floating-tag-left"
                  style={{ position: 'absolute', top: '35%', backgroundColor: 'var(--color-surface)', padding: '12px 20px', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <PenTool size={18} color="var(--color-electric-green)" />
                  <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>{lang === 'fr' ? 'Design' : 'Design'}</h3>
                </motion.div>

                {/* Floating element 4 (Bottom right) */}
                <motion.div 
                  animate={{ y: [0, 12, 0] }} 
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                  className="floating-tag-right"
                  style={{ position: 'absolute', bottom: '5%', backgroundColor: 'var(--color-surface)', padding: '12px 20px', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Layout size={18} color="var(--color-electric-green)" />
                  <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>{lang === 'fr' ? 'Produit' : 'Product'}</h3>
                </motion.div>
              </div>
            </motion.div>
            </div>
          </section>

          {/* TIMELINE SECTION */}
          <section className="section-padding" style={{ paddingBottom: '120px' }}>
            <div className="container">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                <TwitterTimeline />
              </motion.div>
            </div>
          </section>

      </div>
    </AnimatedPage>
  );
}
