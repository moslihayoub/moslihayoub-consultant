import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Calendar, Download, Mail, MapPin, Phone, ExternalLink, Award, Play, ChevronRight, MessageCircle, Briefcase, UserCheck, CheckCircle2, Brain, ChevronDown, ChevronUp, Globe, Layout, Search } from 'lucide-react';
import TiltWrapper from '../components/TiltWrapper';
import AnimatedPage from '../components/AnimatedPage';
import { useLanguage } from '../contexts/LanguageContext';
import { certificationsData } from '../data/certifications';

const LinkedinIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const YoutubeIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.582 6.186a2.665 2.665 0 00-1.87-1.882c-1.652-.446-8.283-.446-8.283-.446s-6.63 0-8.282.446a2.66 2.66 0 00-1.87 1.882C.83 7.844.83 12 .83 12s0 4.156.447 5.814a2.66 2.66 0 001.87 1.882c1.652.446 8.282.446 8.282.446s6.63 0 8.283-.446a2.665 2.665 0 001.87-1.882c.447-1.658.447-5.814.447-5.814s0-4.156-.447-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const BehanceIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.546-1.436-2.352-2.461-2.352-1.036 0-2.367.798-2.504 2.352zm-8.904 6h-7.136v-18h7.561c2.706 0 4.931 1.139 4.931 4.79 0 2.286-1.224 3.479-2.969 4.301 2.809.769 3.626 2.986 3.626 5.394 0 3.171-1.734 3.515-5.013 3.515zm-4.136-8.5v5.5h4.136c2.719 0 2.825-2.148 2.825-2.75 0-.583-.118-2.75-2.908-2.75h-4.053zm0-6.5v4h3.604c2.322 0 2.502-1.699 2.502-2 0-.262-.114-2-2.502-2h-3.604z" />
  </svg>
);

const DribbbleIcon = ({ size = 20 }) => (
  <svg fill="currentColor" height={size} width={size} viewBox="-271 273 255.9 256" xmlns="http://www.w3.org/2000/svg">
    <path d="M-18.7,374.8c-1.7-8.2-4.2-16.2-7.5-24c-3.2-7.6-7.2-14.8-11.8-21.6c-4.6-6.8-9.8-13-15.5-18.8 c-5.8-5.8-12.2-11.1-18.8-15.5c-6.8-4.6-14.2-8.6-21.6-11.8c-7.7-3.3-15.7-5.8-24-7.5c-8.4-1.7-17-2.6-25.7-2.6s-17.3,0.9-25.7,2.6 c-8.2,1.7-16.2,4.2-23.9,7.5c-7.6,3.2-14.8,7.2-21.6,11.8c-6.8,4.6-13.1,9.8-18.8,15.5s-11,12.2-15.5,18.8 c-4.6,6.8-8.6,14-11.8,21.6c-3.3,7.7-5.8,15.7-7.5,24c-1.7,8.4-2.6,17-2.6,25.7s0.9,17.3,2.6,25.7c1.7,8.2,4.2,16.2,7.5,23.9 c3.2,7.6,7.2,14.8,11.8,21.7c4.6,6.8,9.8,13,15.5,18.8c5.8,5.8,12.2,11,18.8,15.5c6.8,4.6,14.2,8.6,21.6,11.8 c7.7,3.3,15.7,5.8,23.9,7.5c8.4,1.7,17,2.6,25.7,2.6s17.2-0.9,25.7-2.6c8.2-1.7,16.2-4.2,24-7.5c7.6-3.2,14.8-7.2,21.6-11.8 c6.8-4.6,13.1-9.8,18.8-15.5c5.8-5.8,11-12.2,15.5-18.8c4.6-6.8,8.6-14.1,11.8-21.7c3.3-7.7,5.8-15.7,7.5-23.9 c1.7-8.4,2.6-17,2.6-25.7S-17,383.2-18.7,374.8z M-143.6,291.6c27.6,0,52.7,10.3,71.9,27.2c-0.3,0.4-15.7,24-56.9,39.4 c-18.6-34.2-39.1-61.4-40.8-63.6C-161.1,292.7-152.5,291.6-143.6,291.6z M-169.9,294.8C-169.9,294.7-169.8,294.7-169.9,294.8 L-169.9,294.8z M-190.1,302c1.5,1.9,21.6,29.3,40.5,62.8c-52.3,13.8-97.7,13.3-100.5,13.2C-243.2,344.3-220.5,316.3-190.1,302z M-224.7,473.2c-17.3-19.2-27.9-44.7-27.9-72.7c0-1.2,0.1-2.3,0.1-3.4c1.9,0,55.7,1.3,111.8-15.5c3.1,6.1,6.1,12.4,8.9,18.5 c-1.4,0.4-2.9,0.8-4.3,1.3C-194.9,420.4-224.7,473.2-224.7,473.2z M-143.6,509.4c-25.4,0-48.5-8.7-67-23.1 c0.4-0.8,21.5-45.7,85.5-68c0.2-0.1,0.5-0.2,0.7-0.2c15.3,39.8,21.6,73.1,23.2,82.7C-114.2,506.3-128.6,509.4-143.6,509.4z M-82.8,490.8c-1.1-6.6-6.9-38.5-21.2-77.8c35.2-5.6,65.7,4,67.9,4.8C-40.9,448.1-58.4,474.3-82.8,490.8z M-110.6,395.8 c-0.8-1.9-1.6-3.7-2.4-5.6c-2.3-5.4-4.7-10.6-7.3-15.8c43-17.5,60.5-42.8,60.7-43.1c15.2,18.6,24.5,42.3,24.8,68.1 C-36.3,399.1-73.2,391.1-110.6,395.8z"/>
  </svg>
);

const TwitterIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const clients = ['Autocash', 'CGI', 'OCP', 'CDM Bank', 'Carrefour', 'Foodeals', 'JSEI', 'HBM', 'Wiggli', 'Stibits'];

const expertiseData = [
  {
    title: { fr: 'Consulting en transformation digitale', en: 'Digital Transformation Consulting' },
    desc: { fr: 'Audit, accompagnement au changement et redéfinition des modèles économiques via la technologie.', en: 'Auditing, change management, and redefining business models through technology.' },
  },
  {
    title: { fr: 'Stratégie IA & automatisation', en: 'AI Strategy & Automation' },
    desc: { fr: 'Intégration de l\'IA générative dans les processus métiers pour maximiser l\'efficacité opérationnelle.', en: 'Integrating Generative AI into business processes to maximize operational efficiency.' },
  },
  {
    title: { fr: 'Product & UX Strategy', en: 'Product & UX Strategy' },
    desc: { fr: 'Pilotage de la conception centrée utilisateur pour garantir un ROI mesurable et une adoption fluide.', en: 'Driving human-centered design to ensure measurable ROI and seamless user adoption.' },
  },
  {
    title: { fr: 'Design Systems & Scalabilité', en: 'Design Systems & Scalability' },
    desc: { fr: 'Industrialisation de la production digitale pour des équipes agiles et cohérentes.', en: 'Industrializing digital production for agile and cohesive teams.' },
  }
];

