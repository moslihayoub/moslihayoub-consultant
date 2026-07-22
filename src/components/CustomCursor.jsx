import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ArrowRight, Plus, FileDown, ExternalLink, MousePointer2 } from 'lucide-react';

const getCursorIcon = (target) => {
  if (!target) return null;
  const tag = target.tagName?.toLowerCase();

  if (tag === 'img') return <Eye size={14} strokeWidth={2.5} />;
  if (target.closest?.('.project-card')) return <ArrowRight size={14} strokeWidth={2.5} />;
  if (target.closest?.('.timeline-card')) return <Plus size={14} strokeWidth={2.5} />;

  const href = target.closest?.('a')?.getAttribute('href') || '';
  if (href.includes('.pdf')) return <FileDown size={14} strokeWidth={2.5} />;
  if (href.startsWith('http')) return <ExternalLink size={12} strokeWidth={2.5} />;

  if (tag === 'button' || target.closest?.('button')) return <MousePointer2 size={13} strokeWidth={2.5} />;
  if (tag === 'a' || target.closest?.('a')) return <ArrowRight size={14} strokeWidth={2.5} />;

  return null;
};

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [cursorState, setCursorState] = useState('default');
  const [icon, setIcon] = useState(null);

  useEffect(() => {
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });

    const onOver = (e) => {
      const target = e.target;
      const tag = target.tagName?.toLowerCase();

      if (tag === 'img') {
        setCursorState('image');
        setIcon(<Eye size={16} strokeWidth={2.5} />);
        return;
      }
      if (target.closest?.('.project-card')) {
        setCursorState('card');
        setIcon(<ArrowRight size={16} strokeWidth={2.5} />);
        return;
      }
      if (target.closest?.('.timeline-card')) {
        setCursorState('card');
        setIcon(<Plus size={16} strokeWidth={2.5} />);
        return;
      }

      const isInteractive =
        tag === 'a' || tag === 'button' ||
        target.closest?.('a') || target.closest?.('button') ||
        target.classList?.contains('hover-trigger') ||
        target.closest?.('.hover-trigger');

      if (isInteractive) {
        const detectedIcon = getCursorIcon(target);
        setCursorState('hover');
        setIcon(detectedIcon);
        return;
      }

      setCursorState('default');
      setIcon(null);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, []);

  const isExpanded = cursorState !== 'default';
  const size = isExpanded ? 52 : 20;

  const bgColor =
    cursorState === 'image'   ? 'var(--color-electric-green)' :
    cursorState === 'card'    ? 'var(--color-electric-green)' :
    cursorState === 'hover'   ? 'rgba(255, 255, 255, 0.7)' :
                                'var(--color-electric-green)';

  const iconColor =
    cursorState === 'hover' ? 'var(--color-electric-green)' : '#FFF';

  return (
    <>
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 200000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          width: `${size}px`,
          height: `${size}px`,
        }}
        animate={{
          x: pos.x - size / 2,
          y: pos.y - size / 2,
          backgroundColor: bgColor,
          border: isExpanded && cursorState === 'hover'
            ? '1.5px solid var(--color-electric-green)'
            : '1px solid transparent',
          backdropFilter: cursorState === 'hover' ? 'blur(4px)' : 'none',
        }}
        transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.45 }}
      >
        <AnimatePresence>
          {isExpanded && icon && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.12 }}
              style={{
                color: iconColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                userSelect: 'none',
              }}
            >
              {icon}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Trailing dot */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-electric-green)',
          pointerEvents: 'none',
          zIndex: 200001,
        }}
        animate={{
          x: pos.x - 3,
          y: pos.y - 3,
          opacity: isExpanded ? 0 : 1,
        }}
        transition={{ type: 'tween', ease: 'linear', duration: 0 }}
      />
    </>
  );
};

export default CustomCursor;
