import React from 'react';
import { motion } from 'framer-motion';

export const StatCard = ({
  title,
  value,
  subvalue = null,
  icon = null,
  trend = null, // { value: '+12%', isPositive: true }
  progress = null, // { current: 41.5, total: 65, label: '41.5j / 65j' }
  className = '',
  style = {},
  badge = null
}) => {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: 'var(--m84-shadow-md)' }}
      transition={{ duration: 0.2 }}
      style={{
        fontFamily: 'var(--m84-font-family)',
        background: 'var(--m84-surface)',
        borderRadius: 'var(--m84-radius-lg)',
        border: '1.5px solid var(--m84-border-subtle)',
        padding: '20px',
        boxShadow: 'var(--m84-shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '12px',
        position: 'relative',
        ...style
      }}
      className={`m84-stat-card ${className}`}
    >
      {/* Top Header: Title + Icon / Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--m84-text-secondary)' }}>
          {title}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {badge}
          {icon && (
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--m84-radius-md)',
              background: 'var(--m84-primary-light)',
              color: 'var(--m84-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {icon}
            </div>
          )}
        </div>
      </div>

      {/* Main Metric Value */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
        <span style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          color: 'var(--m84-text-primary)',
          letterSpacing: '-0.02em',
          lineHeight: 1.1
        }}>
          {value}
        </span>
        {subvalue && (
          <span style={{ fontSize: '0.85rem', color: 'var(--m84-text-secondary)', fontWeight: 500 }}>
            {subvalue}
          </span>
        )}
      </div>

      {/* Trend or Progress bar */}
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
          <span style={{
            fontWeight: 700,
            color: trend.isPositive ? 'var(--m84-success)' : 'var(--m84-danger)'
          }}>
            {trend.value}
          </span>
          <span style={{ color: 'var(--m84-text-muted)' }}>
            {trend.label || 'par rapport au mois dernier'}
          </span>
        </div>
      )}

      {progress && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
          <div style={{
            height: '6px',
            width: '100%',
            borderRadius: 'var(--m84-radius-full)',
            background: 'var(--m84-border-subtle)',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, (progress.current / progress.total) * 100)}%`,
              borderRadius: 'var(--m84-radius-full)',
              background: 'linear-gradient(90deg, var(--m84-primary), var(--m84-accent))',
              transition: 'width 0.4s ease'
            }} />
          </div>
          {progress.label && (
            <span style={{ fontSize: '0.75rem', color: 'var(--m84-text-muted)', textAlign: 'right' }}>
              {progress.label}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};
