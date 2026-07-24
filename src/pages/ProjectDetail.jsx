import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';
import { useLanguage } from '../contexts/LanguageContext';
import { projectsData } from '../data/projects';

const ProjectDetail = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const project = projectsData.find(p => p.id === 'the-factory');
  
  if (!project) return null;

  return (
    <AnimatedPage>
      <div className="page-wrapper" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <div className="container">
          
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '32px' }}>
            <span onClick={() => navigate('/work')} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-trigger">Work</span>
            <ChevronRight size={16} />
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{project.title}</span>
          </div>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ textAlign: 'center', marginBottom: '48px' }}>
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
          </motion.div>

          {/* Main Cover (No Border) */}
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} style={{ marginBottom: '80px', overflow: 'hidden' }}>
            <img src="/assets/works/filmmaker/the-factory.webp" alt="The Factory" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </motion.div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
            
            {/* Étape 1 : Pré-production */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }}>
              <div style={styles.stepHeader}>
                <div style={styles.stepBadge}>PRÉ-PRODUCTION</div>
                <h2 style={styles.stepTitle}>{lang === 'fr' ? "Scénarisation & Concept" : "Scripting & Concept"}</h2>
                <p style={styles.stepDesc}>
                  {lang === 'fr' 
                    ? "Tout commence par l'écriture. J'ai utilisé Gemini, ChatGPT et Claude pour développer le script, définir les arcs narratifs et le découpage de la série. Le tout est centralisé dans NotebookLM, véritable bible du projet The Factory." 
                    : "It all starts with writing. I used Gemini, ChatGPT, and Claude to develop the script, define the narrative arcs, and the breakdown of the series. Everything is centralized in NotebookLM, the true bible of The Factory project."}
                </p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={styles.staggeredRow}>
                  <img src="/assets/works/filmmaker/idea-storyboard.webp" alt="Idea Storyboard" style={styles.fullImage} />
                </div>
                <div style={{...styles.staggeredRow, justifyContent: 'flex-end'}}>
                  <img src="/assets/works/filmmaker/character-draw.webp" alt="Character Draw" style={styles.fullImage} />
                </div>
              </div>
            </motion.section>

            {/* Étape 2 : Production */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }}>
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <img src="/assets/works/filmmaker/character-sheet/ayoub.webp" alt="Character 1" style={styles.fullImage} />
                  <img src="/assets/works/filmmaker/character-sheet/chicco.webp" alt="Character 2" style={styles.fullImage} />
                  <img src="/assets/works/filmmaker/character-sheet/si-abdeljabbar.webp" alt="Character 3" style={{...styles.fullImage, gridColumn: '1 / -1'}} />
                </div>
              </div>

              {/* Décors et Storyboards - Alternés */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={styles.staggeredRow}>
                  <img src="/assets/works/filmmaker/decor-sheet/decor-outside.webp" alt="Decor" style={styles.fullImage} />
                </div>
                <div style={{...styles.staggeredRow, justifyContent: 'flex-end'}}>
                  <img src="/assets/works/filmmaker/decor-sheet/meeting-room.webp" alt="Meeting Room" style={styles.fullImage} />
                </div>
                <div style={styles.staggeredRow}>
                  <img src="/assets/works/filmmaker/prop-sheet/bike.webp" alt="Prop Bike" style={styles.fullImage} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px' }}>
                  <img src="/assets/works/filmmaker/storyboard/storyboard-action.webp" alt="Storyboard Action" style={styles.fullImage} />
                  <img src="/assets/works/filmmaker/storyboard/storyboard-credit-2.webp" alt="Storyboard Credit 2" style={styles.fullImage} />
                  <img src="/assets/works/filmmaker/storyboard/storyboard-credit.webp" alt="Storyboard Credit" style={styles.fullImage} />
                </div>
                
                <div style={styles.staggeredRow}>
                  <img src="/assets/works/filmmaker/lab.webp" alt="Lab" style={styles.fullImage} />
                </div>
              </div>
            </motion.section>

            {/* Étape 3 : Post-production */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }}>
              <div style={styles.stepHeader}>
                <div style={styles.stepBadge}>POST-PRODUCTION</div>
                <h2 style={styles.stepTitle}>{lang === 'fr' ? "Animation & Montage Final" : "Animation & Final Edit"}</h2>
                <p style={styles.stepDesc}>
                  {lang === 'fr' 
                    ? "Exportation des assets générés et montage dynamique des scènes avec l'IA vidéo. J'assemble les séquences pour donner le rythme comique propre à The Factory, tel un vrai making-of." 
                    : "Exporting generated assets and dynamic editing of scenes with Video AI. I assemble the sequences to give the comedic rhythm specific to The Factory, like a true making-of."}
                </p>
              </div>
              
              {/* Vidéos - 2 par ligne */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                {[
                  "btbAuvsQiHc", "xxAjoV6bi4o", "F1W3iohmdTM", "EMOsKp7OTHQ", "rayz4dW8NUM"
                ].map((videoId, idx) => (
                  <div key={idx} style={styles.videoContainer}>
                    {/* Transparent overlay to disable right-click and interaction */}
                    <div style={styles.videoOverlay} onContextMenu={(e) => e.preventDefault()}></div>
                    <iframe 
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&cc_load_policy=0&playlist=${videoId}&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1`}
                      style={styles.iframe} 
                      allow="autoplay; encrypted-media" 
                      title={`Video ${idx}`} 
                      tabIndex="-1"
                    />
                  </div>
                ))}
              </div>
            </motion.section>
            
          </div>
        </div>
      </div>
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
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    paddingBottom: '56.25%',
    height: 0,
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#000'
  },
  videoOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 10,
    cursor: 'default'
  },
  iframe: {
    position: 'absolute',
    top: '-15%',
    left: '-15%',
    width: '130%',
    height: '130%',
    border: 'none',
    pointerEvents: 'none'
  }
};

export default ProjectDetail;
