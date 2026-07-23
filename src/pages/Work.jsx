import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useInView } from 'framer-motion';
import { Award, CheckCircle2, Clock, FolderOpen, Search, Brain, Layout, Compass, Smartphone, Target, Bot } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import ProjectCard from '../components/ProjectCard';
import ProtectedProjectModal from '../components/ProtectedProjectModal';
import TiltWrapper from '../components/TiltWrapper';
import { useLanguage } from '../contexts/LanguageContext';

import { projectsData } from '../data/projects';

const clients = ['Autocash', 'Carrefour', 'Foodeals', 'Nexastay', 'Babmoulay driss', 'JSEI', 'CGI', 'Wiggli', 'OCP', 'CDM Bank', 'Stibits', 'HBM Com.'];

const certifications = [
  { title: 'Certification Anthropic gjht8vtzj8ve', issuer: 'Anthropic', year: '2024', url: '/certif/Anthropic/certificate-gjht8vtzj8ve-1775037520.pdf' },
  { title: 'Certification Google 3DLGWZ6GZOIA', issuer: 'Google', year: '2024', url: '/certif/Google/Coursera 3DLGWZ6GZOIA.pdf' },
  { title: 'Certification IBM & SkillUP ZJQCGFYO8QNO', issuer: 'IBM & SkillUP', year: '2024', url: '/certif/IBM & SkillUP/Coursera ZJQCGFYO8QNO.pdf' },
];

const TiltCard = ({ children, style }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-60, 60], [6, -6]);
  const rotateY = useTransform(x, [-60, 60], [-6, 6]);
  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 900, ...style }}
      onMouseMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); x.set(e.clientX - (rect.left + rect.width / 2)); y.set(e.clientY - (rect.top + rect.height / 2)); }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >{children}</motion.div>
  );
};

