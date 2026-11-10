import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({
  children,
  variant = 'default', // default | subtle | glass | interactive
  className = '',
  style = {},
  onClick,
  ...props
}) => {
  const baseStyle = {
    fontFamily: 'var(--m84-font-family)',
    borderRadius: 'var(--m84-radius-lg)',
    border: '1.5px solid var(--m84-border-subtle)',
    background: 'var(--m84-surface)',
    boxShadow: 'var(--m84-shadow-sm)',
    overflow: 'hidden',
    transition: 'all var(--m84-transition-base)',
    ...style
  };

  const variantStyles = {
    default: {
      background: 'var(--m84-surface)'
    },
    subtle: {
      background: 'var(--m84-surface-subtle)',
      borderColor: 'var(--m84-border-subtle)'
    },
    glass: {
      background: 'var(--m84-glass-bg)',
      backdropFilter: 'var(--m84-glass-blur)',
      borderColor: 'var(--m84-glass-border)'
    },
    interactive: {
      cursor: 'pointer'
    }
  };

  const currentVariant = variantStyles[variant] || variantStyles.default;

  if (variant === 'interactive' || onClick) {
    return (
      <motion.div
        whileHover={{ y: -3, boxShadow: 'var(--m84-shadow-md)', borderColor: 'rgba(0, 98, 83, 0.3)' }}
        whileTap={{ scale: 0.99 }}
        onClick={onClick}
        style={{ ...baseStyle, ...currentVariant, ...style }}
        className={`m84-card m84-card-${variant} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      style={{ ...baseStyle, ...currentVariant, ...style }}
      className={`m84-card m84-card-${variant} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, style = {}, className = '', ...props }) => (
  <div
    style={{
      padding: '20px 24px 12px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      ...style
    }}
    className={`m84-card-header ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle = ({ children, style = {}, className = '', ...props }) => (
  <h3
    style={{
      margin: 0,
      fontSize: '1.15rem',
      fontWeight: 700,
      color: 'var(--m84-text-primary)',
      letterSpacing: '-0.01em',
      ...style
    }}
    className={`m84-card-title ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription = ({ children, style = {}, className = '', ...props }) => (
  <p
    style={{
      margin: 0,
      fontSize: '0.85rem',
      color: 'var(--m84-text-secondary)',
      lineHeight: 1.5,
      ...style
    }}
    className={`m84-card-desc ${className}`}
    {...props}
  >
    {children}
  </p>
);

export const CardContent = ({ children, style = {}, className = '', ...props }) => (
  <div
    style={{
      padding: '12px 24px 20px 24px',
      ...style
    }}
    className={`m84-card-content ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardFooter = ({ children, style = {}, className = '', ...props }) => (
  <div
    style={{
      padding: '14px 24px',
      borderTop: '1px solid var(--m84-border-subtle)',
      background: 'var(--m84-surface-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      ...style
    }}
    className={`m84-card-footer ${className}`}
    {...props}
  >
    {children}
  </div>
);
