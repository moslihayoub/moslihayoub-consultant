import { motion, useMotionValue, useTransform } from 'framer-motion';

const TiltWrapper = ({ children, style, className, onClick }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-60, 60], [3, -3]);
  const rotateY = useTransform(x, [-60, 60], [-3, 3]);

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
      className={className}
      onClick={onClick}
      style={{
        display: 'inline-block',
        transformStyle: 'preserve-3d',
        transformPerspective: 900,
        rotateX,
        rotateY,
        ...style
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
};

export default TiltWrapper;