const timelineData = [
  {
    year: '2024 – Présent',
    title: { fr: 'Consultant en transformation digitale & IA', en: 'Digital Transformation & AI Consultant' },
    type: 'Consultant',
    experiences: [
      { company: 'AutoCash', city: 'Casablanca', desc: { fr: 'Audit stratégique, refonte des processus métiers via l\'IA et création d\'un design system scalable.', en: 'Strategic audit, business process redesign via AI, and creation of a scalable design system.' } }
    ]
  },
  {
    year: '2019 – 2023',
    title: { fr: 'Consultant UX/UI stratégique', en: 'Strategic UX/UI Consultant' },
    type: 'Consultant',
    experiences: [
      { company: 'JSEI Capital Market & HBM Com', year: '2023', city: 'Maroc / France', desc: { fr: 'Transformation digitale agile, Audit heuristique et pilotage MVP.', en: 'Agile digital transformation, Heuristic audit, and MVP piloting.' } },
      { company: 'CGI', year: '2021 – 2023', city: 'Casablanca', desc: { fr: 'Conception de solutions d\'urbanisme numérique pour la Ville de Laval.', en: 'Designing digital urbanism solutions for the City of Laval.' } },
      { company: 'Wiggli', year: '2021 – 2023', city: 'Laval', desc: { fr: 'UX Research et optimisation des flux B2B pour ATS Wiggli.io.', en: 'UX Research and B2B workflow optimization for ATS Wiggli.io.' } },
      { company: 'OCP SA', year: '2019 – 2020', city: 'Casablanca', desc: { fr: 'Recherche Utilisateur sur la plateforme BIG DATA, optimisation des processus industriels.', en: 'User Research on the BIG DATA platform, optimizing industrial processes.' } },
      { company: 'Crédit du Maroc', year: '2019 – 2020', city: 'Casablanca', desc: { fr: 'Transformation des processus agences via un nouvel Intranet unifié.', en: 'Agency process transformation via a new unified Intranet.' } }
    ]
  },
  {
    year: '2017 – 2019',
    title: { fr: 'Directeur artistique & digital', en: 'Art & Digital Director' },
    type: 'CDI',
    experiences: [
      { company: 'TNC - The Next Clic', city: 'Casablanca', desc: { fr: 'Pilotage de l\'image de marque digitale et des campagnes multi-canaux pour grands comptes.', en: 'Piloting digital brand image and multi-channel campaigns for key accounts.' } }
    ]
  },
  {
    year: '2008 – 2017',
    title: { fr: 'Graphic Designer & Formateur', en: 'Graphic Designer & Trainer' },
    type: 'CDI',
    experiences: [
      { company: 'Futur Digital', city: 'Paris', desc: { fr: 'Leader de la squad digitale, accompagnement de la transition web des TPE/PME.', en: 'Digital squad leader, assisting SMBs in their web transition.' } },
      { company: 'Ictap', city: 'Casablanca', desc: { fr: 'Formateur en Design numérique.', en: 'Digital Design Trainer.' } }
    ]
  }
];

const contactLinks = [
  { icon: Mail, label: 'Email', value: 'moslihayoub@gmail.com', href: 'mailto:moslihayoub@gmail.com', color: '#EA4335' },
  { icon: Phone, label: 'Téléphone', value: '+212 6 63 58 50 65', href: 'tel:+212663585065', color: '#34A853' },
  { icon: MessageCircle, label: 'WhatsApp', value: 'Discutons', href: 'https://wa.me/212663585065', color: '#25D366' },
  { icon: LinkedinIcon, label: 'LinkedIn', value: 'Ayoub MOSLIH', href: 'https://www.linkedin.com/in/moslih84/', color: '#0A66C2' },
  { icon: TwitterIcon, label: 'X (Twitter)', value: '@moslih84', href: 'https://x.com/moslih84', color: '#000000' },
  { icon: YoutubeIcon, label: 'YouTube', value: 'Tutoriels UX/UI', href: 'https://www.youtube.com/@moslih84', color: '#FF0000' },
  { icon: BehanceIcon, label: 'Behance', value: 'Ayoub MOSLIH', href: 'https://www.behance.net/moslih84', color: '#1769ff' },
  { icon: DribbbleIcon, label: 'Dribbble', value: 'moslih84', href: 'https://dribbble.com/moslih84', color: '#ea4c89' }
];

