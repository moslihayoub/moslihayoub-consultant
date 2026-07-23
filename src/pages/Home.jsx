import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Calendar, MapPin, Briefcase } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import AnimatedPage from '../components/AnimatedPage';
import ProjectCard from '../components/ProjectCard';
import TiltWrapper from '../components/TiltWrapper';
import { useLanguage } from '../contexts/LanguageContext';
import { projectsData } from '../data/projects';

// The requested 3 recent projects
const featuredProjects = projectsData.filter(p => 
  ['autocash-sourcing', 'edrive', 'parceliq'].includes(p.id)
);

const timelineData = [
  {
    year: '2024 – Présent',
    title: 'Product Designer',
    company: 'AutoCash',
    city: 'Casablanca',
    type: 'CDI',
    desc: 'Audit UX, design system et intégration UX SaaS.'
  },
  {
    year: '2023',
    title: 'Consultant UX/UI Designer',
    company: 'JSEI Capital Market',
    city: 'Maroc / France',
    type: 'Consultant',
    desc: 'App M-Commerce, audit heuristique et méthodes Agile.'
  },
  {
    year: '2021 – 2023',
    title: 'Consultant UX/UI Designer',
    company: 'CGI & Wiggli',
    city: 'Casablanca / Laval',
    type: 'Consultant',
    desc: 'UX Research ATS et conception urbanisme Laval.'
  },
  {
    year: '2019 – 2020',
    title: 'Consultant UX/UI Designer',
    company: 'OCP SA & Crédit du Maroc',
    city: 'Casablanca',
    type: 'Consultant',
    desc: 'UX Research Big Data OCP et Intranet CDM.'
  },
  {
    year: '2017 – 2019',
    title: 'Directeur Artistique',
    company: 'TNC - The Next Clic',
    city: 'Casablanca',
    type: 'CDI',
    desc: 'Stratégie artistique, interfaces digitales et vidéos 2D.'
  },
  {
    year: '2008 – 2017',
    title: 'Graphic Designer & Formateur',
    company: 'Futur Digital, Emagin, Ictap',
    city: 'Casablanca / Paris',
    type: 'CDI',
    desc: 'Design web, identité visuelle, print. Team Leader.'
  }
];