const CertCard = ({ cert, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <a
      href={cert.url}
      target="_blank"
      rel="noopener noreferrer"
      ref={ref}
      className="project-card hover-trigger hover-lift"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.55s ease ${index * 0.1}s, transform 0.55s ease ${index * 0.1}s, box-shadow 0.3s ease`,
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--color-border)',
        textDecoration: 'none',
      }}
    >
      <div style={{ width: '100%', paddingTop: '65%', position: 'relative', backgroundColor: 'var(--color-bg)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(57,255,20,0.03)', color: 'var(--color-electric-green)', padding: '20px', textAlign: 'center' }}>
          <Award size={36} style={{ marginBottom: '12px', opacity: 0.8 }} />
          <span style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cert.issuer}</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.6, marginTop: '8px' }}>Certificat</span>
        </div>
      </div>
      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--color-text-primary)' }}>{cert.title}</h3>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
          <Clock size={14} />
          <span>Année: {cert.year}</span>
        </div>
      </div>
    </a>
  );
};

const Work = () => {
  const { t, lang } = useLanguage();
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('Tous');
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.65;
    }
  }, []);

  const filteredProjects = projectsData.filter(project => {
    if (activeTab === 'Tous') return true;
    return project.category === activeTab;
  });

  const handleProjectClick = (project) => { if (project.isProtected) { setSelectedProject(project); } else { window.open(project.url, '_blank', 'noopener,noreferrer'); } };
  const handleProceed = () => { if (selectedProject) { window.open(selectedProject.url, '_blank', 'noopener,noreferrer'); setSelectedProject(null); } };

  return (
    <AnimatedPage>
      <div className="page-wrapper">
        <section id="work-hero" data-scrollspy={t('work_hero_label')}>
          <div className="container">
            <div style={styles.heroGrid}>
              <motion.div style={styles.heroLeft} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, ease: 'easeOut' }}>
                <span style={styles.sectionLabel}>{t('work_hero_label')}</span>
                <h1 style={styles.heroTitle}>{t('work_hero_title')}</h1>
                <p style={styles.heroDesc}>{t('work_hero_desc')}</p>
                <motion.div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.25 }}>
                  {[t('work_hero_tag1'), t('work_hero_tag2'), t('work_hero_tag3')].map((s, i) => (
                    <div key={i} style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', backgroundColor: '#333333', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '6px 16px', letterSpacing: '0.01em' }}>
                      {s}
                    </div>
                  ))}
                </motion.div>

              </motion.div>
              <motion.div style={{ ...styles.heroRight, position: 'relative' }} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.75, delay: 0.2, ease: 'easeOut' }}>
                <div style={{ position: 'relative', width: '100%', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <video 
                    ref={videoRef}
                    src="/assets/vid-HS/works.mp4" 
                    preload="none"
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="video-mask"
                    style={{ width: '100%', height: '480px', objectFit: 'cover', display: 'block' }}
                  />

                  {/* Floating element 1 (Top Left) */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }} 
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ position: 'absolute', top: '5%', left: '-10%', backgroundColor: 'var(--color-surface)', padding: '12px 20px', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Compass size={18} color="var(--color-electric-green)" />
                    <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>{lang === 'fr' ? 'UX stratégique' : 'Strategic UX'}</h3>
                  </motion.div>

                  {/* Floating element 2 (Bottom right) */}
                  <motion.div 
                    animate={{ y: [0, 15, 0] }} 
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    style={{ position: 'absolute', bottom: '15%', right: '-5%', backgroundColor: 'var(--color-surface)', padding: '12px 20px', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Smartphone size={18} color="var(--color-electric-green)" />
                    <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>Mobile-first</h3>
                  </motion.div>

                  {/* Floating element 3 (Top right) */}
                  <motion.div 
                    animate={{ y: [0, -12, 0] }} 
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    style={{ position: 'absolute', top: '25%', right: '-5%', backgroundColor: 'var(--color-surface)', padding: '12px 20px', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Target size={18} color="var(--color-electric-green)" />
                    <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>Product strategy</h3>
                  </motion.div>

                  {/* Floating element 4 (Bottom left) */}
                  <motion.div 
                    animate={{ y: [0, 10, 0] }} 
                    transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    style={{ position: 'absolute', bottom: '10%', left: '-10%', backgroundColor: 'var(--color-surface)', padding: '12px 20px', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Bot size={18} color="var(--color-electric-green)" />
                    <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>{lang === 'fr' ? 'Automatisation' : 'Automation'}</h3>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section style={styles.marqueeSection}>
          <div style={styles.marqueeContainer}>
            <div style={styles.marqueeTrack}>
              {[...clients, ...clients].map((client, i) => (<div key={i} style={styles.clientChip}>{client}</div>))}
            </div>
          </div>
        </section>

        <section id="ux-case-studies" data-scrollspy={t('work_section1_label')} className="section-padding">
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ marginBottom: '48px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px' }}>
              <div>
                <span style={styles.sectionLabel}>{t('work_grid_label')}</span>
                <h2 style={styles.sectionTitle}>{t('work_grid_title')}</h2>
                <p style={styles.sectionDesc}>{t('work_grid_desc')}</p>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {['Tous', 'UX/UI', 'MVP Ai', 'Motion Graphics'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="hover-trigger"
                    style={{
                      padding: '8px 20px',
                      borderRadius: '999px',
                      border: activeTab === tab ? '1px solid var(--color-electric-green)' : '1px solid var(--color-border)',
                      backgroundColor: activeTab === tab ? 'rgba(57,255,20,0.1)' : 'var(--color-surface)',
                      color: activeTab === tab ? 'var(--color-electric-green)' : 'var(--color-text-secondary)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </motion.div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px', alignItems: 'stretch' }}>
              {filteredProjects.map((project, index) => (
                <motion.div key={project.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }} style={{ height: '100%' }}>
                  <ProjectCard project={project} onClick={handleProjectClick} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="certifications" data-scrollspy="Certifications" className="section-padding">
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ marginBottom: '48px' }}>
              <span style={styles.sectionLabel}>{t('work_cert_label')}</span>
              <h2 style={styles.sectionTitle}>{t('work_cert_title')}</h2>
              <p style={styles.sectionDesc}>{t('work_cert_desc')}</p>
            </motion.div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px', alignItems: 'stretch' }}>
              {certifications.map((cert, i) => (
                <TiltWrapper key={i} style={{ height: '100%', display: 'block' }}>
                  <CertCard cert={cert} index={i} />
                </TiltWrapper>
              ))}
            </div>
            
            <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center' }}>
              <a href="/about" className="btn-primary hover-trigger">
                Voir toutes les certificats
              </a>
            </div>
          </div>
        </section>
      </div>

      <ProtectedProjectModal isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} onProceed={handleProceed} project={selectedProject || {}} />
    </AnimatedPage>
  );
};

const styles = {
  heroGrid: { display: 'flex', flexWrap: 'wrap', gap: '64px', alignItems: 'center' },
  heroLeft: { flex: '1 1 480px', minWidth: '300px' },
  heroTitle: { fontSize: 'clamp(2.4rem, 5vw, 5rem)', letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '20px', marginTop: '14px' },
  heroDesc: { fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, marginBottom: '40px', maxWidth: '520px' },
  sectionLabel: { display: 'inline-block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-electric-green)', marginBottom: '12px', padding: '4px 14px', backgroundColor: 'rgba(57,255,20,0.08)', borderRadius: '999px', border: '1px solid rgba(57,255,20,0.2)' },
  sectionTitle: { fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', letterSpacing: '-0.03em', marginBottom: '12px', marginTop: '8px' },
  sectionDesc: { fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 },
  statsRow: { display: 'flex', flexWrap: 'wrap', gap: '14px' },
  statChip: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '18px 22px', borderRadius: '20px', minWidth: '110px', textAlign: 'center', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', transition: 'box-shadow 0.3s ease' },
  statIcon: { color: 'var(--color-electric-green)', marginBottom: '2px' },
  statNumber: { fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-electric-green)', letterSpacing: '-0.03em', lineHeight: 1 },
  statLabel: { fontSize: '0.72rem', color: 'var(--color-text-secondary)', fontWeight: 600, lineHeight: 1.35, maxWidth: '90px' },
  heroRight: { flex: '0 0 420px', display: 'flex', justifyContent: 'center' },
  tiltWrapper: { position: 'relative', width: '100%', maxWidth: '420px', borderRadius: '32px', overflow: 'visible', cursor: 'none' },
  heroImage: { width: '100%', height: 'auto', borderRadius: '32px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-lg)', display: 'block', objectFit: 'cover' },
  availBadge: { position: 'absolute', bottom: '-18px', left: '50%', transform: 'translateX(-50%)', display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '999px', padding: '8px 20px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', backdropFilter: 'blur(12px)', zIndex: 2 },
  availDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-electric-green)', boxShadow: '0 0 8px var(--color-electric-green)', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' },
  marqueeSection: { padding: '56px 0', overflow: 'hidden' },
  marqueeContainer: { overflow: 'hidden', maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' },
  marqueeTrack: { display: 'flex', gap: '0', width: 'max-content', animation: 'marquee 28s linear infinite' },
  clientChip: { color: 'var(--color-text-secondary)', fontSize: '1.25rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.28, whiteSpace: 'nowrap', padding: '0 44px', transition: 'opacity 0.3s' },
  gridSection: { padding: '80px 0' },
  certSection: { padding: '96px 0', backgroundColor: 'var(--color-bg)' },
  certGrid: { display: 'flex', flexWrap: 'wrap', gap: '20px' },
  certCard: { flex: '1 1 280px', display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px', borderRadius: '18px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', position: 'relative', transition: 'box-shadow 0.3s ease, border-color 0.3s ease' },
  certIconWrap: { flexShrink: 0, width: '44px', height: '44px', borderRadius: '14px', backgroundColor: 'rgba(57,255,20,0.08)', border: '1px solid rgba(57,255,20,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-electric-green)' },
  certBody: { flex: 1, minWidth: 0 },
  certTitle: { fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 4px 0', lineHeight: 1.35 },
  certIssuer: { fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: 0, fontWeight: 500 }
};

export default Work;
