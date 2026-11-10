import React from 'react';

export const Badge = ({
  children,
  variant = 'default', // default | success | warning | danger | info | outline | ai
  size = 'md',        // sm | md
  icon = null,
  style = {},
  className = '',
  ...props
}) => {
  const baseStyle = {
    fontFamily: 'var(--m84-font-family)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    fontWeight: 600,
    borderRadius: 'var(--m84-radius-full)',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    userSelect: 'none',
    ...style
  };

  const sizeStyles = {
    sm: { padding: '3px 8px', fontSize: '0.72rem' },
    md: { padding: '5px 12px', fontSize: '0.8rem' }
  };

  const variantStyles = {
    default: {
      background: 'var(--m84-primary-light)',
      color: 'var(--m84-primary)',
      border: '1px solid rgba(0, 98, 83, 0.18)'
    },
    success: {
      background: 'var(--m84-success-bg)',
      color: 'var(--m84-success)',
      border: '1px solid var(--m84-success-border)'
    },
    warning: {
      background: 'var(--m84-warning-bg)',
      color: 'var(--m84-warning)',
      border: '1px solid var(--m84-warning-border)'
    },
    danger: {
      background: 'var(--m84-danger-bg)',
      color: 'var(--m84-danger)',
      border: '1px solid var(--m84-danger-border)'
    },
    info: {
      background: 'var(--m84-info-bg)',
      color: 'var(--m84-info)',
      border: '1px solid var(--m84-info-border)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--m84-text-secondary)',
      border: '1px solid var(--m84-border-subtle)'
    },
    ai: {
      background: 'rgba(0, 98, 83, 0.08)',
      color: 'var(--m84-primary)',
      border: '1px solid rgba(0, 98, 83, 0.3)',
      boxShadow: '0 0 10px rgba(0, 98, 83, 0.1)'
    }
  };

  const currentVariant = variantStyles[variant] || variantStyles.default;
  const currentSize = sizeStyles[size] || sizeStyles.md;

  return (
    <span
      style={{
        ...baseStyle,
        ...currentSize,
        ...currentVariant,
        ...style
      }}
      className={`m84-badge m84-badge-${variant} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
};