function TimelineItem({ item, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isLeft = index % 2 === 0;
  
  const dotEl = (
    <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--color-surface)', border: '2px solid var(--color-electric-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px oklch(51.1% 0.096 186.391 / 0.2)' }}>
      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-electric-green)' }} />
    </div>
  );

  const typeColor = item.type === 'CDI' ? { bg: 'rgba(57,255,20,0.12)', color: 'var(--color-electric-green)' } : { bg: 'rgba(100,150,255,0.12)', color: '#7fa8ff' };

  const cardContent = (
    <TiltWrapper className="timeline-card hover-trigger" style={{ display: 'block', width: '100%', height: '100%' }}>
      <div style={{ padding: '20px 24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }} className="glass-panel">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-electric-green)', letterSpacing: '0.04em', justifyContent: isMobile ? 'flex-start' : isLeft ? 'flex-end' : 'flex-start' }}>
          <Calendar size={12} />{item.year}
        </div>
        <h3 style={{ fontFamily: "var(--font-family)", fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>{item.title}</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-electric-green)', fontWeight: 600, margin: 0, textAlign: isMobile ? 'left' : isLeft ? 'right' : 'left' }}>{item.company}</p>
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: isMobile ? 'flex-start' : isLeft ? 'flex-end' : 'flex-start' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', backgroundColor: 'rgba(0,0,0,0.05)', color: 'var(--color-text-secondary)' }}>
            <MapPin size={11} />{item.city}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', backgroundColor: typeColor.bg, color: typeColor.color }}>
            <Briefcase size={11} />{item.type}
          </span>
        </div>
        
        <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0, textAlign: isMobile ? 'left' : isLeft ? 'right' : 'left' }}>{item.desc}</p>
      </div>
    </TiltWrapper>
  );

  if (isMobile) {
    return (
      <div ref={ref} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '16px', marginBottom: '32px', opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0)' : 'translateY(24px)', transition: `opacity 0.5s ease ${index * 0.1}s,transform 0.5s ease ${index * 0.1}s` }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {dotEl}
          {index < timelineData.length - 1 && <div style={{ width: '2px', flex: 1, minHeight: '40px', backgroundColor: 'var(--color-border)' }} />}
        </div>
        <div style={{ flex: 1, paddingBottom: '8px' }}>
          {cardContent}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', position: 'relative', gap: '0', flexDirection: isLeft ? 'row' : 'row-reverse', opacity: isInView ? 1 : 0, transform: isInView ? 'translateX(0)' : `translateX(${isLeft ? '-40px' : '40px'})`, transition: `opacity 0.6s ease ${index * 0.1}s,transform 0.6s ease ${index * 0.1}s` }}>
      <div style={{ flex: '0 0 calc(50% - 28px)', padding: '0 24px', textAlign: isLeft ? 'right' : 'left' }}>
        {cardContent}
      </div>
      <div style={{ flex: '0 0 56px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        {dotEl}
      </div>
      <div style={{ flex: '0 0 calc(50% - 28px)' }} />
    </div>
  );
}

import ProtectedProjectModal from '../components/ProtectedProjectModal';

export default function Home() {
  const { t } = useLanguage();
  const [selectedProject, setSelectedProject] = useState(null);
  
  const handleProjectClick = (project) => {
    if (project.isProtected) {
      setSelectedProject(project);
    } else {
      window.open(project.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleProceed = () => {
    if (selectedProject) {
      window.open(selectedProject.url, '_blank', 'noopener,noreferrer');
      setSelectedProject(null);
    }
  };

  return (
    <AnimatedPage>
      <section id="accueil" data-scrollspy={t('nav_home')} className="home-hero-section">
        <div className="container">
          <div className="hero-grid">
            
            <motion.div className="hero-text-container" style={{ flex: '0 0 auto', minWidth: '480px', maxWidth: '560px' }} initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: 'easeOut' }}>
              <motion.div className="hero-role-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--color-electric-green)', backgroundColor: 'oklch(51.1% 0.096 186.391 / 0.1)', border: '1px solid oklch(51.1% 0.096 186.391 / 0.25)', borderRadius: '999px', padding: '6px 14px', marginBottom: '28px', width: 'fit-content' }} initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--color-electric-green)', display: 'inline-block', flexShrink: 0, animation: 'pulse-green 2s ease-in-out infinite' }} />
                {t('hero_role')}
              </motion.div>
              
              <h1 style={{ marginBottom: '24px' }}>
                {t('hero_title_1')}<br />
                <span style={{ color: 'var(--color-electric-green)' }}>{t('hero_title_2')}</span>
              </h1>
              
              <p style={{ maxWidth: '480px', marginBottom: '36px' }}>
                {t('hero_desc')}
              </p>
              
              <div className="hero-cta-container" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '36px' }}>
                <TiltWrapper>
                  <Link to="/work" className="btn-primary hover-trigger mobile-btn-adjust" style={{ margin: 0, height: '100%' }}>
                    <span className="hide-on-mobile">{t('btn_work')}</span>
                    <span className="hide-on-desktop">Mes projets</span>
                  </Link>
                </TiltWrapper>
                <TiltWrapper>
                  <a href="#timeline" className="btn-secondary hover-trigger mobile-btn-adjust" style={{ margin: 0, height: '100%' }}>
                    <span className="hide-on-mobile">{t('home_section3_label')} <ChevronRight size={17} /></span>
                    <span className="hide-on-desktop">Trajectoire</span>
                  </a>
                </TiltWrapper>
              </div>
              
              <motion.div className="hero-tags-container" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.45 }}>
                {["Digital Experience", "Delivery expert", "Product Thinking"].map((s, i) => (
                  <div key={i} style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', backgroundColor: '#333333', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '6px 16px', letterSpacing: '0.01em' }}>
                    {s}
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 0, width: '100%' }} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.75, delay: 0.2, ease: 'easeOut' }}>
              <div className="hero-marquee-container">
                <div className="marquee-column" style={{ animationDuration: '30s' }}>
                  {[1, 2].map((loop) => (
                    <div key={loop} className="marquee-content">
                      <img src="/assets/galerie/20230517_184215.jpg" alt="Gallery image" loading="lazy" />
                      <img src="/assets/galerie/20250419_155833.png" alt="Gallery image" loading="lazy" />
                      <img src="/assets/galerie/3_20250419_225936_0002.png" alt="Gallery image" loading="lazy" />
                      <img src="/assets/galerie/IMG-20230515-WA0022.jpg" alt="Gallery image" loading="lazy" />
                    </div>
                  ))}
                </div>
                <div className="marquee-column marquee-column-reverse" style={{ animationDuration: '35s', animationDelay: '-10s' }}>
                  {[1, 2].map((loop) => (
                    <div key={loop} className="marquee-content">
                      <img src="/assets/galerie/Screenshot 2026-07-19 at 18.45.54.png" alt="Gallery image" loading="lazy" />
                      <img src="/assets/galerie/Screenshot 2026-07-19 at 18.46.30.png" alt="Gallery image" loading="lazy" />
                      <img src="/assets/galerie/Screenshot 2026-07-19 at 18.52.01.png" alt="Gallery image" loading="lazy" />
                      <img src="/assets/galerie/447402561_1004591577261671_4782695626181526568_n.jpg" alt="Gallery image" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Mobile hero image fallback removed as requested */}
            </motion.div>
            
          </div>
        </div>
      </section>

      <section id="recent-work" data-scrollspy={t('home_section2_label')} className="section-padding">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: 'easeOut' }} style={{ marginBottom: '56px', maxWidth: '640px' }}>
            <span className="section-label">{t('home_section2_label')}</span>
            <h2 style={styles.sectionTitle}>{t('home_section2_title')}</h2>
            <p style={styles.sectionDesc}>
              {t('home_section2_desc')}
            </p>
          </motion.div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '28px' }}>
            {featuredProjects.map((project, index) => (
              <motion.div key={project.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5, delay: index * 0.12 }} style={{ height: '100%' }}>
                <ProjectCard project={project} onClick={handleProjectClick} />
              </motion.div>
            ))}
          </div>
          
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }} style={{ marginTop: '48px', display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/work" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-electric-green)', fontWeight: 600, textDecoration: 'none', fontSize: '0.93rem', transition: 'gap 0.2s ease' }} className="hover-trigger hover-lift">{t('btn_work')} <ChevronRight size={16} /></Link>
          </motion.div>
        </div>
      </section>

      <section id="timeline" data-scrollspy={t('home_section3_label')} className="section-padding" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: 'easeOut' }} style={{ marginBottom: '56px', maxWidth: '640px' }}>
            <span className="section-label">{t('home_section3_label')}</span>
            <h2 style={styles.sectionTitle}>{t('home_section3_title')}</h2>
            <p style={styles.sectionDesc}>
              {t('home_section3_desc')}
            </p>
          </motion.div>
          
          <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto', paddingBottom: '40px' }}>
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, transparent, var(--color-border) 10%, var(--color-border) 90%, transparent)', transform: 'translateX(-50%)', zIndex: 0 }} className="hide-on-mobile" />
            {timelineData.map((item, index) => <TimelineItem key={index} item={item} index={index} />)}
          </div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} style={{ marginTop: '64px', display: 'flex', justifyContent: 'center' }}>
            <Link to="/about" className="btn-primary hover-trigger">En savoir plus <ArrowRight size={18} /></Link>
          </motion.div>
        </div>
      </section>
      
      <style>{`
        @media(max-width: 768px) {
          .hero-text-container {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
            text-align: left;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
          .hero-text-container p { text-align: left; margin-left: 0; margin-right: 0; }
          .hero-cta-container {
            width: 100%;
            display: flex;
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 16px !important;
            overflow: visible;
          }
          .hero-cta-container > * { width: 100%; }
          .mobile-btn-adjust {
            width: 100% !important;
            padding: 16px !important;
            font-size: 1rem !important;
            text-align: center;
            justify-content: center;
          }
          
          .hero-tags-container {
            width: 100%;
            justify-content: flex-start;
            flex-wrap: nowrap !important;
            overflow-x: auto;
            -ms-overflow-style: none;
            scrollbar-width: none;
            padding-bottom: 12px;
            margin-right: -24px;
            padding-right: 24px;
          }
          .hero-tags-container::-webkit-scrollbar { display: none; }
          .hero-tags-container > div { flex-shrink: 0; }
          
          /* Horizontal Marquee on mobile */
          .hero-marquee-container {
            height: 70vh !important;
            display: flex !important;
            flex-direction: row !important;
            overflow-x: hidden !important;
            overflow-y: visible !important;
            width: 100vw !important;
            margin-left: -24px !important;
            mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%) !important;
            -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%) !important;
            margin-bottom: 24px;
            align-items: center;
          }
          .marquee-column {
            flex-direction: row !important;
            animation: marquee-horizontal 25s linear infinite !important;
            width: max-content !important;
            gap: 16px !important;
          }
          .marquee-column-reverse {
            display: none !important;
          }
          .marquee-content {
            flex-direction: row !important;
            width: max-content !important;
            gap: 16px !important;
          }
          .marquee-content img {
            width: auto !important;
            height: 60vh !important;
            border-radius: 24px !important;
            max-width: none !important;
            flex-shrink: 0 !important;
          }
        }
        .hero-marquee-container {
          width: 100%;
          max-width: 540px;
          height: 600px;
          margin-left: auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          overflow: hidden;
          mask-image: linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%);
        }
        .marquee-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
          animation: marquee-vertical linear infinite;
        }
        .marquee-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .marquee-content img {
          width: 100%;
          border-radius: 20px;
          object-fit: cover;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--color-border);
          filter: grayscale(100%);
          transition: filter 0.4s ease, transform 0.4s ease;
        }
        .marquee-content img:hover {
          filter: grayscale(0%);
          transform: scale(1.02);
        }
        @keyframes marquee-vertical {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes marquee-horizontal {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-horizontal-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
      <ProtectedProjectModal isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} onProceed={handleProceed} project={selectedProject || {}} />
    </AnimatedPage>
  );
}

const styles = {
  sectionTitle: {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    letterSpacing: '-0.03em',
    marginBottom: '16px',
    marginTop: '12px',
    color: 'var(--color-text-primary)'
  },
  sectionDesc: {
    fontSize: '1.05rem',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.6
  }
};
