import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const Button = forwardRef(({
  children,
  variant = 'primary', // primary | secondary | outline | ghost | danger | ai
  size = 'md',         // sm | md | lg | icon
  isLoading = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  style = {},
  onClick,
  type = 'button',
  ...props
}, ref) => {
  const isActionDisabled = disabled || isLoading;

  // Base styling
  const baseStyle = {
    fontFamily: 'var(--m84-font-family)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    borderRadius: 'var(--m84-radius-md)',
    cursor: isActionDisabled ? 'not-allowed' : 'pointer',
    opacity: isActionDisabled ? 0.65 : 1,
    transition: 'all var(--m84-transition-base)',
    border: '1.5px solid transparent',
    outline: 'none',
    position: 'relative',
    userSelect: 'none',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    ...style
  };

  // Size variations
  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: '0.8rem', gap: '6px' },
    md: { padding: '9px 18px', fontSize: '0.9rem', gap: '8px' },
    lg: { padding: '12px 24px', fontSize: '1rem', gap: '10px' },
    icon: { width: '40px', height: '40px', padding: 0, borderRadius: 'var(--m84-radius-md)' }
  };

  // Variant variations
  const variantStyles = {
    primary: {
      background: 'var(--m84-primary)',
      color: '#ffffff',
      boxShadow: 'var(--m84-shadow-sm)'
    },
    secondary: {
      background: 'var(--m84-primary-light)',
      color: 'var(--m84-primary)',
      border: '1.5px solid rgba(0, 98, 83, 0.12)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--m84-text-primary)',
      border: '1.5px solid var(--m84-border-subtle)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--m84-text-secondary)',
      border: '1.5px solid transparent'
    },
    danger: {
      background: 'var(--m84-danger)',
      color: '#ffffff',
      boxShadow: '0 2px 8px rgba(220, 38, 38, 0.25)'
    },
    ai: {
      background: 'var(--m84-ai-gradient)',
      color: '#ffffff',
      boxShadow: '0 4px 14px rgba(0, 98, 83, 0.25)'
    }
  };

  const currentVariant = variantStyles[variant] || variantStyles.primary;
  const currentSize = sizeStyles[size] || sizeStyles.md;

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={isActionDisabled}
      onClick={isActionDisabled ? undefined : onClick}
      whileHover={isActionDisabled ? undefined : { scale: 1.015 }}
      whileTap={isActionDisabled ? undefined : { scale: 0.97 }}
      style={{
        ...baseStyle,
        ...currentSize,
        ...currentVariant,
        ...style
      }}
      className={`m84-btn m84-btn-${variant} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 size={16} className="m84-spin" style={{ animation: 'spin 1s linear infinite' }} />
          <span>Chargement...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';
