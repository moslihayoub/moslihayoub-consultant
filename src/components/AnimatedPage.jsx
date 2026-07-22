import { motion } from 'framer-motion';

const animations = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const AnimatedPage = ({ children, className = '' }) => {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
      className={`page-container ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