export default function About() {
  const { lang, t } = useLanguage();
  const [expandedTimeline, setExpandedTimeline] = useState(null);
  const [calType, setCalType] = useState('30min');
  const [activeCertTab, setActiveCertTab] = useState('Tous');
  const [filterValue, setFilterValue] = useState('Tous');
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.65;
    }
  }, []);

  const filteredCerts = certificationsData.filter(cert => {
    const matchCat = activeCertTab === 'Tous' || cert.category === activeCertTab;
    const matchFilter = filterValue === 'Tous' || cert.year === filterValue || cert.issuer === filterValue;
    return matchCat && matchFilter;
  });
  
  const certCategories = ['Tous', ...new Set(certificationsData.map(c => c.category))];

  const toggleTimeline = (index) => {
    if (expandedTimeline === index) {
      setExpandedTimeline(null);
    } else {
      setExpandedTimeline(index);
    }
  };

  return (
    <AnimatedPage>
      <div className="page-wrapper" style={{ fontFamily: 'var(--font-family)' }}>
        <div className="container">
          
          {/* HERO SECTION */}
          <section id="about-hero" data-scrollspy={t('nav_about')} className="page-hero-grid" style={{ marginBottom: '80px' }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="section-label">{t('nav_about')}</span>
              <h1 style={{ marginBottom: '8px' }}>Ayoub MOSLIH.</h1>
              <h3 style={{ color: 'var(--color-electric-green)', marginBottom: '24px', fontWeight: 600 }}>{t('hero_role')}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '32px' }}>
                {[t('work_hero_tag1'), t('work_hero_tag2'), t('work_hero_tag3')].map((s, i) => (
                  <div key={i} style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', backgroundColor: '#333333', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '6px 16px', letterSpacing: '0.01em' }}>
                    {s}
                  </div>
                ))}
              </div>

              <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', marginBottom: '32px', maxWidth: '500px', lineHeight: 1.7 }}>
                {t('about_hero_desc')}
              </p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <TiltWrapper>
                  <a href="/assets/Ayoub MOSLIH UX-UI.pdf" download className="btn-primary hover-trigger">
                    <Download size={18} /> {t('home_section3_download')}
                  </a>
                </TiltWrapper>
                <TiltWrapper>
                  <a href="#booking" className="btn-secondary hover-trigger">
                    {lang === 'fr' ? 'Réserver un appel' : 'Book a Call'}
                  </a>
                </TiltWrapper>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} style={{ position: 'relative' }}>
              <div style={{ position: 'relative', width: '100%', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <video 
                  ref={videoRef}
                  src="/assets/vid-HS/about.mp4" 
                  preload="none"
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="video-mask"
                  style={{ width: '100%', height: '480px', objectFit: 'cover', display: 'block' }} 
                />

                {/* Floating element 1 (Top right) */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }} 
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ position: 'absolute', top: '10%', right: '-5%', backgroundColor: 'var(--color-surface)', padding: '12px 20px', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Brain size={18} color="var(--color-electric-green)" />
                  <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>{lang === 'fr' ? 'Stratégie IA' : 'AI Strategy'}</h3>
                </motion.div>

                {/* Floating element 2 (Bottom left) */}
                <motion.div 
                  animate={{ y: [0, 15, 0] }} 
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  style={{ position: 'absolute', bottom: '15%', left: '-10%', backgroundColor: 'var(--color-surface)', padding: '12px 20px', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Briefcase size={18} color="var(--color-electric-green)" />
                  <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>{lang === 'fr' ? 'Consulting' : 'Consulting'}</h3>
                </motion.div>

                {/* Floating element 3 (Top left) */}
                <motion.div 
                  animate={{ y: [0, -12, 0] }} 
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                  style={{ position: 'absolute', top: '25%', left: '-5%', backgroundColor: 'var(--color-surface)', padding: '12px 20px', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Layout size={18} color="var(--color-electric-green)" />
                  <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>Design System</h3>
                </motion.div>

                {/* Floating element 4 (Bottom right) */}
                <motion.div 
                  animate={{ y: [0, 12, 0] }} 
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  style={{ position: 'absolute', bottom: '25%', right: '-5%', backgroundColor: 'var(--color-surface)', padding: '12px 20px', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Search size={18} color="var(--color-electric-green)" />
                  <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>UX Research</h3>
                </motion.div>
              </div>
            </motion.div>
          </section>

          {/* CLIENT MARQUEE */}
          <section style={{ marginBottom: '100px', overflow: 'hidden', maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
            <div style={{ display: 'flex', gap: '64px', width: 'max-content', animation: 'marquee 30s linear infinite' }}>
              {[...clients, ...clients].map((client, i) => (
                <div key={i} style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-secondary)', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {client}
                </div>
              ))}
            </div>
          </section>

          {/* EXPERTISE GRID */}
          <section id="services" data-scrollspy={t('about_section1_label')} className="section-padding">
            <span className="section-label">{t('about_expert_label')}</span>
            <h2 style={{ marginBottom: '12px', marginTop: '8px' }}>{t('about_expert_title')}</h2>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>{t('about_expert_desc')}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', marginTop: '40px' }}>
              {expertiseData.map((exp, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="perspective-container">
                  <TiltWrapper style={{ height: '100%', display: 'block' }}>
                    <div className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-lg)', height: '100%', border: '1px solid var(--color-border)', transition: 'box-shadow 0.3s ease' }}>
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--color-electric-green)' }}>{exp.title[lang]}</h3>
                      <p style={{ margin: 0, fontSize: '0.95rem' }}>{exp.desc[lang]}</p>
                    </div>
                  </TiltWrapper>
                </motion.div>
              ))}
            </div>
          </section>

          {/* EXPERIENCE TIMELINE */}
          <section id="parcours" data-scrollspy={t('about_section2_label')} className="section-padding" style={{ backgroundColor: 'var(--color-surface)' }}>
            <span className="section-label">{t('about_timeline_label')}</span>
            <h2 style={{ marginBottom: '12px', marginTop: '8px' }}>{t('about_timeline_title')}</h2>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>{t('about_timeline_desc')}</p>
            <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {timelineData.map((item, i) => {
                const isExpanded = expandedTimeline === i;
                const typeStyle = item.type === 'CDI' ? { bg: 'rgba(57,255,20,0.1)', color: 'var(--color-electric-green)' } : { bg: 'rgba(0,120,255,0.1)', color: '#0066ff' };
                
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <div 
                      onClick={() => toggleTimeline(i)}
                      className="glass-panel hover-trigger hover-lift"
                      style={{ padding: '24px', borderRadius: 'var(--radius-lg)', cursor: 'pointer', border: isExpanded ? '1px solid var(--color-electric-green)' : '1px solid var(--color-border)', transition: 'all 0.3s ease', display: 'block', width: '100%' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ margin: 0, fontSize: '1.15rem', marginBottom: '8px' }}>{item.title[lang]}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-electric-green)', backgroundColor: 'rgba(57,255,20,0.1)', padding: '4px 10px', borderRadius: '999px' }}>{item.year}</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', backgroundColor: typeStyle.bg, color: typeStyle.color, padding: '2px 8px', borderRadius: '999px', fontWeight: 600 }}>{item.type}</span>
                          </div>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: isExpanded ? 'var(--color-electric-green)' : 'var(--color-surface)', color: isExpanded ? '#fff' : 'var(--color-text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease', border: '1px solid var(--color-border)', flexShrink: 0 }}>
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div style={{ marginTop: '20px' }}>
                              {item.experiences.map((exp, expIdx) => (
                                <div key={expIdx}>
                                  {expIdx > 0 && <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '16px 0' }} />}
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px 16px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: 'var(--radius-sm)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                                      <h4 style={{ margin: 0, color: 'var(--color-electric-green)', fontSize: '1rem', fontWeight: 700 }}>{exp.company}</h4>
                                      <div style={{ display: 'flex', gap: '12px' }}>
                                        {exp.year && <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{exp.year}</span>}
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}><MapPin size={14} /> {exp.city}</span>
                                      </div>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
                                      {exp.desc[lang]}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* CERTIFICATIONS (Tabs) */}
          <section id="certifications" data-scrollspy={t('about_cert_label')} style={{ marginBottom: '100px' }}>
            <div style={{ marginBottom: '32px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px' }}>
              <div>
                <span className="section-label">{t('about_cert_label')}</span>
                <h2 style={{ marginBottom: '12px', marginTop: '8px' }}>{t('about_cert_title')}</h2>
                <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>{t('about_cert_desc')}</p>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {certCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCertTab(cat)}
                    style={{
                      padding: '8px 20px',
                      borderRadius: '999px',
                      border: activeCertTab === cat ? '1px solid var(--color-electric-green)' : '1px solid var(--color-border)',
                      backgroundColor: activeCertTab === cat ? 'rgba(57,255,20,0.1)' : 'var(--color-surface)',
                      color: activeCertTab === cat ? 'var(--color-electric-green)' : 'var(--color-text-secondary)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    className="hover-trigger"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px', alignItems: 'stretch' }}>
              {filteredCerts.map((cert, i) => (
                <TiltWrapper key={`${activeCertTab}-${i}`} style={{ display: 'block', height: '100%' }}>
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-card hover-trigger"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1px solid var(--color-border)',
                      textDecoration: 'none'
                    }}
                  >
                  <div style={{ width: '100%', paddingTop: '65%', position: 'relative', backgroundColor: 'var(--color-bg)', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(57,255,20,0.03)', color: 'var(--color-electric-green)', padding: '20px', textAlign: 'center' }}>
                      <Award size={36} style={{ marginBottom: '12px', opacity: 0.8 }} />
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cert.issuer}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.6, marginTop: '8px' }}>Certificat</span>
                    </div>
                  </div>
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--color-text-primary)' }}>{cert.title}</h3>
                    <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--color-electric-green)', fontWeight: 700, marginBottom: '12px' }}>{cert.issuer}</p>
                    <p style={{ fontSize: '0.9rem', marginBottom: 0, flex: 1, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} /> Année: {cert.year}
                    </p>
                  </div>
                  </a>
                </TiltWrapper>
              ))}
            </div>
          </section>

          {/* CONTACT & CAL EMBED */}
          <section id="booking" data-scrollspy={t('about_contact_label')} style={{ marginBottom: '60px' }}>
            <span className="section-label">{t('about_contact_label')}</span>
            <h2>{t('about_contact_title')}</h2>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>{t('about_contact_desc')}</p>
            <div className="page-hero-grid" style={{ marginTop: '40px', gap: '40px', alignItems: 'flex-start' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {contactLinks.map((link, i) => (
                  <TiltWrapper key={i} style={{ display: 'block' }}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="glass-panel hover-trigger" style={{ display: 'flex', alignItems: 'center', padding: '20px', borderRadius: 'var(--radius-md)', textDecoration: 'none', gap: '16px', border: '1px solid var(--color-border)' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: `${link.color}15`, color: link.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <link.icon size={24} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{link.label}</h4>
                        <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{link.value}</p>
                      </div>
                      <ExternalLink size={18} style={{ marginLeft: 'auto', color: 'var(--color-text-secondary)' }} />
                    </a>
                  </TiltWrapper>
                ))}
              </div>

              <div className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
                <h3 style={{ marginBottom: '24px' }}>{lang === 'fr' ? 'Réserver une consultation' : 'Book a consultation'}</h3>
                
                <div style={{ width: '100%', height: '500px', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                  <iframe 
                    src={`https://cal.com/moslihayoub/${calType}?embed=true`} 
                    style={{ width: '100%', height: '100%', border: 'none' }}
                  />
                </div>
              </div>

            </div>
          </section>

        </div>
      </div>
    </AnimatedPage>
  );
}
