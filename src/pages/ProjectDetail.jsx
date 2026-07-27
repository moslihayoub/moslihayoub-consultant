import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';
import { useLanguage } from '../contexts/LanguageContext';
import { projectsData } from '../data/projects';

const ProjectDetail = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [lightbox, setLightbox] = useState({ isOpen: false, type: null, src: null });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openLightbox = (type, src) => {
    if (window.innerWidth > 768) {
      setLightbox({ isOpen: true, type, src });
    }
  };

  const project = projectsData.find(p => p.id === 'the-factory');
  
  if (!project) return null;

  return (
    <AnimatedPage>
      <style>
        {`
          .project-detail-wrapper {
            padding-top: 100px;
            padding-bottom: 100px;
          }
          .breadcrumb-container {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--color-text-secondary);
            font-size: 0.9rem;
            margin-bottom: 32px;
          }
          .video-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
          .two-column-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
          @media (min-width: 769px) {
            .lightbox-media {
              cursor: zoom-in;
              transition: transform 0.3s ease;
            }
            .lightbox-media:hover {
              transform: scale(1.02);
              z-index: 10;
              position: relative;
            }
          }
          @media (max-width: 768px) {
            .project-detail-wrapper {
              padding-top: 40px;
            }
            .breadcrumb-container {
              justify-content: center;
            }
            .video-grid {
              grid-template-columns: 1fr;
            }
            .two-column-grid {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>
      <div className="page-wrapper project-detail-wrapper">
        <div className="container">
          
          {/* Breadcrumb */}
          <div className="breadcrumb-container">
            <span onClick={() => navigate('/work')} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-trigger">Work</span>
            <ChevronRight size={16} />
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{project.title}</span>
          </div>

          {/* Header */}
          <motion.section id="intro" data-scrollspy="Intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.03em', marginBottom: '16px' }}>
              {project.title}
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto 24px' }}>
              {lang === 'fr' ? "En coulisses : La création d'une série animée avec l'Intelligence Artificielle. Un projet personnel expérimental." : "Behind the scenes: Creating an animated series with Artificial Intelligence. An experimental personal project."}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {['Série 2D', 'BETA / Work In Progress', 'Business Comédie'].map((tag, i) => (
                <div key={i} style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.85rem', fontWeight: 600, color: '#fff', backgroundColor: '#000', borderRadius: '999px', padding: '6px 16px' }}>
                  {tag}
                </div>
              ))}
            </div>
          </motion.section>

          {/* Main Cover (No Border, No Bg) */}
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} style={{ marginBottom: '80px', overflow: 'hidden' }}>
            <img src="/assets/works/filmmaker/the-factory.webp" alt="The Factory" style={{ width: '100%', height: 'auto', display: 'block', mixBlendMode: 'multiply' }} />
          </motion.div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
            
            {/* Étape 1 : Pré-production */}
            <motion.section id="pre-production" data-scrollspy="Pré-production" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }}>
              <div style={styles.stepHeader}>
                <div style={styles.stepBadge}>PRÉ-PRODUCTION</div>
                <h2 style={styles.stepTitle}>{lang === 'fr' ? "Scénarisation & Concept" : "Scripting & Concept"}</h2>
                <p style={styles.stepDesc}>
                  {lang === 'fr' 
                    ? "Tout commence par l'écriture. J'ai utilisé Gemini, ChatGPT et Claude pour développer le script, définir les arcs narratifs et le découpage de la série. Le tout est centralisé dans NotebookLM, véritable bible du projet The Factory." 
                    : "It all starts with writing. I used Gemini, ChatGPT, and Claude to develop the script, define the narrative arcs, and the breakdown of the series. Everything is centralized in NotebookLM, the true bible of The Factory project."}
                </p>
              </div>
              
              <div className="two-column-grid">
                <img src="/assets/works/filmmaker/idea-storyboard.webp" alt="Idea Storyboard" className="lightbox-media" onClick={() => openLightbox('image', '/assets/works/filmmaker/idea-storyboard.webp')} style={styles.fullImage} />
                <img src="/assets/works/filmmaker/character-draw.webp" alt="Character Draw" className="lightbox-media" onClick={() => openLightbox('image', '/assets/works/filmmaker/character-draw.webp')} style={styles.fullImage} />
              </div>
            </motion.section>

            {/* Étape 2 : Production */}
            <motion.section id="production" data-scrollspy="Production" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }}>
              <div style={styles.stepHeader}>
                <div style={styles.stepBadge}>PRODUCTION</div>
                <h2 style={styles.stepTitle}>{lang === 'fr' ? "Direction Artistique & Storyboard" : "Art Direction & Storyboard"}</h2>
                <p style={styles.stepDesc}>
                  {lang === 'fr' 
                    ? "L'import du script dans Google Flow et l'utilisation de l'agent filmmaker a permis de générer le Storyboard Studio. C'est ici que l'univers visuel prend vie : design des personnages, création des décors de l'agence et des accessoires." 
                    : "Importing the script into Google Flow and using the filmmaker agent helped generate the Storyboard Studio. This is where the visual universe comes to life: character design, agency sets, and props creation."}
                </p>
              </div>
              
              {/* Mood Board Character Sheet (2 par ligne) */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Character Sheet (Mood Board)</h3>
                <div className="two-column-grid" style={{ gap: '16px' }}>
                  <img loading="lazy" src="/assets/works/filmmaker/character-sheet/ayoub.webp" alt="Character 1" className="lightbox-media" onClick={() => openLightbox('image', '/assets/works/filmmaker/character-sheet/ayoub.webp')} style={styles.fullImage} />
                  <img loading="lazy" src="/assets/works/filmmaker/character-sheet/chicco.webp" alt="Character 2" className="lightbox-media" onClick={() => openLightbox('image', '/assets/works/filmmaker/character-sheet/chicco.webp')} style={styles.fullImage} />
                  <img loading="lazy" src="/assets/works/filmmaker/character-sheet/si-abdeljabbar.webp" alt="Character 3" className="lightbox-media" onClick={() => openLightbox('image', '/assets/works/filmmaker/character-sheet/si-abdeljabbar.webp')} style={{...styles.fullImage, gridColumn: '1 / -1'}} />
                </div>
              </div>

              {/* Décors et Storyboards (Images 4 à 10 - 2 par ligne sur Web) */}
              <div className="two-column-grid" style={{ marginTop: '16px' }}>
                <img loading="lazy" src="/assets/works/filmmaker/decor-sheet/decor-outside.webp" alt="Decor" className="lightbox-media" onClick={() => openLightbox('image', '/assets/works/filmmaker/decor-sheet/decor-outside.webp')} style={styles.fullImage} />
                <img loading="lazy" src="/assets/works/filmmaker/decor-sheet/meeting-room.webp" alt="Meeting Room" className="lightbox-media" onClick={() => openLightbox('image', '/assets/works/filmmaker/decor-sheet/meeting-room.webp')} style={styles.fullImage} />
                <img loading="lazy" src="/assets/works/filmmaker/prop-sheet/bike.webp" alt="Prop Bike" className="lightbox-media" onClick={() => openLightbox('image', '/assets/works/filmmaker/prop-sheet/bike.webp')} style={styles.fullImage} />
                <img loading="lazy" src="/assets/works/filmmaker/storyboard/storyboard-action.webp" alt="Storyboard Action" className="lightbox-media" onClick={() => openLightbox('image', '/assets/works/filmmaker/storyboard/storyboard-action.webp')} style={styles.fullImage} />
                <img loading="lazy" src="/assets/works/filmmaker/storyboard/storyboard-credit-2.webp" alt="Storyboard Credit 2" className="lightbox-media" onClick={() => openLightbox('image', '/assets/works/filmmaker/storyboard/storyboard-credit-2.webp')} style={styles.fullImage} />
                <img loading="lazy" src="/assets/works/filmmaker/storyboard/storyboard-credit.webp" alt="Storyboard Credit" className="lightbox-media" onClick={() => openLightbox('image', '/assets/works/filmmaker/storyboard/storyboard-credit.webp')} style={styles.fullImage} />
                <img loading="lazy" src="/assets/works/filmmaker/lab.webp" alt="Lab" className="lightbox-media" onClick={() => openLightbox('image', '/assets/works/filmmaker/lab.webp')} style={styles.fullImage} />
              </div>
            </motion.section>

            {/* Étape 3 : Post-production */}
            <motion.section id="post-production" data-scrollspy="Post-production" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }}>
              <div style={styles.stepHeader}>
                <div style={styles.stepBadge}>POST-PRODUCTION</div>
                <h2 style={styles.stepTitle}>{lang === 'fr' ? "Animation & Montage Final" : "Animation & Final Edit"}</h2>
                <p style={styles.stepDesc}>
                  {lang === 'fr' 
                    ? "Exportation des assets générés et montage dynamique des scènes avec l'IA vidéo. J'assemble les séquences pour donner le rythme comique propre à The Factory, tel un vrai making-of." 
                    : "Exporting generated assets and dynamic editing of scenes with Video AI. I assemble the sequences to give the comedic rhythm specific to The Factory, like a true making-of."}
                </p>
              </div>
              
              {/* Vidéos - Responsive via classe video-grid */}
              <div className="video-grid">
                {[
                  "frame-01.mp4", "frame-02.mp4", "frame-03.mp4", "frame-04.mp4", "frame-05.mp4"
                ].map((videoName, idx) => (
                  <div 
                    key={idx} 
                    style={{ width: '100%', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#000', position: 'relative' }}
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <video 
                      src={`/assets/works/filmmaker/h264/${videoName}`}
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      controlsList="nodownload noremoteplayback"
                      disablePictureInPicture
                      onContextMenu={(e) => e.preventDefault()}
                      preload="none"
                      style={{ 
                        width: '100%', 
                        height: 'auto', 
                        display: 'block', 
                        WebkitTouchCallout: 'none', 
                        WebkitUserSelect: 'none', 
                        userSelect: 'none' 
                      }} 
                    />
                    {/* Transparent protection overlay to block mobile long-press & desktop contextmenu */}
                    <div 
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2 }} 
                      onContextMenu={(e) => e.preventDefault()} 
                    />
                  </div>
                ))}
              </div>
            </motion.section>
            
          </div>
        </div>
      </div>
      
      {/* Lightbox Overlay */}
      <AnimatePresence>
        {lightbox.isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              zIndex: 9999999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'zoom-out'
            }}
            onClick={() => setLightbox({ isOpen: false, type: null, src: null })}
          >
            <button 
              style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '8px' }}
              onClick={() => setLightbox({ isOpen: false, type: null, src: null })}
            >
              <X size={32} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '90%', maxHeight: '90%', position: 'relative' }}
            >
              {lightbox.type === 'image' ? (
                <img src={lightbox.src} alt="Fullscreen" style={{ width: '100%', height: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} />
              ) : (
                <video 
                  src={lightbox.src} 
                  autoPlay 
                  controls 
                  controlsList="nodownload noremoteplayback"
                  disablePictureInPicture
                  onContextMenu={(e) => e.preventDefault()}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    maxHeight: '90vh', 
                    objectFit: 'contain', 
                    borderRadius: '12px', 
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none'
                  }} 
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </AnimatedPage>
  );
};

const styles = {
  stepHeader: {
    marginBottom: '40px',
  },
  stepBadge: {
    display: 'inline-block',
    padding: '6px 14px',
    backgroundColor: 'rgba(57,255,20,0.1)',
    color: 'var(--color-electric-green)',
    border: '1px solid rgba(57,255,20,0.2)',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    marginBottom: '16px'
  },
  stepTitle: {
    fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
    letterSpacing: '-0.02em',
    fontWeight: 800,
    marginBottom: '16px'
  },
  stepDesc: {
    fontSize: '1.1rem',
    color: 'var(--color-text-secondary)',
    maxWidth: '720px',
    lineHeight: 1.6,
  },
  staggeredRow: {
    display: 'flex',
    width: '100%',
  },
  fullImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
    borderRadius: '8px', /* slight radius for a cleaner look */
  }
};

export default ProjectDetail;
