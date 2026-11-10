/**
 * M84 Design System - Animation Presets & Motion Variants (Framer Motion)
 * Optimized for 60fps micro-interactions with reduced motion support.
 */

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.15 }
  }
};

export const slideUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
  },
  exit: { 
    opacity: 0, 
    y: 8,
    transition: { duration: 0.2 }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.15 }
  }
};

export const drawerSlideUp = {
  hidden: { y: '100%', opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', damping: 28, stiffness: 300 }
  },
  exit: { 
    y: '100%', 
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeIn' }
  }
};

export const staggerContainer = (staggerChildren = 0.06, delayChildren = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren
    }
  }
});

export const buttonTapMotion = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: { duration: 0.15 }
};

export const cardHoverMotion = {
  whileHover: { 
    y: -3,
    boxShadow: '0 12px 28px -5px rgba(0, 98, 83, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.04)'
  },
  transition: { duration: 0.22, ease: 'easeOut' }
};

export const pulseGlowMotion = {
  animate: {
    boxShadow: [
      '0 0 0 0 rgba(0, 98, 83, 0.4)',
      '0 0 0 10px rgba(0, 98, 83, 0)',
      '0 0 0 0 rgba(0, 98, 83, 0)'
    ]
  },
  transition: {
    duration: 2.2,
    repeat: Infinity,
    ease: 'easeInOut'
  }
};
