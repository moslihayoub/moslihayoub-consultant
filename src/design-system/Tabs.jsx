import React from 'react';
import { motion } from 'framer-motion';

export const Tabs = ({
  tabs = [], // [{ id: 'overview', label: 'Vue d\'ensemble', icon: <Icon /> }]
  activeTab,
  onChange,
  className = '',
  style = {}
}) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'var(--m84-surface-subtle)',
        padding: '4px',
        borderRadius: 'var(--m84-radius-md)',
        border: '1px solid var(--m84-border-subtle)',
        gap: '4px',
        fontFamily: 'var(--m84-font-family)',
        ...style
      }}
      className={`m84-tabs ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: 'var(--m84-radius-sm)',
              border: 'none',
              background: 'transparent',
              fontSize: '0.86rem',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? 'var(--m84-primary)' : 'var(--m84-text-secondary)',
              cursor: 'pointer',
              zIndex: 1,
              transition: 'color var(--m84-transition-fast)'
            }}
          >
            {isActive && (
              <motion.div
                layoutId="m84-active-tab"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'var(--m84-surface)',
                  borderRadius: 'var(--m84-radius-sm)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                  zIndex: -1
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              />
            )}
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge && (
              <span style={{
                fontSize: '0.72rem',
                padding: '1px 6px',
                borderRadius: 'var(--m84-radius-full)',
                background: isActive ? 'var(--m84-primary-light)' : 'var(--m84-border-subtle)',
                color: isActive ? 'var(--m84-primary)' : 'var(--m84-text-muted)',
                fontWeight: 700
              }}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
