import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({
  isOpen,
  onClose,
  type = 'info', // success | warning | error | info
  title,
  message,
  duration = 4000
}) => {
  useEffect(() => {
    if (isOpen && duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  const icons = {
    success: <CheckCircle2 size={18} color="var(--m84-success)" />,
    warning: <AlertTriangle size={18} color="var(--m84-warning)" />,
    error: <AlertCircle size={18} color="var(--m84-danger)" />,
    info: <Info size={18} color="var(--m84-info)" />
  };

  const borderColors = {
    success: 'var(--m84-success)',
    warning: 'var(--m84-warning)',
    error: 'var(--m84-danger)',
    info: 'var(--m84-info)'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            maxWidth: '380px',
            width: 'calc(100vw - 48px)',
            background: 'var(--m84-surface)',
            borderRadius: 'var(--m84-radius-md)',
            border: '1.5px solid var(--m84-border-subtle)',
            borderLeft: `4px solid ${borderColors[type] || borderColors.info}`,
            boxShadow: 'var(--m84-shadow-lg)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            fontFamily: 'var(--m84-font-family)'
          }}
        >
          <div style={{ marginTop: '2px' }}>{icons[type]}</div>
          <div style={{ flex: 1 }}>
            {title && (
              <h5 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--m84-text-primary)' }}>
                {title}
              </h5>
            )}
            {message && (
              <p style={{ margin: title ? '4px 0 0 0' : 0, fontSize: '0.82rem', color: 'var(--m84-text-secondary)', lineHeight: 1.4 }}>
                {message}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--m84-text-muted)',
              padding: '2px'
            }}
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
