import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ProjectCard = ({ project, onClick }) => {
  const { lang } = useLanguage();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-60, 60], [6, -6]);
  const rotateY = useTransform(x, [-60, 60], [-6, 6]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - (rect.left + rect.width / 2));
    y.set(e.clientY - (rect.top + rect.height / 2));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className="project-card hover-trigger"
      onClick={() => onClick(project)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }}
      style={{ ...styles.cardWrapper, rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={styles.card}
        whileHover={{ boxShadow: '0 20px 40px rgba(0,0,0,0.12)', y: -4 }}
        transition={{ duration: 0.25 }}
      >
        <div style={styles.imageContainer}>
          <img src={project.image} alt={project.title} style={styles.image} />
          {project.isProtected && (
            <div style={styles.protectedBadge}>
              <Lock size={12} color="#fff" />
              Accès restreint
            </div>
          )}
        </div>
        <div style={styles.content}>
          <h3 style={styles.title}>{project.title}</h3>
          <p style={styles.client}>{project.client}</p>
          <p style={{...styles.description, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{project.shortDesc[lang] || project.shortDesc}</p>
          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '12px 0' }} />
          <p style={styles.techDesc}>{project.techDesc[lang] || project.techDesc}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const styles = {
  cardWrapper: {
    cursor: 'none',
    display: 'block',
    transformStyle: 'preserve-3d',
    height: '100%',
  },
  card: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid var(--color-border)',
    transition: 'border-color 0.3s ease',
  },
  imageContainer: {
    width: '100%',
    paddingTop: '65%',
    position: 'relative',
    backgroundColor: 'var(--color-surface)',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    top: '24px',
    left: '24px',
    width: 'calc(100% - 48px)',
    height: 'calc(100% - 48px)',
    objectFit: 'contain',
    transition: 'transform 0.5s ease',
  },
  protectedBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'var(--color-electric-green)',
    color: '#fff',
    fontSize: '0.72rem',
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: '999px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  content: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    fontSize: '1.2rem',
    marginBottom: '4px',
    color: 'var(--color-text-primary)',
  },
  client: {
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    color: 'var(--color-electric-green)',
    fontWeight: 700,
    marginBottom: '12px',
  },
  description: {
    fontSize: '0.9rem',
    marginBottom: 0,
    color: 'var(--color-text-secondary)',
  },
  techDesc: {
    fontSize: '0.85rem',
    color: 'var(--color-text-secondary)',
    opacity: 0.8,
    marginBottom: 0,
    flex: 1
  }
};

export default ProjectCard;
